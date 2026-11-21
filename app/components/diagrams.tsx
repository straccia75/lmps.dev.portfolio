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

/* ---------- Desktop: animated SVG in the same style as the home hero ---------- */

type SvgNode = { x: number; y: number; title: string; tag: string; kind?: "planned" | "quality" };

const PIPE_NODES: SvgNode[] = [
  { x: 110, y: 80, title: "OpenSky API", tag: "Every 15 min" },
  { x: 350, y: 80, title: "Redpanda", tag: "Kafka topic" },
  { x: 590, y: 80, title: "Spark Streaming", tag: "Checkpointed" },
  { x: 830, y: 80, title: "Bronze", tag: "Parquet by date" },
  { x: 830, y: 230, title: "Cloud Storage", tag: "Data lake" },
  { x: 590, y: 230, title: "Silver", tag: "Incremental dbt" },
  { x: 350, y: 230, title: "Gold", tag: "Star schema" },
  { x: 110, y: 230, title: "Reports", tag: "Next", kind: "planned" },
  { x: 470, y: 362, title: "Data quality tests", tag: "Run on every build", kind: "quality" },
  { x: 770, y: 362, title: "Airport seed", tag: "5,282 elevations", kind: "quality" },
];

// Snake through the built steps, from the API to Gold
const PIPE_PATH = "M110 80 H810 Q830 80 830 100 V210 Q830 230 810 230 H350";
// Reports is not built yet: dashed, no particles
const PLANNED_PATH = "M350 230 H110";
// Tests watch Silver and Gold, the airport seed feeds the tests
const TEST_PATHS = [
  "M420 336 V300 Q420 290 410 290 H360 Q350 290 350 280 V256",
  "M520 336 V300 Q520 290 530 290 H580 Q590 290 590 280 V256",
  "M686 362 H580",
];

const PIPE_PARTICLES = [0, 1.8, 3.6, 5.4, 7.2];

function nodeWidth(n: SvgNode) {
  return n.title === "Data quality tests" ? 220 : 168;
}

