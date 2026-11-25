import { asset } from "@/lib/site";

export function Media({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = "(min-width: 960px) 960px, 100vw",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const href = asset(src);
  return (
    // next/image omits basePath on static export, which 404s every screenshot on GitHub Pages.
    // The bitmap is used through srcset so a 2x capture stays sharp instead of being upscaled.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={href}
      srcSet={`${href} ${width}w`}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      className={className}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
