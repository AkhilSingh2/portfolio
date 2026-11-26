import { BackendWork, ProfessionalWork, SystemPair } from "@/components/home-sections";
import { Hero } from "@/components/hero";
import { PageShell } from "@/components/page-shell";
import { WorkReel } from "@/components/work-reel";
import { reelProjects } from "@/lib/projects";

export default function HomePage() {
  return (
    <PageShell>
      <Hero />
      <WorkReel projects={reelProjects()} />
      <BackendWork />
      <ProfessionalWork />
      <SystemPair />
    </PageShell>
  );
}
