"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { forwardRef, useRef } from "react";
import { Media } from "@/components/media";
import { ResumeDownload } from "@/components/resume-download";
import { featuredProject, liveTools, workGroups } from "@/lib/menu";
import { person } from "@/lib/site";

const MotionLink = motion.create(Link);

const spring = { type: "spring" as const, stiffness: 320, damping: 28 };

export const MegaMenu = forwardRef<HTMLDivElement, { onClose: () => void; titleId: string }>(function MegaMenu(
  { onClose, titleId },
  ref,
) {
  const reduce = useReducedMotion();
  const spotRef = useRef<HTMLAnchorElement>(null);
  const groups = workGroups();
  const live = liveTools();
  const featured = featuredProject();
  const shot = featured.shots[0];

  const hidden = reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 };
  const shown = { opacity: 1, y: 0, filter: "blur(0px)" };
  const panelHidden = reduce ? { opacity: 1 } : { opacity: 0, y: -18, filter: "blur(16px)" };

  return (
    <div className="mega-root">
      <div className="mega-backdrop" onClick={onClose} />
      <motion.div
        ref={ref}
        id="site-menu"
        className="mega-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={reduce ? false : panelHidden}
        animate={shown}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, filter: "blur(10px)" }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
      >
        <div className="mega-bar">
          <p id={titleId} className="mega-kicker">
            Index
          </p>
          <button type="button" className="mega-close" data-menuitem onClick={onClose}>
            Close
          </button>
        </div>
        <div className="mega-layout">
          <MotionLink
            ref={spotRef}
            className="spotlight"
            href={`/work/${featured.slug}`}
            data-menuitem
            onClick={onClose}
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reduce ? { duration: 0 } : spring}
            onPointerMove={(event) => {
              if (reduce || !spotRef.current) return;
              const rect = spotRef.current.getBoundingClientRect();
              const x = (event.clientX - rect.left) / rect.width - 0.5;
              const y = (event.clientY - rect.top) / rect.height - 0.5;
              spotRef.current.style.setProperty("--px", `${x * 18}px`);
              spotRef.current.style.setProperty("--py", `${y * 14}px`);
            }}
            onPointerLeave={() => {
              spotRef.current?.style.setProperty("--px", "0px");
              spotRef.current?.style.setProperty("--py", "0px");
            }}
          >
            <Media src={shot.src} alt="" width={shot.width} height={shot.height} />
            <span className="spotlight-copy">
              <span className="eyebrow">Featured</span>
              <strong>{featured.title}</strong>
              <em>{featured.kicker}</em>
            </span>
          </MotionLink>

          <div className="mega-work">
            {groups.map((group, index) => (
              <motion.section
                key={group.id}
                aria-labelledby={`mega-${group.id}`}
                initial={reduce ? false : { ...hidden, filter: "blur(8px)" }}
                animate={shown}
                transition={reduce ? { duration: 0 } : { ...spring, delay: 0.04 * index }}
              >
                <h2 id={`mega-${group.id}`}>{group.label}</h2>
                <ul>
                  {group.projects.map((project) => {
                    const thumb = project.shots[0];
                    return (
                      <li key={project.slug}>
                        <Link href={`/work/${project.slug}`} data-menuitem onClick={onClose}>
                          <Media src={thumb.src} alt="" width={120} height={75} />
                          <span>
                            <strong>{project.title}</strong>
                            <em>{project.kicker}</em>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </motion.section>
            ))}
          </div>

          <motion.section
            className="mega-live"
            aria-labelledby="mega-live"
            initial={reduce ? false : hidden}
            animate={shown}
            transition={reduce ? { duration: 0 } : { ...spring, delay: 0.08 }}
          >
            <h2 id="mega-live">Live tools</h2>
            <ul>
              {live.map((project) => (
                <li key={project.slug}>
                  <a href={project.live} data-menuitem target="_blank" rel="noreferrer">
                    <strong>{project.title}</strong>
                    <em>{project.liveLabel || project.kicker}</em>
                  </a>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            className="mega-about"
            aria-labelledby="mega-about"
            initial={reduce ? false : hidden}
            animate={shown}
            transition={reduce ? { duration: 0 } : { ...spring, delay: 0.12 }}
          >
            <h2 id="mega-about">About</h2>
            <ul className="mega-links">
              <li>
                <Link href="/about" data-menuitem onClick={onClose}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/design-system" data-menuitem onClick={onClose}>
                  Calibre
                </Link>
              </li>
              <li>
                <Link href="/work" data-menuitem onClick={onClose}>
                  All work
                </Link>
              </li>
              <li>
                <Link href="/resume" data-menuitem onClick={onClose}>
                  Resume
                </Link>
              </li>
            </ul>
            <ul className="mega-chips" aria-label="Skills">
              {["React", "Next.js", "TypeScript", "Vue", "Python", "FastAPI"].map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            className="mega-contact"
            aria-labelledby="mega-contact"
            initial={reduce ? false : hidden}
            animate={shown}
            transition={reduce ? { duration: 0 } : { ...spring, delay: 0.16 }}
          >
            <h2 id="mega-contact">Contact</h2>
            <ul className="mega-links">
              <li>
                <a href={`mailto:${person.email}`} data-menuitem>
                  {person.email}
                </a>
              </li>
              <li>
                <a href={person.linkedin} data-menuitem target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={person.github} data-menuitem target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/contact" data-menuitem onClick={onClose}>
                  Write a note
                </Link>
              </li>
            </ul>
            <ResumeDownload className="btn btn-solid mega-download" data-menuitem>
              Download resume
            </ResumeDownload>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
});
