"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ResumeDownload } from "@/components/resume-download";
import { resumeEducation, resumePlace, resumeRoles, resumeSkills, resumeSummary } from "@/lib/resume";
import { resumePublicPath } from "@/lib/resume-file";
import { asset, person } from "@/lib/site";

const sections = [
  { href: "#summary", label: "Summary" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#resume-pdf", label: "PDF" },
];

export function ResumeView() {
  const reduce = useReducedMotion();
  const [skill, setSkill] = useState(0);
  const [role, setRole] = useState(0);
  const pdf = asset(resumePublicPath);
  const rise = reduce ? { duration: 0 } : { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const };

  const focusRole = (index: number) => {
    const next = (index + resumeRoles.length) % resumeRoles.length;
    setRole(next);
    document.getElementById(`role-tab-${next}`)?.focus();
    document.getElementById(`role-${resumeRoles[next].id}`)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "nearest",
    });
  };

  return (
    <article className="page resume-page theme-bone">
      <header className="resume-head">
        <p className="eyebrow">Resume</p>
        <h1>{person.name}</h1>
        <p className="resume-contact">
          <span>{resumePlace}</span>
          <a href={`mailto:${person.email}`}>{person.email}</a>
          <a href={person.linkedin}>LinkedIn</a>
          <a href={person.github}>GitHub</a>
        </p>
        <div className="hero-actions">
          <ResumeDownload className="btn btn-solid">Download resume</ResumeDownload>
          <a className="btn btn-line" href="#resume-pdf">
            Preview the PDF
          </a>
        </div>
      </header>

      <nav className="resume-jump" aria-label="Resume sections">
        {sections.map((section) => (
          <a key={section.href} href={section.href}>
            {section.label}
          </a>
        ))}
      </nav>

      <motion.section
        id="summary"
        aria-labelledby="summary-title"
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={rise}
      >
        <h2 id="summary-title">Professional summary</h2>
        <p className="resume-summary">{resumeSummary}</p>
      </motion.section>

      <section id="skills" aria-labelledby="skills-title">
        <h2 id="skills-title">Technical skills</h2>
        <div className="resume-skill-tabs" role="group" aria-label="Skill groups">
          {resumeSkills.map((group, index) => (
            <button
              key={group.id}
              type="button"
              id={`skill-tab-${group.id}`}
              aria-pressed={skill === index}
              onClick={() => setSkill(index)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                event.preventDefault();
                const direction = event.key === "ArrowRight" ? 1 : -1;
                const next = (index + direction + resumeSkills.length) % resumeSkills.length;
                setSkill(next);
                document.getElementById(`skill-tab-${resumeSkills[next].id}`)?.focus();
              }}
            >
              {group.label}
            </button>
          ))}
        </div>
        <div className="resume-skill-grid">
          {resumeSkills.map((group, index) => (
            <motion.section
              key={group.id}
              id={`skill-${group.id}`}
              aria-labelledby={`skill-tab-${group.id}`}
              data-active={skill === index ? "true" : "false"}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...rise, delay: reduce ? 0 : index * 0.05 }}
            >
              <h3>{group.label}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.section>
          ))}
        </div>
      </section>

      <section id="experience" aria-labelledby="experience-title">
        <h2 id="experience-title">Professional experience</h2>
        <div className="resume-role-tabs" role="group" aria-label="Jump to a role">
          {resumeRoles.map((job, index) => (
            <button
              key={job.id}
              type="button"
              id={`role-tab-${index}`}
              aria-pressed={role === index}
              onClick={() => {
                setRole(index);
                document.getElementById(`role-${job.id}`)?.scrollIntoView({
                  behavior: reduce ? "auto" : "smooth",
                  block: "nearest",
                });
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                  event.preventDefault();
                  focusRole(index + 1);
                } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  focusRole(index - 1);
                }
              }}
            >
              <strong>{job.org.split("—")[0].trim()}</strong>
              <span>{job.dates}</span>
            </button>
          ))}
        </div>
        <ol className="resume-timeline">
          {resumeRoles.map((job, index) => (
            <motion.li
              key={job.id}
              id={`role-${job.id}`}
              data-active={role === index ? "true" : "false"}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={rise}
            >
              <h3>
                {job.title} <span>| {job.org}</span>
              </h3>
              <p>{job.dates}</p>
              <ul>
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </section>

      <motion.section
        id="education"
        aria-labelledby="education-title"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={rise}
      >
        <h2 id="education-title">Education</h2>
        <p className="resume-degree">
          {resumeEducation.degree} <span>| {resumeEducation.school}</span>
        </p>
        <p>{resumeEducation.dates}</p>
      </motion.section>

      <section id="resume-pdf" aria-labelledby="pdf-title">
        <h2 id="pdf-title">PDF</h2>
        <p>
          <ResumeDownload className="btn btn-solid">Download resume</ResumeDownload>
        </p>
        <iframe className="resume-frame" src={pdf} title={`${person.name} resume PDF`} />
        <p className="resume-fallback">
          If the preview does not load,{" "}
          <a href={pdf} download>
            download the PDF
          </a>
          .
        </p>
      </section>
    </article>
  );
}
