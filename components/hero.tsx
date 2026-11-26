import Link from "next/link";
import { KineticName } from "@/components/kinetic-name";
import { Magnetic } from "@/components/magnetic";
import { ShaderField } from "@/components/shader-field";

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
        <KineticName />
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
        </div>
      </div>
    </section>
  );
}
