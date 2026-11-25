import { getPortraitSource } from "@/lib/assets";
import { asset } from "@/lib/site";

export function Portrait({ size = "regular" }: { size?: "regular" | "small" }) {
  const portrait = getPortraitSource();
  if (!portrait) {
    return (
      <figure className={`portrait portrait-empty portrait-${size}`}>
        <div className="portrait-monogram" aria-hidden="true">
          <span>AS</span>
          <i />
        </div>
      </figure>
    );
  }

  const sizes = size === "small" ? "(min-width: 800px) 15rem, 16rem" : "(min-width: 800px) 22rem, 88vw";

  return (
    <figure className={`portrait portrait-${size}`}>
      {/* next/image omits basePath on static export. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(portrait.src)}
        srcSet={portrait.candidates.map((candidate) => `${asset(candidate.src)} ${candidate.width}w`).join(", ")}
        sizes={sizes}
        alt="Akhilendra Singh"
        width={portrait.width}
        height={portrait.height}
        decoding="async"
        loading={size === "small" ? "lazy" : "eager"}
      />
    </figure>
  );
}
