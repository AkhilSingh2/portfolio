import { BackendWork, ProfessionalWork, SelectedWork, SystemPair } from "@/components/home-sections";
import { Hero } from "@/components/hero";
import { PageShell } from "@/components/page-shell";

export default function HomePage() {
  return (
    <PageShell>
      <Hero />
      <SelectedWork />
      <BackendWork />
      <ProfessionalWork />
      <SystemPair />
    </PageShell>
  );
}