function PipelineSvg() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-[2.5rem] bg-sky-500/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b0b10]/80 shadow-[0_40px_120px_-40px_rgba(56,189,248,0.35)] backdrop-blur-xl">
        {/* window bar */}
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-zinc-700" />
            <span className="h-2 w-2 rounded-full bg-zinc-700" />
            <span className="h-2 w-2 rounded-full bg-zinc-700" />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-zinc-500">opensky / pipeline</span>
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-sky-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
            </span>
            Streaming
          </span>
        </div>

        <svg
          viewBox="0 0 940 410"
          className="block h-auto w-full"
          role="img"
          aria-label="Pipeline: OpenSky API, Redpanda, Spark Streaming and Bronze run locally. Cloud Storage, Silver, Gold and Reports run on Google Cloud. Data quality tests, fed by an airport elevation seed, check Silver and Gold."
        >
          <defs>
            <linearGradient id="pipe-flow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <radialGradient id="pipe-particle">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* zones */}
          <rect x="16" y="42" width="908" height="76" rx="22" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" />
          <text x="32" y="30" fill="#71717a" fontSize="10" letterSpacing="0.22em" fontFamily="inherit">LOCAL · DOCKER</text>
          <rect x="16" y="192" width="908" height="76" rx="22" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" />
          <text x="32" y="180" fill="#71717a" fontSize="10" letterSpacing="0.22em" fontFamily="inherit">GOOGLE CLOUD · BIGQUERY + DBT</text>
          <text x="32" y="330" fill="#71717a" fontSize="10" letterSpacing="0.22em" fontFamily="inherit">DATA QUALITY</text>

          {/* pipeline track */}
          <path d={PIPE_PATH} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
          <path d={PIPE_PATH} fill="none" stroke="url(#pipe-flow)" strokeOpacity="0.55" strokeWidth="1.5" className="flow-line" />
          <path d={PLANNED_PATH} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="3 6" />

          {/* events travelling the pipeline */}
          {PIPE_PARTICLES.map((begin) => (
            <circle key={begin} r="7" fill="url(#pipe-particle)">
              <animateMotion dur="9s" repeatCount="indefinite" begin={`-${begin}s`} path={PIPE_PATH} />
            </circle>
          ))}

          {/* quality checks */}
          {TEST_PATHS.map((d) => (
            <path key={d} d={d} fill="none" stroke="rgba(252,211,77,0.35)" strokeWidth="1.5" strokeDasharray="3 5" />
          ))}

          {/* nodes */}
          {PIPE_NODES.map((n, i) => {
            const w = nodeWidth(n);
            const accent = n.kind === "quality" ? "#fcd34d" : "#38bdf8";
            const border =
              n.kind === "quality" ? "rgba(252,211,77,0.35)" : n.kind === "planned" ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.12)";
            return (
              <g key={n.title}>
                {n.kind !== "planned" && (
                  <rect
                    x={n.x - w / 2}
                    y={n.y - 26}
                    width={w}
                    height="52"
                    rx="14"
                    fill="none"
                    stroke={accent}
                    className="node-pulse"
                    style={{ "--delay": `${i * 450}ms` } as React.CSSProperties}
                  />
                )}
                <rect
                  x={n.x - w / 2}
                  y={n.y - 26}
                  width={w}
                  height="52"
                  rx="14"
                  fill="#0e0e14"
                  stroke={border}
                  strokeDasharray={n.kind === "planned" ? "4 4" : undefined}
                />
                <text
                  x={n.x - w / 2 + 14}
                  y={n.y - 4}
                  fill={n.kind === "planned" ? "#a1a1aa" : "#ffffff"}
                  fontSize="13"
                  fontWeight="500"
                  fontFamily="inherit"
                >
                  {n.title}
                </text>
                <text
                  x={n.x - w / 2 + 14}
                  y={n.y + 13}
                  fill={n.kind === "quality" ? "#fde68a" : "#71717a"}
                  fontSize="10"
                  letterSpacing="0.06em"
                  fontFamily="inherit"
                >
                  {n.tag.toUpperCase()}
                </text>
                {n.kind !== "planned" && <circle cx={n.x + w / 2 - 14} cy={n.y - 12} r="2.5" fill={accent} />}
              </g>
            );
          })}
        </svg>

        {/* footer metrics */}
        <div className="grid grid-cols-3 divide-x divide-white/5 border-t border-white/5">
          {[
            ["3", "medallion layers"],
            ["19", "dbt quality tests"],
            ["5,282", "airports in the seed"],
          ].map(([v, l]) => (
            <div key={l} className="px-4 py-3">
              <div className="font-mono text-lg font-semibold text-white">{v}</div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Mobile: the same steps stacked as cards ---------- */

function PipelineCards() {
  return (
    <div>
      <Zone label="Local · Docker">
        <StepRow steps={LOCAL} start={1} />
      </Zone>

      <div className="flex items-center justify-center gap-2 py-3 text-[11px] text-zinc-500">
        <ArrowDown aria-hidden className="h-3.5 w-3.5 text-sky-300/60" />
        Parquet files uploaded to the data lake
      </div>

      <Zone label="Google Cloud · BigQuery and dbt">
        <StepRow steps={CLOUD} start={5} />

        <div className="mt-4 grid gap-3 border-t border-white/5 pt-4">
          <div className="rounded-xl border border-amber-300/20 bg-amber-300/[0.04] p-4">
            <p className="text-sm font-medium text-amber-100">Airport reference data</p>
            <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">5,282 airports with elevation, loaded as a dbt seed</p>
          </div>
          <div className="rounded-xl border border-amber-300/20 bg-amber-300/[0.04] p-4">
            <p className="text-sm font-medium text-amber-100">Data quality tests</p>
            <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
              Run on every build against Silver and Gold: physical limits, ground readings against the nearest airport,
              keys and anomaly categories.
            </p>
          </div>
        </div>
      </Zone>
    </div>
  );
}

function AviationPipelineDiagram() {
  return (
    <figure aria-label="Pipeline architecture: local streaming stack feeding a Google Cloud warehouse">
      <div className="hidden md:block">
        <PipelineSvg />
      </div>
      <div className="md:hidden">
        <PipelineCards />
      </div>
    </figure>
  );
}

export const DIAGRAMS = {
  "aviation-pipeline": AviationPipelineDiagram,
} as const;
