import { GroundNote } from "@/components/ground-note";
import { PageShell } from "@/components/page-shell";
import { ThreadHome } from "@/components/thread-home";

export default function HomePage() {
  return (
    <PageShell>
      <ThreadHome />
      <GroundNote />
    </PageShell>
  );
}
