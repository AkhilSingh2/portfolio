import Link from "next/link";

const stages = [
  {
    index: "01",
    title: "Design",
    note: "The interface",
    body: "I name the person and the job, then draw the flows, the type, and the states that usually get skipped: empty, error, loading, a small screen. The systems I can show are Sutra UI and Calibre, drawn in Figma.",
    tools: ["Figma", "Sutra UI", "Calibre"],
    href: "/work/sutra-ui",
    link: "Sutra UI",
  },
  {
    index: "02",
    title: "Build",
    note: "The system",
    body: "The screen is React, Next.js, and TypeScript. The services behind it are Python, with Flask or FastAPI, and the data lives in Postgres or Supabase.",
    tools: ["React", "Next.js", "TypeScript", "Python", "Flask", "FastAPI", "Postgres", "Supabase"],
    href: "/work/mymirro-recommendation-api",
    link: "Recommendation API",
  },
  {
    index: "03",
    title: "Ship",
    note: "The release",
    body: "I put the web apps on AWS Amplify, pack services in Docker, and run them through CI. The worker fleets sit on Kubernetes and scale with Helm.",
    tools: ["AWS Amplify", "Docker", "CI", "Kubernetes", "Helm"],
    href: "/work/cloud-infrastructure",
    link: "Cloud infrastructure",
  },
] as const;

export function Manifesto() {
  return (
    <section className="practice theme-ink" id="practice" aria-labelledby="practice-title">
      <div className="practice-head">
        <p className="eyebrow">01 — Practice</p>
        <h2 id="practice-title">Design the interface. Then build it, and ship it.</h2>
      </div>
      <ol className="practice-grid">
        {stages.map((stage) => (
          <li key={stage.index} className="practice-step">
            <div className="practice-mark" aria-hidden="true">
              <span>{stage.index}</span>
              <i />
            </div>
            <div className="practice-copy">
              <p className="practice-note">{stage.note}</p>
              <h3>{stage.title}</h3>
              <p>{stage.body}</p>
            </div>
            <ul className="practice-tools">
              {stage.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
            <Link href={stage.href} className="practice-link">
              {stage.link}
              <span aria-hidden="true"> →</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
