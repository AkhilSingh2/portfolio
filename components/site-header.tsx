"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Magnetic } from "@/components/magnetic";
import { MegaMenu } from "@/components/mega-menu";
import { ResumeDownload } from "@/components/resume-download";
import { useSmooth } from "@/components/smooth-scroll";

const links = [
  { href: "/design-system", label: "Calibre" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openPath, setOpenPath] = useState(pathname);
  const [compact, setCompact] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const smooth = useSmooth();
  const reduce = useReducedMotion();
  const workCurrent = isCurrent(pathname, "/work");

  if (pathname !== openPath) {
    setOpenPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    smooth.stop();
    const sheet = document.querySelector(".page-sheet");
    const footer = document.querySelector(".site-footer");
    sheet?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");

    const panel = panelRef.current;
    const items = () => (panel ? Array.from(panel.querySelectorAll<HTMLElement>("[data-menuitem]")) : []);
    items()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        openerRef.current?.focus();
        return;
      }
      const list = items();
      if (list.length === 0) return;
      const current = document.activeElement as HTMLElement | null;
      const index = current ? list.indexOf(current) : -1;

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        list[(index + 1 + list.length) % list.length]?.focus();
        return;
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        list[(index - 1 + list.length) % list.length]?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      sheet?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      smooth.start();
    };
  }, [open, smooth]);

  const openFrom = (button: HTMLButtonElement) => {
    openerRef.current = button;
    setOpen((value) => !value);
  };

  return (
    <header className={`site-nav${compact ? " is-compact" : ""}`} style={{ viewTransitionName: "site-header" }}>
      <div className="nav-pill">
        <Link href="/" className="wordmark" transitionTypes={["nav-back"]} onClick={() => setOpen(false)}>
          <span className="wordmark-mark" aria-hidden="true" />
          Akhilendra
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <button
            type="button"
            className="nav-link nav-work"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-haspopup="dialog"
            aria-current={workCurrent ? "page" : undefined}
            onClick={(event) => openFrom(event.currentTarget)}
          >
            {(open || workCurrent) && (
              <motion.span
                layoutId="nav-current"
                className="nav-current"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <Magnetic>
              <span>Work</span>
            </Magnetic>
          </button>
          {links.map((link) => {
            const current = isCurrent(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                aria-current={current ? "page" : undefined}
                transitionTypes={["nav-forward"]}
                onClick={() => setOpen(false)}
              >
                {current && (
                  <motion.span
                    layoutId="nav-current"
                    className="nav-current"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Magnetic>
                  <span>{link.label}</span>
                </Magnetic>
              </Link>
            );
          })}
        </nav>
        <ResumeDownload className="nav-pdf" aria-label="Download resume">
          PDF
        </ResumeDownload>
        <button
          type="button"
          className="nav-burger"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-haspopup="dialog"
          onClick={(event) => openFrom(event.currentTarget)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <span className="nav-progress" aria-hidden="true" />
      </div>
      <AnimatePresence>
        {open ? <MegaMenu ref={panelRef} onClose={() => setOpen(false)} titleId={titleId} /> : null}
      </AnimatePresence>
    </header>
  );
}
