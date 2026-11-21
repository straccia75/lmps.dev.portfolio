import { ArrowDown, ArrowRight } from "lucide-react";

/*
  Architecture diagrams for case studies, drawn with HTML so they stay
  readable on phones (the steps stack vertically on small screens).
  A case study picks one with architecture.diagram = "<key>".
*/

type Step = { title: string; detail: string; planned?: boolean };

function Zone({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.015] p-4 sm:p-5">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">{label}</p>
      {children}
    </div>
  );
}

function StepRow({ steps, start }: { steps: Step[]; start: number }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {steps.map((s, i) => (
        <li key={s.title} className="relative">
          <div
            className={`spotlight h-full rounded-xl border bg-[#0c0c11]/80 p-4 ${
              s.planned ? "border-dashed border-white/15" : "border-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-sky-300/80">{String(start + i).padStart(2, "0")}</span>
              {s.planned && (
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-zinc-500">
                  Next
                </span>
              )}
            </div>
            <p className="mt-2 text-sm font-medium text-white">{s.title}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">{s.detail}</p>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight
              aria-hidden
              className="absolute -right-[1.15rem] top-1/2 hidden h-3.5 w-3.5 -translate-y-1/2 text-sky-300/60 lg:block"
            />
          )}
        </li>
      ))}
    </ol>
  );
}

const LOCAL: Step[] = [
  { title: "OpenSky API", detail: "Live positions of every aircraft, polled every 15 minutes" },
  { title: "Redpanda", detail: "Kafka-compatible broker, one event per aircraft" },
  { title: "Spark Streaming", detail: "Reads the topic and adds ingestion metadata" },
  { title: "Bronze", detail: "Raw JSON in Parquet, partitioned by date" },
];

const CLOUD: Step[] = [
  { title: "Cloud Storage", detail: "Data lake, synced idempotently from Bronze" },
  { title: "Silver", detail: "Typed and cleaned in BigQuery, incremental dbt model" },
  { title: "Gold", detail: "Star schema: aircraft, daily metrics, anomalies" },
  { title: "Reports", detail: "Dashboard on top of the Gold tables", planned: true },
];

function AviationPipelineDiagram() {
  return (
    <figure aria-label="Pipeline architecture: local streaming stack feeding a Google Cloud warehouse">
      <Zone label="Local · Docker">
        <StepRow steps={LOCAL} start={1} />
      </Zone>

      <div className="flex items-center justify-center gap-2 py-3 text-[11px] text-zinc-500">
        <ArrowDown aria-hidden className="h-3.5 w-3.5 text-sky-300/60" />
        Parquet files uploaded to the data lake
      </div>

      <Zone label="Google Cloud · BigQuery and dbt">
        <StepRow steps={CLOUD} start={5} />

        <div className="mt-4 grid gap-3 border-t border-white/5 pt-4 sm:grid-cols-[0.8fr_2.2fr]">
          <div className="rounded-xl border border-amber-300/20 bg-amber-300/[0.04] p-4">
            <p className="text-sm font-medium text-amber-100">Airport reference data</p>
            <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">5,282 airports with elevation, loaded as a dbt seed</p>
          </div>
          <div className="rounded-xl border border-amber-300/20 bg-amber-300/[0.04] p-4">
            <p className="text-sm font-medium text-amber-100">Data quality tests</p>
            <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
              Run on every build against Silver and Gold: coordinates, speeds and altitudes within physical limits,
              aircraft on the ground checked against the nearest airport, keys, relationships and anomaly categories.
            </p>
          </div>
        </div>
      </Zone>
    </figure>
  );
}

export const DIAGRAMS = {
  "aviation-pipeline": AviationPipelineDiagram,
} as const;
