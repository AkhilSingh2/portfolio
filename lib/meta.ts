import type { Metadata } from "next";
import { absUrl, person } from "@/lib/site";

const image = {
  url: absUrl("/og.png"),
  width: 1200,
  height: 630,
  alt: `${person.name}, full-stack engineer in Bangalore`,
};

export function pageMeta(title: string, description: string, path: string): Metadata {
  const url = absUrl(path);
  const full = `${title} — ${person.name}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: person.name,
      title: full,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: [image.url],
    },
  };
}
