"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Lock } from "lucide-react";
import type { Category, Media } from "../work/types";

export type ProjectCard = {
  slug: string;
  category: Category;
  name: string;
  kicker: string;
  blurb: string;
  points: string[];
  tags: string[];
  thumbnail?: Media;
};

type Tab = { id: Category; label: string; short: string; empty: string };

/* Work section: one tab per area, projects of the active area in a grid. */
export function WorkTabs({ tabs, projects }: { tabs: Tab[]; projects: ProjectCard[] }) {
  const [active, setActive] = useState<Category>(tabs[0].id);

  // Open the tab requested in the URL (?area=data), e.g. when coming back from a case study
  useEffect(() => {
    const area = new URLSearchParams(window.location.search).get("area");
    if (area && tabs.some((t) => t.id === area)) setActive(area as Category);
  }, [tabs]);

  const select = (id: Category) => {
    setActive(id);
    const url = new URL(window.location.href);
    url.searchParams.set("area", id);
    window.history.replaceState(null, "", url);
  };

  const activeIndex = tabs.findIndex((t) => t.id === active);
  const visible = projects.filter((p) => p.category === active);
  const current = tabs[activeIndex];

  return (
    <div>
      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Work areas"
        className="relative grid w-full max-w-xl rounded-full border border-white/10 bg-[#0c0c11]/80 p-1 backdrop-blur-md"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {/* sliding indicator */}
        <span
          aria-hidden
          className="absolute inset-y-1 left-1 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: `calc((100% - 0.5rem) / ${tabs.length})`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
        {tabs.map((t) => {
          const count = projects.filter((p) => p.category === t.id).length;
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => select(t.id)}
              className={`relative z-10 flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-xs font-medium transition-colors duration-500 sm:text-sm ${
                selected ? "text-zinc-950" : "text-zinc-400 hover:text-white"
              }`}
            >
              <span className="sm:hidden">{t.short}</span>
              <span className="hidden sm:inline">{t.label}</span>
              <span
                className={`rounded-full px-1.5 py-px font-mono text-[10px] transition-colors duration-500 ${
                  selected ? "bg-zinc-950/10 text-zinc-700" : "bg-white/[0.06] text-zinc-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel: remounts on tab change so the cards animate in */}
      <div key={active} role="tabpanel" className="mt-10">
        {visible.length === 0 ? (
          <div className="enter flex items-center gap-4 rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.015] p-8 sm:p-10">
            <Lock className="h-4 w-4 shrink-0 text-zinc-600" />
            <div>
              <p className="text-sm font-medium text-zinc-300">{current.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500">{current.empty}</p>
            </div>
          </div>
        ) : (
          <div className={`grid gap-4 ${visible.length > 1 ? "lg:grid-cols-2" : ""}`}>
            {visible.map((p, i) => (
              <ProjectCardView key={p.slug} project={p} index={i} wide={visible.length === 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* wide: the only card in the panel, so the thumbnail sits beside the text on large screens */
function ProjectCardView({ project, index, wide }: { project: ProjectCard; index: number; wide: boolean }) {
  const thumb = project.thumbnail;
  return (
    <Link
      href={`/work/${project.slug}`}
      style={{ "--delay": `${index * 90}ms` } as React.CSSProperties}
      className={`enter spotlight group grid gap-8 rounded-[1.5rem] border border-white/10 bg-[#0c0c11]/80 p-6 backdrop-blur-xl transition-[border-color,box-shadow,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-sky-400/30 hover:shadow-[0_30px_80px_-30px_rgba(56,189,248,0.35)] sm:p-8 ${
        thumb && wide ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-center" : ""
      }`}
    >
      {thumb && (
        <div className={`overflow-hidden rounded-2xl border border-white/10 bg-black/40 ${wide ? "lg:order-2" : ""}`}>
          <Image
            src={thumb.src}
            alt={thumb.alt}
            width={thumb.width}
            height={thumb.height}
            sizes={wide ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 600px, 100vw"}
            className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
          />
        </div>
      )}

      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{project.kicker}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{project.name}</h3>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed">{project.blurb}</p>
          </div>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-zinc-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
        </div>

        <ul className={`mt-6 grid gap-x-8 gap-y-2.5 ${thumb && wide ? "" : "sm:grid-cols-2"}`}>
          {project.points.map((pt) => (
            <li key={pt} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
              <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-sky-400/70" />
              {pt}
            </li>
          ))}
        </ul>

        <div className="flex-1" />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-5">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <span key={t} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-zinc-300">
                {t}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-300">
            Read case study
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
