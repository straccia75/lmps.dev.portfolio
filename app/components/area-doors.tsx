"use client";

import { ArrowRight } from "lucide-react";
import type { Category } from "../work/types";

const DOORS: { id: Category; label: string; text: string; featured: string }[] = [
  {
    id: "software",
    label: "Business software & AI",
    text: "CRMs, sales funnels, payments and real-time AI, with Claude connected to live business data.",
    featured: "ProSpeak",
  },
  {
    id: "data",
    label: "Data engineering",
    text: "Streaming pipelines, data lakes and warehouse models that turn raw events into reporting tables.",
    featured: "Aviation telemetry pipeline",
  },
];

/*
  The two entry points under the hero. Each one opens its tab in the Work
  section. Direct links also work: /?area=data#work
*/
export function AreaDoors() {
  const open = (e: React.MouseEvent<HTMLAnchorElement>, id: Category) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set("area", id);
    url.hash = "work";
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new CustomEvent<Category>("work-area", { detail: id }));
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  };

  // Tell the hero visual which system to show
  const hover = (id: Category | null) =>
    window.dispatchEvent(new CustomEvent<Category | null>("hero-area", { detail: id }));

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {DOORS.map((d) => (
        <a
          key={d.id}
          href={`/?area=${d.id}#work`}
          onClick={(e) => open(e, d.id)}
          onMouseEnter={() => hover(d.id)}
          onMouseLeave={() => hover(null)}
          onFocus={() => hover(d.id)}
          onBlur={() => hover(null)}
          className="spotlight group flex flex-col rounded-2xl border border-white/10 bg-[#0c0c11]/80 p-5 backdrop-blur-xl transition-[border-color,box-shadow,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-sky-400/30 hover:shadow-[0_30px_80px_-30px_rgba(56,189,248,0.35)]"
        >
          <p className="text-sm font-semibold text-white">{d.label}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">{d.text}</p>
          <div className="flex-1" />
          <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-sky-300">
            {d.featured}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
          </span>
        </a>
      ))}
    </div>
  );
}
