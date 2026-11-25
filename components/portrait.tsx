import Image from "next/image";
import { getPortraitSrc } from "@/lib/assets";

export function Portrait({ size = "regular" }: { size?: "regular" | "small" }) {
  const src = getPortraitSrc();
  if (!src) {
    return (
      <figure className={`portrait portrait-empty portrait-${size}`}>
        <div className="portrait-monogram" aria-hidden="true">
          AS
        </div>
        <figcaption>Portrait to be added</figcaption>
      </figure>
    );
  }

  return (
    <figure className={`portrait portrait-${size}`}>
      <Image src={src} alt="Portrait of Akhilendra Singh" width={900} height={1125} priority={size === "regular"} />
      <figcaption className="sr-only">Portrait of Akhilendra Singh</figcaption>
    </figure>
  );
}
