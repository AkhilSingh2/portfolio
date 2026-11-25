import Link from "next/link";
import { Magnetic } from "@/components/magnetic";
import { ResumeDownload } from "@/components/resume-download";
import { ShaderField } from "@/components/shader-field";

function Letters({ text, italic = false }: { text: string; italic?: boolean }) {
  return (
    <span className={italic ? "kinetic kinetic-italic" : "kinetic"}>
      {text.split("").map((char, index) => (
        <span className="mask" key={`${char}-${index}`}>
          <span className="glyph" style={{ animationDelay: `${index * 38}ms` }}>
            {char}
          </span>
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section className="hero theme-ink">
      <ShaderField />
      <div className="hero-copy">
        <p className="eyebrow">
          <span>Full-stack engineer</span>
          <span className="dot" aria-hidden="true" />
          <span>Bangalore</span>
        </p>
        <h1>
          <Letters text="Akhilendra" />
          <Letters text="Singh" italic />
        </h1>
        <p className="lede hero-lede">
          I design the interface and I stay through the API, the model, and the release.
        </p>
        <div className="hero-actions">
          <Magnetic>
            <Link className="btn btn-solid" href="/#work">
              Selected work
            </Link>
          </Magnetic>
          <Magnetic>
            <Link className="btn btn-ghost" href="/contact">
              Contact
            </Link>
          </Magnetic>
          <Magnetic>
            <ResumeDownload className="btn btn-line">Download resume</ResumeDownload>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
