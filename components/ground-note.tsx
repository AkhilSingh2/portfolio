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
  { title: "Languages", items: ["TypeScript", "JavaScript (ES6+)", "Python", "HTML5", "CSS3"] },
  {
    title: "Frontend",
    items: ["React", "Next.js", "Vue.js", "Tailwind CSS", "Storybook", "Figma Prototyping", "Design Systems"],
  },
  { title: "Backend", items: ["Python", "FastAPI", "Node.js", "RESTful APIs", "Celery", "SQS", "NetSuite / CRM Integrations"] },
  { title: "Data", items: ["PostgreSQL", "MongoDB"] },
  { title: "AI", items: ["Gemini LLM Integration", "Prompt Engineering", "RAG Architectures"] },
  {
    title: "Cloud and DevOps",
    items: [
      "Azure (CI/CD, Cloud Workflows)",
      "AWS (S3, ECR, RDS, IAM, SQS)",
      "Kubernetes (Helm)",
      "KEDA (Autoscaling)",
      "Terraform",
      "Docker",
      "GitHub Actions",
    ],
  },
  {
    title: "Tooling",
    items: ["Bitbucket", "FFmpeg Media Pipelines", "Sentry", "Biome", "SonarQube", "Monorepo Architecture", "Jira SDLC"],
  },
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
              <ul className="tool-chips">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
