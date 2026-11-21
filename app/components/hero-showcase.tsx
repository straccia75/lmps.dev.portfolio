"use client";

import { useEffect, useRef, useState } from "react";
import type { Category } from "../work/types";
import { PIPELINE_DIAGRAM, PROSPEAK_DIAGRAM, SystemDiagram } from "./hero-system";

/*
  Hero visual: alternates the two real systems (ProSpeak and the data pipeline).
  Hovering one of the entry points under the headline shows its system and
  pauses the rotation ("hero-area" event from AreaDoors).
*/

const SLIDES: { id: Category; label: string; project: string }[] = [
  { id: "software", label: "Software & AI", project: "ProSpeak" },
  { id: "data", label: "Data", project: "Aviation pipeline" },
];

const ROTATE_MS = 7000;

export function HeroShowcase() {
  const [active, setActive] = useState<Category>("software");
  const paused = useRef(false);

  // Rotate, unless a door or a tab is being hovered
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => {
      if (!paused.current) setActive((a) => (a === "software" ? "data" : "software"));
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, []);

  // Doors under the headline: hover shows their system
  useEffect(() => {
    const onArea = (e: Event) => {
      const d = (e as CustomEvent<Category | null>).detail;
      if (d) {
        setActive(d);
        paused.current = true;
      } else paused.current = false;
    };
    window.addEventListener("hero-area", onArea);
    return () => window.removeEventListener("hero-area", onArea);
  }, []);

  return (
    <div className="float-y relative">
      <div className="absolute -inset-8 rounded-[2.5rem] bg-sky-500/10 blur-3xl" />

      {/* both diagrams stacked; the active one fades in */}
      <div className="relative grid">
        {[PROSPEAK_DIAGRAM, PIPELINE_DIAGRAM].map((cfg, i) => {
          const on = SLIDES[i].id === active;
          return (
            <div
              key={cfg.id}
              aria-hidden={!on}
              className={`col-start-1 row-start-1 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                on ? "opacity-100" : "pointer-events-none scale-[0.98] opacity-0"
              }`}
            >
              <SystemDiagram config={cfg} />
            </div>
          );
        })}
      </div>

      {/* which system is on screen */}
      <div
        className="relative mt-4 flex justify-center gap-2"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        {SLIDES.map((s) => {
          const on = s.id === active;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              aria-pressed={on}
              className={`rounded-full border px-3 py-1.5 text-[11px] transition-colors duration-500 ${
                on
                  ? "border-sky-400/40 bg-sky-400/10 text-sky-200"
                  : "border-white/10 bg-white/[0.02] text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {s.label} <span className="text-zinc-500">· {s.project}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
