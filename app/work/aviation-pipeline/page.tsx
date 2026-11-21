import type { Metadata } from "next";
import { PageShell } from "../../components/site";
import { CaseStudyView } from "../../components/case-study";
import { aviationPipeline } from "./content";

export const metadata: Metadata = {
  title: "Aviation telemetry pipeline case study",
  alternates: { canonical: "/work/aviation-pipeline" },
  description:
    "Streaming data pipeline from a live API to a tested star schema in BigQuery, built with Kafka, Spark, Google Cloud Storage and dbt. Designed and built by Luigi Straccia.",
  openGraph: {
    title: "Aviation telemetry pipeline case study | Luigi Straccia",
    description: "Streaming data pipeline from a live API to a tested star schema in BigQuery, built with Kafka, Spark and dbt.",
    url: "/work/aviation-pipeline",
  },
};

export default function AviationPipelinePage() {
  return (
    <PageShell>
      <CaseStudyView study={aviationPipeline} />
    </PageShell>
  );
}
