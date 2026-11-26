"use client";

import { useEffect, useRef } from "react";
import { ResumeDownload } from "@/components/resume-download";
import { person } from "@/lib/site";

const roles = [
  {
    when: "2024 – present",
    where: "A UK games publisher",
    line: "Full-stack platforms for media and localisation, and the public site. Moving that site to Next.js cut load time by 45%.",
  },
  {
    when: "2023 – 2024",
    where: "Groove Digital",
    line: "React pages tuned for search. Organic traffic rose 40% in three months.",
  },
  {
    when: "2021 – 2023",
    where: "Unthinkable Solutions",
    line: "A CMS and a desktop app that cut publishing turnaround by 50%.",
  },
];

const capabilities = [
  { title: "Frontend", line: "React, Next.js, TypeScript, and design systems." },
  { title: "Backend and APIs", line: "Python, FastAPI, and the services behind the screen." },
  { title: "AI", line: "Models in the product, from the prompt to the answer." },
  { title: "Cloud and DevOps", line: "AWS, Kubernetes, and the pipelines that ship the work." },
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
    <section className="ground" ref={ref} data-obstacle aria-label="About and experience">
      <div className="ground-intro">
        <p className="thread-kicker">About</p>
        <h2>Six years, from the interface to the system behind it.</h2>
      </div>
      <ol className="ground-roles">
        {roles.map((role) => (
          <li key={role.where}>
            <span>{role.when}</span>
            <strong>{role.where}</strong>
            <p>{role.line}</p>
          </li>
        ))}
      </ol>
      <ul className="ground-caps">
        {capabilities.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.line}</span>
          </li>
        ))}
      </ul>
      <div className="ground-cta">
        <a className="btn btn-solid" href={`mailto:${person.email}`}>
          {person.email}
        </a>
        <ResumeDownload className="btn btn-ghost">Resume</ResumeDownload>
      </div>
    </section>
  );
}
