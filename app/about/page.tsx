import type { Metadata } from "next";
import { Button } from "@/components/button";
import { PageShell } from "@/components/page-shell";
import { Portrait } from "@/components/portrait";
import { person } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Akhilendra Singh is a full-stack engineer in Bangalore. Frontend-first, from interface to deploy. Open to senior frontend and full-stack roles.",
};

const years = [
  {
    year: "2026",
    body: "laa-pi, Subtitle Vocab Explainer, momoGPT, and Online Chalisa. Local AI tools, a caption extension, and a live multilingual reader.",
  },
  {
    year: "2025",
    body: "MyMirro's styling app, the Labs marketing site, the recommendation API, and the colour-analysis API.",
  },
  {
    year: "2021",
    body: "Vue studies: a task app, a node calculator, a blog SPA, and a countries table. Early full-stack practice.",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <article className="page about-page theme-bone">
        <div className="about-layout">
          <Portrait />
          <div>
        <header className="page-intro about-intro">
          <div>
            <p className="eyebrow">About</p>
            <h1>{person.name}</h1>
            <p className="lede">{person.role}. The interface is where the work starts. It is not where it stops.</p>
            <p className="bio-slot">
              <span className="bio-label">Personal line</span>
              <span className="bio-pending">To be written, in his own words.</span>
            </p>
          </div>
        </header>

        <div className="prose about-copy">
          <p>
            He designs and ships production web apps: React, Next.js, and Vue on the screen, Python or Node when the
            product needs a service, and the deploy on AWS, Vercel, Cloudflare, or Railway. Lately the products have a
            model in them. The rule he keeps is that the model does not get to invent the facts.
          </p>
          <p>
            Calibre, the design system on this site, is the working example of that habit. The tokens are CSS
            variables. The components in the gallery are the components in the navigation. Motion is a handoff between
            sections, and it steps aside when the system asks for less of it.
          </p>
          <p>
            {person.location}. {person.availability}. The years below are public project activity.
          </p>
        </div>

        <section className="timeline" aria-labelledby="timeline-title">
          <h2 id="timeline-title">Public work, by year</h2>
          <ol>
            {years.map((item) => (
              <li key={item.year}>
                <span>{item.year}</span>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="hero-actions">
          <Button href="/work" variant="solid" transitionTypes={["nav-forward"]}>
            See the work
          </Button>
          <Button href={`mailto:${person.email}`} variant="ghost">
            Email
          </Button>
          <Button href="/resume" variant="line" transitionTypes={["nav-forward"]}>
            Resume
          </Button>
        </div>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
