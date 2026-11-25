import { person } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <p className="footer-name">
          <span className="wordmark-mark" aria-hidden="true" />
          {person.name}
        </p>
        <ul className="footer-links">
          <li>
            <a href={`mailto:${person.email}`}>{person.email}</a>
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
          <li>{person.location}</li>
        </ul>
        <p className="footer-colophon">Calibre. Fraunces and Outfit. Design through delivery.</p>
      </div>
    </footer>
  );
}
