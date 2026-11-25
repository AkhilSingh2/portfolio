import { asset } from "@/lib/site";

export function Media({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    // next/image omits basePath on static export, which 404s every screenshot on GitHub Pages.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(src)}
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
