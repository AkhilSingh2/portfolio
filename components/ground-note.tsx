"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { person } from "@/lib/site";

const building = [
  { href: "/work/launchpad", title: "LaunchPad", line: "A SaaS starter, from the session to the plan on the server." },
  { href: "/work/cadence", title: "Cadence", line: "A voice-first coach that reshapes the day from recovery and mood." },
  { href: "/work/buzzroom", title: "Buzzroom", line: "A trivia night for one screen and a room full of phones." },
];

const toolbox = [
  { title: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind"] },
  { title: "Backend", items: ["Node", "Postgres", "Neon", "REST", "WebSockets"] },
  { title: "AI", items: ["LLM APIs", "RAG"] },
  { title: "Cloud", items: ["AWS Amplify", "Vercel", "GitHub Actions"] },
];

export function GroundNote() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("is-in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) node.classList.add("is-in");
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="ground" ref={ref} data-obstacle aria-label="Now and toolbox">
      <div className="ground-intro">
        <p className="thread-kicker">Now</p>
        <h2>What I’m building, and what I’m open to.</h2>
      </div>
      <div className="now-grid">
        <div>
          <h3>Building</h3>
          <ul className="now-list">
            {building.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.title}</Link>
                <p>{item.line}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Open to</h3>
          <p>{person.availability}. Bengaluru or remote.</p>
          <h3>Exploring</h3>
          <p>AI agents and realtime collaboration.</p>
        </div>
      </div>
      <div>
        <p className="thread-kicker">Toolbox</p>
        <ul className="tool-grid">
          {toolbox.map((group) => (
            <li key={group.title}>
              <strong>{group.title}</strong>
              <span>{group.items.join(" · ")}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
