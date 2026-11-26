import { Button } from "@/components/button";
import { PageShell } from "@/components/page-shell";
import { Portrait } from "@/components/portrait";
import { pageMeta } from "@/lib/meta";
import { person } from "@/lib/site";

export const metadata = pageMeta(
  "About",
  "Akhilendra Singh is a full-stack engineer in Bangalore. He starts at the interface and stays through the API and the release.",
  "/about",
);

const years = [
  {
    year: "2026",
    body: "Lyra, DocMind, LaunchPad, Tandem, Pulse, SpendSense, Quorum, Aayam, Hundredmark, DevKit, laa-pi, Subtitle Vocab Explainer, momoGPT, and Online Chalisa.",
  },
  {
    year: "2025",
    body: "Frontend on MyMirro's styling app, the recommendation API beside it, and the Labs marketing site.",
  },
  {
    year: "2021",
    body: "Vue studies: a task app, a node calculator, a blog, and a countries table. That is where the full-stack habit started.",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <article className="page about-page theme-bone">
        <div className="about-layout">
          <Portrait />
          <div>
            <header className="page-intro">
              <p className="eyebrow">About</p>
              <h1>{person.name}</h1>
              <p className="lede">
                I am a full-stack engineer, frontend first. The interface is where I start. It is not where I stop.
              </p>
            </header>
            <div className="prose about-copy">
              <p>
                I design and ship web products: React, Next.js, and Vue on the screen, Python or Node when the product
                needs a service, and the release on AWS, Vercel, Cloudflare, or a container. When a model is in the
                loop, I want the citation, the tool call, or the checked fact on screen. A fluent paragraph is not
                evidence.
              </p>
              <p>
                Calibre is the system this site is built with. The tokens are CSS variables. The buttons in the
                specimen are the buttons in the navigation. Motion is a handoff between sections, and it steps aside
                when the system asks for less of it.
              </p>
              <p>
                I am in {person.location}. {person.availability}. The years below are the public work, not a list of
                jobs.
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
              <Button href="/work" variant="solid">
                See the work
              </Button>
              <Button href="/contact" variant="ghost">
                Contact
              </Button>
              <Button href="/resume" variant="line">
                Resume
              </Button>
            </div>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
