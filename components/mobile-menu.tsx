"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { ResumeDownload } from "@/components/resume-download";
import { SocialLinks } from "@/components/social-links";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function current(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export const MobileMenu = forwardRef<HTMLDivElement, { onClose: () => void; titleId: string }>(function MobileMenu(
  { onClose, titleId },
  ref,
) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="mobile-menu">
      <motion.button
        type="button"
        className="mobile-menu-backdrop"
        aria-label="Close menu"
        onClick={onClose}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.3 }}
      />
      <motion.div
        ref={ref}
        id="site-menu"
        className="mobile-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-lenis-prevent=""
        initial={reduce ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
        transition={reduce ? { duration: 0 } : { duration: 0.38, ease }}
      >
        <p id={titleId} className="sr-only">
          Menu
        </p>
        <nav className="mobile-menu-nav" aria-label="Menu">
          {links.map((link, index) => (
            <motion.div
              key={link.href}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.45, delay: 0.06 + index * 0.06, ease }}
            >
              <Link
                href={link.href}
                className="mobile-menu-link"
                data-menuitem
                aria-current={current(pathname, link.href) ? "page" : undefined}
                onClick={onClose}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>
        <motion.div
          className="mobile-menu-foot"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.28 }}
        >
          <SocialLinks className="nav-social mobile-social" />
          <ResumeDownload className="mobile-menu-resume" data-menuitem>
            Resume
          </ResumeDownload>
        </motion.div>
      </motion.div>
    </div>
  );
});
