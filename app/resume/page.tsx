import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ResumeView } from "@/components/resume-view";
import { person } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description: `${person.name}, full-stack and frontend engineer in Bengaluru. Summary, skills, experience, education, and the PDF.`,
};

export default function ResumePage() {
  return (
    <PageShell>
      <ResumeView />
    </PageShell>
  );
}
