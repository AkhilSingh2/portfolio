import { PageShell } from "@/components/page-shell";
import { ResumeView } from "@/components/resume-view";
import { pageMeta } from "@/lib/meta";
import { person } from "@/lib/site";

export const metadata = pageMeta(
  "Resume",
  `${person.name}, full-stack and frontend engineer in Bengaluru. Summary, skills, experience, education, and the PDF.`,
  "/resume",
);

export default function ResumePage() {
  return (
    <PageShell>
      <ResumeView />
    </PageShell>
  );
}
