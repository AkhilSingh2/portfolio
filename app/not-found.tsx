import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/button";

export default function NotFound() {
  return (
    <PageShell>
      <section className="page lost theme-ink">
        <p className="eyebrow">404</p>
        <h1>This page is not on the site.</h1>
        <p className="lede">The link may be old, or the address was typed past the end of a word.</p>
        <div className="hero-actions">
          <Button href="/" variant="solid" transitionTypes={["nav-back"]}>
            Home
          </Button>
          <Button href="/work" variant="ghost" transitionTypes={["nav-forward"]}>
            Work
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
