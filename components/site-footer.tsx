"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ResumeDownload } from "@/components/resume-download";
import { person } from "@/lib/site";

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };
  return (
    <button type="button" className="footer-mail" onClick={copy}>
      <span>{person.email}</span>
      <em>{copied ? "Copied" : "Copy"}</em>
    </button>
  );
}

export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const apply = () => {
      const height = node.scrollHeight;
      document.documentElement.style.setProperty("--footer-h", `${height}px`);
      const wide = window.matchMedia("(min-width: 960px)").matches;
      const fit = wide && height <= window.innerHeight - 8;
      document.documentElement.classList.toggle("footer-reveal", fit);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
      document.documentElement.classList.remove("footer-reveal");
    };
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    let dead = false;
    let revert: (() => void) | undefined;
    const run = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (dead) return;
      gsap.registerPlugin(ScrollTrigger);
      const title = root.querySelector("[data-close-title]");
      const rule = root.querySelector("[data-close-rule]");
      const copy = root.querySelector("[data-close-copy]");
      const items = root.querySelectorAll(".close-list > li");
      const trigger = ".page-sheet";
      const start = "bottom bottom";
      const end = "bottom 58%";
      const ctx = gsap.context(() => {
        if (title) {
          gsap.fromTo(
            title,
            { clipPath: "inset(100% 0 0 0)", scale: 1.12 },
            {
              clipPath: "inset(0% 0 0 0)",
              scale: 1,
              transformOrigin: "0% 100%",
              ease: "none",
              scrollTrigger: { trigger, start, end, scrub: 0.4 },
            },
          );
        }
        if (rule) {
          gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger, start, end, scrub: 0.4 } });
        }
        if (copy) {
          gsap.from(copy, { y: 16, opacity: 0, ease: "power3.out", scrollTrigger: { trigger, start: end } });
        }
        if (items.length) {
          gsap.from(items, {
            y: 14,
            opacity: 0,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger, start: end },
          });
        }
      }, root);
      revert = () => ctx.revert();
    };
    void run();
    return () => {
      dead = true;
      revert?.();
    };
  }, []);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
    const tick = () => setTime(format());
    const start = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer className="site-footer" id="contact" ref={ref}>
      <div className="footer-shade" aria-hidden="true" />
      <div className="footer-inner">
        <div className="close-band">
          <p className="eyebrow">
            <span className="status-dot" aria-hidden="true" />
            {person.availability}
          </p>
          <h2 data-close-title>Let&apos;s build something</h2>
          <span className="close-rule" data-close-rule aria-hidden="true" />
          <p className="close-lede" data-close-copy>One note is enough. The email copies, the resume is the PDF, and the form is there if you would rather write.</p>
          <ul className="close-list">
            <li>
              <CopyEmail />
            </li>
            <li>
              <a href={person.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={person.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <ResumeDownload>Resume</ResumeDownload>
            </li>
            <li>
              <Link href="/contact">Write a note</Link>
            </li>
          </ul>
        </div>

        <div className="footer-bar">
          <nav className="footer-nav" aria-label="Footer">
            <Link href="/work">Work</Link>
            <Link href="/about">About</Link>
            <Link href="/design-system">Calibre</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <p className="footer-clock">
            <span>
              {time ?? "—:—:—"} <span className="footer-tz">IST</span>
            </span>
            <span className="footer-place">{person.location}</span>
          </p>
          <p className="footer-colophon">Calibre. {person.name}.</p>
          <button type="button" className="to-top" onClick={toTop} aria-label="Back to top">
            <svg viewBox="0 0 36 36" aria-hidden="true">
              <circle className="to-top-track" cx="18" cy="18" r="16" />
              <circle className="to-top-value" cx="18" cy="18" r="16" />
            </svg>
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
