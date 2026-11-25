import type { Metadata } from "next";
import { Button } from "@/components/button";
import { PageShell } from "@/components/page-shell";
import { getResumeHref, resumeFilename } from "@/lib/assets";
import { person } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume of Akhilendra Singh, full-stack engineer in Bangalore.",
};

export default function ResumePage() {
  const href = getResumeHref();

  return (
    <PageShell>
      <article className="page resume-page theme-bone">
        <p className="eyebrow">Resume</p>
        {href ? (
          <>
            <h1>Download the PDF.</h1>
            <p className="lede">One file, kept next to the work rather than restated as a second website.</p>
            <Button href={href} variant="solid" download>
              Download {resumeFilename}
            </Button>
          </>
        ) : (
          <>
            <h1>The PDF is not on the site yet.</h1>
            <p className="lede">
              Drop <code>{resumeFilename}</code> into the <code>public</code> folder and rebuild. Until then, the
              honest path is email.
            </p>
            <div className="placeholder-card">
              <p className="bio-label">Waiting on a file</p>
              <p>No invented CV. No placeholder metrics. The case studies are the record for now.</p>
            </div>
            <Button href={`mailto:${person.email}`} variant="solid">
              {person.email}
            </Button>
          </>
        )}
      </article>
    </PageShell>
  );
}
