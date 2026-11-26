"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/magnetic";
import { ResumeDownload } from "@/components/resume-download";
import { liveTools, workGroups } from "@/lib/menu";
import { person } from "@/lib/site";
import { resumeSkills } from "@/lib/resume";

const tools = resumeSkills.flatMap((group) => group.items);

function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
      <path
        fill="currentColor"
        d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.2-4.6-5.1 0-1.1.4-2 1-2.8-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.4 9.4 0 0 1 5 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.8 0 4-2.3 4.8-4.6 5.1.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 4-1.4 6.9-5.2 6.9-9.7C22 6.6 17.5 2 12 2Z"
      />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
      <path
        fill="currentColor"
        d="M4.7 3.3A2.2 2.2 0 1 0 4.7 7.7 2.2 2.2 0 0 0 4.7 3.3ZM3 9h3.4v12H3V9Zm6.2 0H12.5v1.6h.1c.5-.9 1.6-1.8 3.3-1.8 3.5 0 4.2 2.3 4.2 5.3V21H16.7v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21H9.2V9Z"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
      <path
        fill="currentColor"
        d="M3 5.5h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Zm9 7.2 8.2-5.2H3.8L12 12.7ZM3.2 17.3l5.4-4.1-1.2-1.1-5.4 4.1v1.1Zm17.6 0v-1.1l-5.4-4.1-1.2 1.1 5.4 4.1Z"
      />
    </svg>
  );
}

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
  const groups = workGroups();
  const openSource = groups.find((group) => group.id === "open");
  const live = liveTools();

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
    <footer className="site-footer" ref={ref}>
      <div className="footer-shade" aria-hidden="true">
        <span className="footer-orb footer-orb-a" />
        <span className="footer-orb footer-orb-b" />
        <span className="footer-noise" />
      </div>
      <div className="footer-inner">
        <div className="footer-close">
          <div className="footer-hero">
            <p className="eyebrow">
              <span className="status-dot" aria-hidden="true" />
              {person.availability}
            </p>
            <h2>Let&apos;s build something</h2>
            <Magnetic>
              <Link className="btn btn-solid" href="/contact">
                Start a conversation
              </Link>
            </Magnetic>
          </div>
          <ul className="footer-actions">
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
              <span className="footer-where">
                Bengaluru
                <span>
                  IST <span className="footer-clock-inline">{time ?? "—:—:—"}</span>
                </span>
              </span>
            </li>
          </ul>
        </div>

        <p className="footer-wordmark" aria-hidden="true">
          <span className="is-outline">Akhilendra</span>
          <span className="is-fill">Akhilendra</span>
        </p>

        <p className="sr-only">Tools: {tools.join(", ")}</p>
        <div className="foot-marquee" aria-hidden="true">
          <div className="foot-marquee-track">
            {[...tools, ...tools].map((item, index) => (
              <span key={`${item}-${index}`}>
                {item}
                <i />
              </span>
            ))}
          </div>
        </div>

        <div className="footer-columns">
          <div>
            <h3>Work</h3>
            {groups.map((group) => (
              <div key={group.id} className="footer-group">
                <p>{group.label}</p>
                <ul>
                  {group.projects.map((project) => (
                    <li key={project.slug}>
                      <Link href={`/work/${project.slug}`}>{project.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div>
            <h3>Live tools</h3>
            <ul>
              {live.map((project) => (
                <li key={project.slug}>
                  <a href={project.live} target="_blank" rel="noreferrer">
                    {project.title}
                  </a>
                </li>
              ))}
            </ul>
            <h3>Open source</h3>
            <ul>
              <li>
                <a href={person.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </li>
              {openSource?.projects.map((project) => (
                <li key={project.slug}>
                  <a href={project.repo} target="_blank" rel="noreferrer">
                    {project.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>About</h3>
            <ul>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/design-system">Calibre</Link>
              </li>
              <li>
                <Link href="/resume">Resume</Link>
              </li>
              <li>
                <Link href="/work">Selected work</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Contact</h3>
            <ul>
              <li>
                <a href={`mailto:${person.email}`}>{person.email}</a>
              </li>
              <li>
                <Link href="/contact">Write a note</Link>
              </li>
              <li>
                <ResumeDownload>Download resume</ResumeDownload>
              </li>
            </ul>
            <ul className="socials">
              <li>
                <a className="social" href={person.github} target="_blank" rel="noreferrer">
                  <IconGithub />
                  <span className="sr-only">GitHub</span>
                </a>
              </li>
              <li>
                <a className="social" href={person.linkedin} target="_blank" rel="noreferrer">
                  <IconLinkedIn />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </li>
              <li>
                <a className="social" href={`mailto:${person.email}`}>
                  <IconMail />
                  <span className="sr-only">Email</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-meta">
          <p className="footer-clock">
            <span className="status-dot" aria-hidden="true" />
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
