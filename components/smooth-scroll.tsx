"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef } from "react";
import type Lenis from "lenis";

type SmoothApi = {
  stop: () => void;
  start: () => void;
};

const SmoothContext = createContext<SmoothApi>({
  stop: () => undefined,
  start: () => undefined,
});

export function useSmooth() {
  return useContext(SmoothContext);
}

function hashTarget() {
  const hash = window.location.hash;
  if (hash.length < 2) return null;
  const target = document.querySelector(hash);
  return target instanceof HTMLElement ? target : null;
}

function offsetFor(target: HTMLElement) {
  return Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 12;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const skipFirst = useRef(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    let destroyed = false;
    let removeTicker: (() => void) | undefined;
    let removeRefresh: (() => void) | undefined;

    history.scrollRestoration = "manual";

    const place = (lenis: Lenis | null, immediate = true) => {
      const target = hashTarget();
      if (target) {
        const offset = -offsetFor(target);
        if (lenis) lenis.scrollTo(target, { offset, immediate });
        else {
          const top = target.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: "auto" });
        }
        return;
      }
      if (lenis) lenis.scrollTo(0, { immediate });
      else window.scrollTo({ top: 0, behavior: "auto" });
    };

    const boot = async () => {
      if (reduce.matches || !fine.matches) {
        place(null);
        return;
      }
      const [{ default: LenisCtor }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (destroyed || reduce.matches || !fine.matches) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new LenisCtor({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenisRef.current = lenis;
      document.documentElement.classList.add("is-smooth");

      const refresh = () => {
        if (!destroyed) ScrollTrigger.refresh();
      };
      const onResize = () => refresh();
      window.addEventListener("resize", onResize);
      window.addEventListener("load", refresh);
      void document.fonts.ready.then(refresh);
      removeRefresh = () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("load", refresh);
      };
      refresh();
      place(lenis);

      removeTicker = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
        document.documentElement.classList.remove("is-smooth");
      };
    };

    const onMotion = () => {
      if (reduce.matches) {
        removeTicker?.();
        removeTicker = undefined;
        document.documentElement.classList.remove("is-smooth");
      } else if (!lenisRef.current && fine.matches) {
        void boot();
      }
    };
    reduce.addEventListener("change", onMotion);
    void boot();

    const onClick = (event: MouseEvent) => {
      if (reduce.matches) return;
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href.length < 2) return;
      const lenis = lenisRef.current;
      const target = document.querySelector(href);
      if (!lenis || !(target instanceof HTMLElement)) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -offsetFor(target) });
      history.pushState(null, "", href);
    };
    document.addEventListener("click", onClick);

    return () => {
      destroyed = true;
      reduce.removeEventListener("change", onMotion);
      document.removeEventListener("click", onClick);
      removeRefresh?.();
      removeTicker?.();
      history.scrollRestoration = "auto";
    };
  }, []);

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    let frames = 0;
    let raf = 0;
    const settle = () => {
      const lenis = lenisRef.current;
      const target = hashTarget();
      if (target) {
        const offset = -offsetFor(target);
        if (lenis) lenis.scrollTo(target, { offset, immediate: true });
        else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: "auto" });
      } else if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      frames += 1;
      if (frames < 3) raf = requestAnimationFrame(settle);
    };
    raf = requestAnimationFrame(settle);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  const api: SmoothApi = {
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
  };

  return <SmoothContext.Provider value={api}>{children}</SmoothContext.Provider>;
}
