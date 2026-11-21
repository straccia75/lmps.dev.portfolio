/*
  Hero visuals: real systems drawn as live pipelines.
  - ProSpeak: leads flow from the landing page to a certified student; the admin
    site collects the data and Claude queries it through a custom MCP connector.
  - Aviation pipeline: events flow from the OpenSky API to the Gold layer;
    dbt tests check the warehouse.
  Pure SVG + CSS/SMIL animation, no JavaScript. HeroShowcase alternates them.
*/

type Kind = "ai" | "quality";
type Node = { x: number; y: number; title: string; tag: string; kind?: Kind };

export type DiagramConfig = {
  id: string; // prefix for SVG ids, unique per diagram on the page
  title: string;
  status: string;
  label: string;
  nodes: Node[];
  path: string; // main pipeline, with particles
  feed?: string; // secondary dashed feed, one particle
  link: { d: string; label: string; kind: Kind; textX: number; textY: number }; // dashed link with a label
  metrics: [string, string][];
};

const ACCENT: Record<Kind | "base", { stroke: string; border: string; tag: string; dot: string }> = {
  base: { stroke: "#38bdf8", border: "rgba(255,255,255,0.12)", tag: "#71717a", dot: "#38bdf8" },
  ai: { stroke: "#a78bfa", border: "rgba(167,139,250,0.45)", tag: "#c4b5fd", dot: "#a78bfa" },
  quality: { stroke: "#fcd34d", border: "rgba(252,211,77,0.4)", tag: "#fde68a", dot: "#fcd34d" },
};

export const PROSPEAK_DIAGRAM: DiagramConfig = {
  id: "ps",
  title: "prospeak / pipeline",
  status: "Live",
  label: "ProSpeak pipeline: landing page, AI trial lesson, CRM, Stripe checkout, active student, certificate. The admin site collects live metrics and Claude queries them through a custom MCP connector.",
  nodes: [
    { x: 110, y: 62, title: "Landing page", tag: "Acquisition" },
    { x: 410, y: 62, title: "AI trial lesson", tag: "Voice AI" },
    { x: 410, y: 190, title: "CRM", tag: "Sales rep" },
    { x: 110, y: 190, title: "Stripe checkout", tag: "Webhook" },
    { x: 110, y: 318, title: "Active student", tag: "Access granted" },
    { x: 410, y: 318, title: "Certificate", tag: "Server-graded" },
    { x: 110, y: 456, title: "Admin site", tag: "Live metrics" },
    { x: 410, y: 456, title: "Claude", tag: "Custom MCP", kind: "ai" },
  ],
  path: "M110 62 H390 Q410 62 410 82 V170 Q410 190 390 190 H130 Q110 190 110 210 V298 Q110 318 130 318 H410",
  feed: "M260 318 V372 Q260 392 240 392 H130 Q110 392 110 412 V430",
  link: { d: "M182 456 H338", label: "MCP", kind: "ai", textX: 260, textY: 446 },
  metrics: [
    ["2", "funnels measured"],
    ["11", "Claude MCP tools"],
    ["24", "trial paths"],
  ],
};

export const PIPELINE_DIAGRAM: DiagramConfig = {
  id: "dp",
  title: "opensky / pipeline",
  status: "Streaming",
  label: "Aviation data pipeline: OpenSky API, Redpanda, Spark Streaming, Bronze layer, Cloud Storage, Silver and Gold in BigQuery. dbt data quality tests check the warehouse.",
  nodes: [
    { x: 110, y: 62, title: "OpenSky API", tag: "Live positions" },
    { x: 410, y: 62, title: "Redpanda", tag: "Kafka topic" },
    { x: 410, y: 190, title: "Spark Streaming", tag: "Checkpointed" },
    { x: 110, y: 190, title: "Bronze", tag: "Parquet by date" },
    { x: 110, y: 318, title: "Cloud Storage", tag: "Data lake" },
    { x: 410, y: 318, title: "Silver", tag: "Incremental dbt" },
    { x: 410, y: 456, title: "Gold", tag: "Star schema" },
    { x: 110, y: 456, title: "Quality tests", tag: "19 dbt tests", kind: "quality" },
  ],
  path: "M110 62 H390 Q410 62 410 82 V170 Q410 190 390 190 H130 Q110 190 110 210 V298 Q110 318 130 318 H390 Q410 318 410 338 V456",
  link: { d: "M182 456 H338", label: "CHECKS", kind: "quality", textX: 260, textY: 446 },
  metrics: [
    ["3", "medallion layers"],
    ["19", "dbt quality tests"],
    ["5,282", "airports in the seed"],
  ],
};

