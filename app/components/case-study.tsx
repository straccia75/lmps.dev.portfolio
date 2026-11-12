import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ContactActions, delay, Section, Tag } from "./site";
import { categoryLabel } from "../work/registry";
import type { CaseStudy, System } from "../work/types";

/* Reusable case-study layout. Every project page renders this with its own content. */
export function CaseStudyView({ study }: { study: CaseStudy }) {
  const numbered = new Map(study.groups.flatMap((g) => g.systems).map((s, i) => [s.id, i + 1]));
  const backHref = `/?area=${study.category}#work`;

  return (
    <>
      {/* Overview */}
      <section className="pb-16 pt-12 sm:pt-16">
        <Link
          href={backHref}
          style={delay(100)}
          className="enter mb-10 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {categoryLabel(study.category)}
        </Link>

        <p style={delay(150)} className="enter mb-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-sky-300/90">
          Case study · {categoryLabel(study.category)}
        </p>
        <h1 style={delay(250)} className="enter text-shimmer pb-1 text-4xl font-semibold tracking-tight sm:text-6xl">
          {study.name}
        </h1>
        <p style={delay(350)} className="enter mt-3 max-w-2xl text-lg text-zinc-300">
          {study.tagline}
        </p>
        <p style={delay(450)} className="enter mt-6 max-w-3xl text-[15px] leading-relaxed">
          {study.summary}
        </p>

        <dl
          style={delay(550)}
          className="enter mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-3"
        >
          {study.meta.map((m) => (
            <div key={m.label} className="bg-[#0c0c11] p-5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">{m.label}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-zinc-200">{m.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {study.facts.map((f, i) => (
            <div
              key={f.label}
              style={delay(650 + i * 80)}
              className="enter spotlight rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="font-mono text-2xl font-semibold tracking-tight text-white">{f.value}</div>
              <div className="mt-1 text-[11px] leading-snug text-zinc-500">{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 01 · Flow */}
      <Section label="01 · The flow" title={study.flow.title} intro={study.flow.intro}>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {study.flow.steps.map((j, i) => (
            <li
              key={j.step}
              style={delay((i % 4) * 90)}
              className="reveal spotlight group relative rounded-2xl border border-white/10 bg-[#0c0c11]/80 p-5 transition-[border-color,translate] duration-500 hover:-translate-y-1 hover:border-sky-400/30"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-sky-300/80">{String(i + 1).padStart(2, "0")}</span>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-zinc-500">
                  {j.actor}
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-white">{j.step}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">{j.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 02 · Architecture */}
      <Section label="02 · Architecture" title={study.architecture.title}>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="reveal space-y-4 text-[15px] leading-relaxed">
            {study.architecture.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div style={delay(150)} className="reveal space-y-4">
            {study.architecture.stack.map((s) => (
              <div key={s.group}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">{s.group}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.items.map((i) => (
                    <Tag key={i}>{i}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 03 · Systems */}
      <Section
        label="03 · Systems"
        title="What I designed and built"
        intro="Grouped by the part of the business they serve."
      >
        <div className="space-y-12">
          {study.groups.map((g) => (
            <div key={g.name}>
              <div className="reveal mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-base font-medium text-white">{g.name}</h3>
                <p className="text-xs text-zinc-500">{g.description}</p>
              </div>
              <div
                style={delay(100)}
                className="reveal divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c11]/80"
              >
                {g.systems.map((s) => (
                  <SystemRow key={s.id} system={s} index={numbered.get(s.id) ?? 0} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 04 · Decisions */}
      <Section label="04 · Decisions" title="Engineering trade-offs">
        <div className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c11]/80">
          {study.decisions.map((d) => (
            <div key={d.choice} className="reveal grid gap-1 p-5 sm:grid-cols-[0.9fr_1.1fr] sm:gap-8">
              <p className="text-sm font-medium text-white">{d.choice}</p>
              <p className="text-sm leading-relaxed text-zinc-400">{d.why}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section label="Work with me" title={study.cta.title} intro={study.cta.text}>
        <div className="reveal">
          <ContactActions withLinkedIn={false} />
        </div>
      </Section>
    </>
  );
}

function SystemRow({ system, index }: { system: System; index: number }) {
  return (
    <details id={system.id} className="group scroll-mt-24">
      <summary className="flex cursor-pointer list-none items-start gap-4 p-5 transition-colors duration-300 hover:bg-white/[0.03] [&::-webkit-details-marker]:hidden">
        <span className="mt-0.5 font-mono text-xs text-sky-300/80">{String(index).padStart(2, "0")}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white">{system.title}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">{system.intro}</p>
        </div>
        <span className="mt-0.5 text-lg leading-none text-zinc-500 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-45 group-open:text-sky-300">
          +
        </span>
      </summary>
      <ul className="space-y-2.5 px-5 pb-6 pl-[3.25rem]">
        {system.points.map((p) => (
          <li key={p} className="flex gap-3 text-[14px] leading-relaxed text-zinc-300">
            <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-sky-400/70" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
