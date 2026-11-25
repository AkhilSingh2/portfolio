import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import Script from "next/script";
import { Cursor } from "@/components/cursor";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { absUrl, person, siteUrl } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
});

export const viewport: Viewport = {
  themeColor: "#100e0c",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${person.name} — Full-stack engineer`,
    template: `%s — ${person.name}`,
  },
  description: person.description,
  applicationName: person.name,
  authors: [{ name: person.name, url: person.linkedin }],
  creator: person.name,
  alternates: { canonical: absUrl("/") },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: absUrl("/"),
    siteName: person.name,
    title: `${person.name} — Full-stack engineer`,
    description: person.description,
    images: [{ url: absUrl("/og.png"), width: 1200, height: 630, alt: `${person.name}, full-stack engineer` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${person.name} — Full-stack engineer`,
    description: person.description,
    images: [absUrl("/og.png")],
  },
  icons: {
    apple: absUrl("/apple-touch-icon.png"),
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.role,
  email: `mailto:${person.email}`,
  url: absUrl("/"),
  address: {
    "@type": "PostalAddress",
    addressLocality: person.locality,
    addressCountry: person.country,
  },
  sameAs: [person.linkedin, person.github],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable}`}>
      <body>
        <Script id="calibre-enhance" strategy="beforeInteractive">
          {`(function(){try{if(matchMedia("(min-width:960px) and (prefers-reduced-motion:no-preference)").matches){document.documentElement.classList.add("enhance")}}catch(e){}})();`}
        </Script>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Cursor />
        <SmoothScroll>
          <ScrollProgress />
          <SiteHeader />
          <div className="page-sheet">
            <main id="main">{children}</main>
          </div>
          <SiteFooter />
        </SmoothScroll>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