const PARTICLES = [0, 1.4, 2.8, 4.2, 5.6];

export function SystemDiagram({ config: c }: { config: DiagramConfig }) {
  const link = ACCENT[c.link.kind];
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b0b10]/80 shadow-[0_40px_120px_-40px_rgba(56,189,248,0.35)] backdrop-blur-xl">
      {/* window bar */}
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-zinc-700" />
          <span className="h-2 w-2 rounded-full bg-zinc-700" />
          <span className="h-2 w-2 rounded-full bg-zinc-700" />
        </div>
        <span className="font-mono text-[10px] tracking-widest text-zinc-500">{c.title}</span>
        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-sky-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
          </span>
          {c.status}
        </span>
      </div>

      <svg viewBox="0 0 520 510" className="block h-auto w-full" role="img" aria-label={c.label}>
        <defs>
          <linearGradient id={`${c.id}-flow`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <radialGradient id={`${c.id}-particle`}>
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${c.id}-particle-link`}>
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor={link.stroke} />
            <stop offset="100%" stopColor={link.stroke} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* track */}
        <path d={c.path} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
        <path d={c.path} fill="none" stroke={`url(#${c.id}-flow)`} strokeOpacity="0.55" strokeWidth="1.5" className="flow-line" />

        {/* particles travelling the pipeline */}
        {PARTICLES.map((begin) => (
          <circle key={begin} r="7" fill={`url(#${c.id}-particle)`}>
            <animateMotion dur="7s" repeatCount="indefinite" begin={`-${begin}s`} path={c.path} />
          </circle>
        ))}

        {/* secondary feed */}
        {c.feed && (
          <>
            <path d={c.feed} fill="none" stroke="rgba(56,189,248,0.35)" strokeWidth="1.5" strokeDasharray="3 5" />
            <circle r="4" fill={`url(#${c.id}-particle)`}>
              <animateMotion dur="3.5s" repeatCount="indefinite" path={c.feed} />
            </circle>
          </>
        )}

        {/* labelled dashed link, travelled both ways */}
        <path d={c.link.d} fill="none" stroke={link.stroke} strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x={c.link.textX} y={c.link.textY} fill={link.tag} fontSize="9" letterSpacing="0.2em" textAnchor="middle" fontFamily="inherit">
          {c.link.label}
        </text>
        {[0, 1.3].map((begin) => (
          <circle key={begin} r="5" fill={`url(#${c.id}-particle-link)`}>
            <animateMotion
              dur="2.6s"
              repeatCount="indefinite"
              begin={`-${begin}s`}
              path={c.link.d}
              keyPoints="0;1;0"
              keyTimes="0;0.5;1"
              calcMode="linear"
            />
          </circle>
        ))}

        {/* nodes */}
        {c.nodes.map((n, i) => {
          const a = ACCENT[n.kind ?? "base"];
          return (
            <g key={n.title}>
              <rect
                x={n.x - 72}
                y={n.y - 26}
                width="144"
                height="52"
                rx="14"
                fill="none"
                stroke={a.stroke}
                className="node-pulse"
                style={{ "--delay": `${i * 450}ms` } as React.CSSProperties}
              />
              <rect x={n.x - 72} y={n.y - 26} width="144" height="52" rx="14" fill="#0e0e14" stroke={a.border} />
              <text x={n.x - 58} y={n.y - 4} fill="#ffffff" fontSize="13" fontWeight="500" fontFamily="inherit">
                {n.title}
              </text>
              <text x={n.x - 58} y={n.y + 13} fill={a.tag} fontSize="10" letterSpacing="0.06em" fontFamily="inherit">
                {n.tag.toUpperCase()}
              </text>
              <circle cx={n.x + 58} cy={n.y - 12} r="2.5" fill={a.dot} />
            </g>
          );
        })}
      </svg>

      {/* footer metrics */}
      <div className="grid grid-cols-3 divide-x divide-white/5 border-t border-white/5">
        {c.metrics.map(([v, l]) => (
          <div key={l} className="px-4 py-3">
            <div className="font-mono text-lg font-semibold text-white">{v}</div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
