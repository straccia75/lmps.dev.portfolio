import type { Metadata } from "next";
import { PageShell } from "../../components/site";
import { CaseStudyView } from "../../components/case-study";
import { prospeak } from "./content";

export const metadata: Metadata = {
  title: "ProSpeak case study | Luigi Straccia",
  description:
    "English training SaaS with real-time voice AI, a sales CRM, Stripe billing and an automated acquisition funnel. Designed and built by Luigi Straccia.",
};

export default function ProSpeakPage() {
  return (
    <PageShell>
      <CaseStudyView study={prospeak} />
    </PageShell>
  );
}
