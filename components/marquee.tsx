const items = [
  "React",
  "Next.js",
  "TypeScript",
  "Vue",
  "Python",
  "FastAPI",
  "Postgres",
  "GSAP",
  "WebGL",
  "Astro",
  "AWS",
  "Design systems",
];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-label="Tools I use">
      <div className="marquee-track">
        {row.map((item, index) => (
          <span key={`${item}-${index}`}>
            {item}
            <i aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
