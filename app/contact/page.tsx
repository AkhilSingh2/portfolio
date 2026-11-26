import { ContactForm } from "@/components/contact-form";
import { PageShell } from "@/components/page-shell";
import { ResumeDownload } from "@/components/resume-download";
import { pageMeta } from "@/lib/meta";
import { person } from "@/lib/site";

export const metadata = pageMeta(
  "Contact",
  "Email Akhilendra Singh. Open to senior frontend and full-stack roles, in Bengaluru or remote.",
  "/contact",
);

export default function ContactPage() {
  return (
    <PageShell>
      <article className="page contact-page theme-bone">
        <div className="contact-layout">
          <div className="contact-intro">
            <p className="eyebrow">Contact</p>
            <h1>Write to me.</h1>
            <p className="contact-mail">
              <a href={`mailto:${person.email}`}>{person.email}</a>
            </p>
            <p className="lede">Open to senior frontend and full-stack roles. Bengaluru or remote.</p>
            <ul className="contact-links">
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
            </ul>
          </div>
          <aside className="contact-aside" aria-labelledby="contact-note-title">
            <p className="eyebrow" id="contact-note-title">
              A note
            </p>
            <p className="contact-aside-copy">The form opens your mail app with the message filled in.</p>
            <ContactForm />
          </aside>
        </div>
      </article>
    </PageShell>
  );
}
