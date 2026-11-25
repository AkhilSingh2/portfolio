"use client";

const links = [
  { href: "#playground", label: "Workbench" },
  { href: "#philosophy", label: "Principles" },
  { href: "#tokens", label: "Tokens" },
  { href: "#motion", label: "Motion" },
  { href: "#measured", label: "Measured" },
] as const;

export function CalibreNav() {
  return (
    <nav className="calibre-nav" aria-label="On this page">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={() => {
            const target = document.querySelector(link.href);
            if (target instanceof HTMLDetailsElement) target.open = true;
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
