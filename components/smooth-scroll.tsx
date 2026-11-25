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

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    let destroyed = false;
    let removeTicker: (() => void) | undefined;

    const boot = async () => {
      const [{ default: LenisCtor }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (destroyed) return;
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
      ScrollTrigger.refresh();
      removeTicker = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
        document.documentElement.classList.remove("is-smooth");
      };

      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) lenis.scrollTo(target as HTMLElement, { offset: -12 });
      }
    };

    void boot();

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href.length < 2) return;
      const lenis = lenisRef.current;
      const target = document.querySelector(href);
      if (!lenis || !target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -12 });
      history.pushState(null, "", href);
    };
    document.addEventListener("click", onClick);

    return () => {
      destroyed = true;
      document.removeEventListener("click", onClick);
      removeTicker?.();
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (!target) return;
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -12 });
      return;
    }
    if (lenis) lenis.scrollTo(0, { immediate: true });
  }, [pathname]);

  const api: SmoothApi = {
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
  };

  return <SmoothContext.Provider value={api}>{children}</SmoothContext.Provider>;
}
