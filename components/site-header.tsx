"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useSmooth } from "@/components/smooth-scroll";

const links = [
  { href: "/work", label: "Work" },
  { href: "/design-system", label: "Calibre" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

function isCurrent(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openPath, setOpenPath] = useState(pathname);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const smooth = useSmooth();

  if (pathname !== openPath) {
    setOpenPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    smooth.stop();
    const panel = panelRef.current;
    const focusable = panel ? Array.from(panel.querySelectorAll<HTMLElement>("a, button")) : [];
    focusable[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
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
      smooth.start();
    };
  }, [open, smooth]);

  return (
    <header className="site-header" style={{ viewTransitionName: "site-header" }}>
      <Link href="/" className="wordmark" transitionTypes={["nav-back"]}>
        <span className="wordmark-mark" aria-hidden="true" />
        Akhilendra
      </Link>
      <nav className="nav-desktop" aria-label="Primary">
        {links.map((link) =>
          link.href.startsWith("/#") ? (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
              transitionTypes={["nav-forward"]}
            >
              {link.label}
            </Link>
          ),
        )}
        <Link href="/resume" transitionTypes={["nav-forward"]}>
          Resume
        </Link>
      </nav>
      <button
        ref={toggleRef}
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open ? (
        <div
          id="site-menu"
          ref={panelRef}
          className="nav-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <p id={titleId} className="sr-only">
            Site
          </p>
          <nav aria-label="Mobile">
            {links.map((link) =>
              link.href.startsWith("/#") ? (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href} transitionTypes={["nav-forward"]}>
                  {link.label}
                </Link>
              ),
            )}
            <Link href="/resume" transitionTypes={["nav-forward"]}>
              Resume
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
