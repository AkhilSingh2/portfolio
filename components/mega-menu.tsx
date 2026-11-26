"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { forwardRef, useState } from "react";
import { Media } from "@/components/media";
import { ResumeDownload } from "@/components/resume-download";
import { SocialLinks } from "@/components/social-links";
import { featuredProject, workGroups } from "@/lib/menu";
import type { Project, Shot } from "@/lib/projects";
import { LiveLink, liveDomain } from "@/components/live-link";
import { person } from "@/lib/site";

type Spot =
  | { kind: "project"; slug: string }
  | { kind: "page"; id: string; title: string; body: string; href: string };

const spring = { type: "spring" as const, stiffness: 320, damping: 28 };

function Thumb({ shot, sizes, className }: { shot?: Shot; sizes: string; className?: string }) {
  if (!shot) return <span className={className ? `mega-blank ${className}` : "mega-blank"} aria-hidden="true" />;
  return <Media src={shot.src} alt="" width={shot.width} height={shot.height} sizes={sizes} />;
}

export const MegaMenu = forwardRef<HTMLDivElement, { onClose: () => void; titleId: string }>(function MegaMenu(
  { onClose, titleId },
  ref,
) {
  const reduce = useReducedMotion();
  const groups = workGroups();
  const featured = featuredProject();
  const catalogue = groups.flatMap((group) => group.projects);
  const [spot, setSpot] = useState<Spot>({ kind: "project", slug: featured.slug });
  const active: Project = spot.kind === "project" ? (catalogue.find((item) => item.slug === spot.slug) ?? featured) : featured;
  const showProject = spot.kind === "project";
  const focusProject = (slug: string) => setSpot({ kind: "project", slug });
  const focusPage = (page: Extract<Spot, { kind: "page" }>) => setSpot(page);

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
        data-lenis-prevent=""
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={reduce ? false : panelHidden}
        animate={shown}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, filter: "blur(10px)" }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
      >
        <div className="mega-bar">
          <div className="mega-brand">
            <p id={titleId} className="mega-kicker">
              Work
            </p>
            <Link href="/work" className="mega-work-link" data-menuitem onClick={onClose}>
              See all work
            </Link>
          </div>
          <div className="mega-tools">
            <SocialLinks className="nav-social mega-social" />
            <a className="mega-mail" href={`mailto:${person.email}`} aria-label="Email" data-menuitem>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M3 5.5h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Zm9 7.2 8.2-5.2H3.8L12 12.7Z" />
              </svg>
            </a>
            <button type="button" className="mega-close" data-menuitem onClick={onClose}>
              Close
            </button>
          </div>
        </div>
        <div className="mega-layout">
          <div className="spotlight" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={showProject ? active.slug : spot.kind === "page" ? spot.id : "spot"}
                className="spotlight-pane"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.28 }}
              >
                {showProject ? (
                  <>
                    <Thumb shot={active.shots[0]} sizes="320px" className="spotlight-blank" />
                    <span className="spotlight-copy">
                      <strong>{active.title}</strong>
                      <p className="spotlight-blurb">{active.summary.split(/(?<=\.)\s+/)[0]}</p>
                      <span className="spotlight-links">
                          <Link href={`/work/${active.slug}`} data-menuitem onClick={onClose}>
                          Case study
                        </Link>
                        {active.live ? <LiveLink href={active.live} domain={liveDomain(active.liveLabel)} /> : null}
                      </span>
                    </span>
                  </>
                ) : spot.kind === "page" ? (
                  <span className="spotlight-copy spotlight-page">
                    <strong>{spot.title}</strong>
                    <em>{spot.body}</em>
                    <Link href={spot.href} data-menuitem onClick={onClose}>
                      Open
                    </Link>
                  </span>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mega-work" data-lenis-prevent="">
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
                      <li key={project.slug} className="mega-item">
                        <Link
                          className="mega-project"
                          href={`/work/${project.slug}`}
                          data-menuitem
                          onClick={onClose}
                          onMouseEnter={() => focusProject(project.slug)}
                          onFocus={() => focusProject(project.slug)}
                        >
                          <Thumb shot={thumb} sizes="80px" />
                          <span>
                            <strong>{project.title}</strong>
                          </span>
                        </Link>
                        {project.live ? <LiveLink href={project.live} domain={liveDomain(project.liveLabel)} /> : null}
                      </li>
                    );
                  })}
                  {group.id === "systems" ? (
                    <li className="mega-item">
                      <Link
                        className="mega-project"
                        href="/design-system"
                        data-menuitem
                        onClick={onClose}
                        onMouseEnter={() =>
                          focusPage({
                            kind: "page",
                            id: "calibre",
                            title: "Calibre",
                            body: "The system this site is built with. Tokens, type, and measured charts.",
                            href: "/design-system",
                          })
                        }
                        onFocus={() =>
                          focusPage({
                            kind: "page",
                            id: "calibre",
                            title: "Calibre",
                            body: "The system this site is built with. Tokens, type, and measured charts.",
                            href: "/design-system",
                          })
                        }
                      >
                        <Media src="/work/calibre/studio.webp" alt="" width={1440} height={900} sizes="80px" />
                        <span>
                          <strong>Calibre</strong>
                        </span>
                      </Link>
                    </li>
                  ) : null}
                </ul>
              </motion.section>
            ))}
          </div>

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
                <Link
                  href="/about"
                  data-menuitem
                  onClick={onClose}
                  onMouseEnter={() =>
                    focusPage({
                      kind: "page",
                      id: "about",
                      title: "About",
                      body: "The practice, in Bangalore. Interface through release.",
                      href: "/about",
                    })
                  }
                  onFocus={() =>
                    focusPage({
                      kind: "page",
                      id: "about",
                      title: "About",
                      body: "The practice, in Bangalore. Interface through release.",
                      href: "/about",
                    })
                  }
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/work"
                  data-menuitem
                  onClick={onClose}
                  onMouseEnter={() =>
                    focusPage({ kind: "page", id: "work", title: "All work", body: "Case studies, with the problem, the build, and the repository.", href: "/work" })
                  }
                  onFocus={() =>
                    focusPage({ kind: "page", id: "work", title: "All work", body: "Case studies, with the problem, the build, and the repository.", href: "/work" })
                  }
                >
                  All work
                </Link>
              </li>
              <li>
                <Link
                  href="/resume"
                  data-menuitem
                  onClick={onClose}
                  onMouseEnter={() =>
                    focusPage({ kind: "page", id: "resume", title: "Resume", body: "The PDF, and the same text on the page. The phone number stays in the file.", href: "/resume" })
                  }
                  onFocus={() =>
                    focusPage({ kind: "page", id: "resume", title: "Resume", body: "The PDF, and the same text on the page. The phone number stays in the file.", href: "/resume" })
                  }
                >
                  Resume
                </Link>
              </li>
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
                <Link
                  href="/contact"
                  data-menuitem
                  onClick={onClose}
                  onMouseEnter={() =>
                    focusPage({ kind: "page", id: "contact", title: "Contact", body: person.email, href: "/contact" })
                  }
                  onFocus={() =>
                    focusPage({ kind: "page", id: "contact", title: "Contact", body: person.email, href: "/contact" })
                  }
                >
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
