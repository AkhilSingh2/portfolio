import { getPortraitSrc } from "@/lib/assets";
import { asset } from "@/lib/site";

export function Portrait({ size = "regular" }: { size?: "regular" | "small" }) {
  const src = getPortraitSrc();
  if (!src) {
    return (
      <figure className={`portrait portrait-empty portrait-${size}`}>
        <div className="portrait-monogram" aria-hidden="true">
          <span>AS</span>
          <i />
        </div>
      </figure>
    );
  }

  return (
    <figure className={`portrait portrait-${size}`}>
      {/* next/image omits basePath on static export. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(src)} alt="Portrait of Akhilendra Singh" width={900} height={1125} />
    </figure>
  );
}
