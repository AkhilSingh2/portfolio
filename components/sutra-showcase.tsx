import Link from "next/link";

const principles = [
  {
    title: "Pigment, not a poster",
    body: "Ivory is the wall. Ink does the reading. Antique gold is a line, the way a frame is a line. Oxblood and emerald appear once. Saturated fills made the previous edition feel like a costume.",
  },
  {
    title: "Type has two jobs",
    body: "Fraunces carries the title of the room. Inter does the labels, the amounts, and the errors. Noto Sans Devanagari sits in the same stack, and the body line height stays at 1.5 so Hindi does not collide.",
  },
  {
    title: "A motif is an edge",
    body: "Kalamkari and block-print survive as hairline repeats, in a margin or a plate. If a pattern touches a sentence, it is too strong.",
  },
  {
    title: "The tool still counts",
    body: "Number inputs group in lakhs and crores. The FAQ component writes a FAQPage JSON-LD script. There is no runtime CSS-in-JS, and the core component JavaScript stays under 15KB gzipped.",
  },
];

const rooms = [
  ["Philosophy", "Why the palette, the type, and the motion are held back."],
  ["Components", "Every control, with its variants, on the keyboard path."],
  ["Tokens", "Ivory, ink, gold, oxblood, and emerald, live in both themes."],
  ["Case study", "An income-tax shell. Illustrative figures, not advice."],
];

export function SutraShowcase() {
  return (
    <section className="sutra-showcase" aria-labelledby="sutra-showcase-title">
      <p className="eyebrow">Gallery edition</p>
      <h2 id="sutra-showcase-title">Held back on purpose.</h2>
      <p>
        Sutra UI is the design system for tools that handle money and measure. The Indian references are in the line,
        the numeral, and the language, not in a louder colour. The screenshots on this page are the live docs, captured
        after the motion settled.
      </p>
      <p>
        <a href="https://akhilsingh2.github.io/sutra-ui/" target="_blank" rel="noreferrer">
          Open the live docs
        </a>
        <a href="https://github.com/AkhilSingh2/sutra-ui" target="_blank" rel="noreferrer">
          Repository
        </a>
      </p>
      <ol className="sutra-principles">
        {principles.map((item, index) => (
          <li key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </li>
        ))}
      </ol>
      <h3>In the collection</h3>
      <ul className="sutra-components">
        {rooms.map(([name, body]) => (
          <li key={name}>
            <strong>{name}</strong>
            <span>{body}</span>
          </li>
        ))}
      </ul>
      <p>
        <Link href="/design-system">Calibre, the system on this portfolio, is separate.</Link>
      </p>
    </section>
  );
}
