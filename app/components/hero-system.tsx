/*
  Hero visual: the ProSpeak pipeline as a live system.
  Leads flow from the landing page to a certified student.
  Pure SVG + CSS/SMIL animation, no JavaScript.
*/

const NODES = [
  { x: 110, y: 70, title: "Landing page", tag: "Acquisition" },
  { x: 410, y: 70, title: "AI trial lesson", tag: "Voice AI" },
  { x: 410, y: 230, title: "CRM", tag: "Sales rep" },
  { x: 110, y: 230, title: "Stripe checkout", tag: "Webhook" },
  { x: 110, y: 390, title: "Active student", tag: "Access granted" },
  { x: 410, y: 390, title: "Certificate", tag: "Server-graded" },
];

// Snake path through the six nodes, with rounded corners
const PATH =
  "M110 70 H390 Q410 70 410 90 V210 Q410 230 390 230 H130 Q110 230 110 250 V370 Q110 390 130 390 H410";

const PARTICLES = [0, 1.4, 2.8, 4.2, 5.6];

export function HeroSystem() {
  return (
    <div className="float-y relative">
      <div className="absolute -inset-8 rounded-[2.5rem] bg-sky-500/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b0b10]/80 shadow-[0_40px_120px_-40px_rgba(56,189,248,0.35)] backdrop-blur-xl">
        {/* window bar */}
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-zinc-700" />
            <span className="h-2 w-2 rounded-full bg-zinc-700" />
            <span className="h-2 w-2 rounded-full bg-zinc-700" />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-zinc-500">prospeak / pipeline</span>
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-sky-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
            </span>
            Live
          </span>
        </div>

        <svg viewBox="0 0 520 460" className="block h-auto w-full" role="img" aria-label="ProSpeak pipeline: landing page, AI trial, CRM, Stripe, active student, certificate">
          <defs>
            <linearGradient id="flow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <radialGradient id="particle">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* track */}
          <path d={PATH} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
          <path d={PATH} fill="none" stroke="url(#flow)" strokeOpacity="0.55" strokeWidth="1.5" className="flow-line" />

          {/* particles travelling the pipeline */}
          {PARTICLES.map((begin) => (
            <circle key={begin} r="7" fill="url(#particle)">
              <animateMotion dur="7s" repeatCount="indefinite" begin={`-${begin}s`} path={PATH} />
            </circle>
          ))}

          {/* nodes */}
          {NODES.map((n, i) => (
            <g key={n.title}>
              <rect
                x={n.x - 72}
                y={n.y - 26}
                width="144"
                height="52"
                rx="14"
                fill="none"
                stroke="#38bdf8"
                className="node-pulse"
                style={{ "--delay": `${i * 450}ms` } as React.CSSProperties}
              />
              <rect x={n.x - 72} y={n.y - 26} width="144" height="52" rx="14" fill="#0e0e14" stroke="rgba(255,255,255,0.12)" />
              <text x={n.x - 58} y={n.y - 4} fill="#ffffff" fontSize="13" fontWeight="500" fontFamily="inherit">
                {n.title}
              </text>
              <text x={n.x - 58} y={n.y + 13} fill="#71717a" fontSize="10" letterSpacing="0.06em" fontFamily="inherit">
                {n.tag.toUpperCase()}
              </text>
              <circle cx={n.x + 58} cy={n.y - 12} r="2.5" fill="#38bdf8" />
            </g>
          ))}
        </svg>

        {/* footer metrics */}
        <div className="grid grid-cols-3 divide-x divide-white/5 border-t border-white/5">
          {[
            ["2", "funnels measured"],
            ["1", "webhook flow"],
            ["24", "trial paths"],
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
