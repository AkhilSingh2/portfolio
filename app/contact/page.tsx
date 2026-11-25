import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageShell } from "@/components/page-shell";
import { ResumeDownload } from "@/components/resume-download";
import { person } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email Akhilendra Singh, or send a note. Bangalore. Open to senior frontend and full-stack roles.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <article className="page contact-page theme-bone">
        <header className="page-intro">
          <p className="eyebrow">Contact</p>
          <h1>Write to me.</h1>
          <p className="lede">
            I am in {person.location}, and I am open to senior frontend and full-stack roles. Email is the direct
            path. The form opens your mail app with the note filled in.
          </p>
        </header>
        <p className="contact-mail">
          <a href={`mailto:${person.email}`}>{person.email}</a>
        </p>
        <ContactForm />
        <ul className="contact-links">
          <li>
            <a href={person.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href={person.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <ResumeDownload>Download resume</ResumeDownload>
          </li>
        </ul>
      </article>
    </PageShell>
  );
}
