import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { delay, PageShell, PrimaryButton, Section, Tag, WHATSAPP_URL } from "../../components/site";
import {
  ARCHITECTURE,
  DECISIONS,
  FACTS,
  GROUPS,
  JOURNEY,
  META,
  SECURITY,
  STACK,
  SUMMARY,
  SYSTEMS,
  type System,
} from "./content";

export const metadata: Metadata = {
  title: "ProSpeak case study | Luigi Straccia",
  description:
    "English training SaaS with real-time voice AI, a sales CRM, Stripe billing and an automated acquisition funnel. Designed and built by Luigi Straccia.",
};

const SECURITY_ITEM: System = {
  id: "security",
  title: "Security audit and hardening",
  intro: "A full review of the platform, followed by hardening.",
  points: SECURITY,
};

export default function ProSpeakCaseStudy() {
  const byId = new Map(SYSTEMS.map((s) => [s.id, s]));
  const groups = GROUPS.map((g) => {
    const items = g.ids.map((id) => byId.get(id)).filter((s): s is System => Boolean(s));
    if (g.name === "Money and trust") items.push(SECURITY_ITEM);
    return { ...g, items };
  });
  const numbered = new Map(groups.flatMap((g) => g.items).map((s, i) => [s.id, i + 1]));

  return (
    <PageShell>
      {/* Overview */}
      <section className="pb-16 pt-12 sm:pt-16">
        <Link href="/#work" style={delay(100)} className="enter mb-10 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" />
          All work
        </Link>

        <p style={delay(150)} className="enter mb-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-sky-300/90">
          Case study · Software development
        </p>
        <h1 style={delay(250)} className="enter text-shimmer pb-1 text-4xl font-semibold tracking-tight sm:text-6xl">ProSpeak</h1>
        <p style={delay(350)} className="enter mt-3 max-w-2xl text-lg text-zinc-300">
          English training SaaS with real-time voice AI, a sales CRM and automated billing.
        </p>
        <p style={delay(450)} className="enter mt-6 max-w-3xl text-[15px] leading-relaxed">{SUMMARY}</p>

        <dl style={delay(550)} className="enter mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-3">
          {META.map((m) => (
            <div key={m.label} className="bg-[#0c0c11] p-5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">{m.label}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-zinc-200">{m.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FACTS.map((f, i) => (
            <div key={f.label} style={delay(650 + i * 80)} className="enter spotlight rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="font-mono text-2xl font-semibold tracking-tight text-white">{f.value}</div>
              <div className="mt-1 text-[11px] leading-snug text-zinc-500">{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 1. Customer journey */}
      <Section
        label="01 · The business"
        title="How a customer moves through the system"
        intro="Two entry channels, a sales rep's trial link or a self-serve landing page, lead to the same pipeline. Every step below is a rule I defined and then implemented."
      >
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {JOURNEY.map((j, i) => (
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

      {/* 2. Architecture */}
      <Section label="02 · Architecture" title="One backend owns everything of value">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="reveal space-y-4 text-[15px] leading-relaxed">
            {ARCHITECTURE.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div style={delay(150)} className="reveal space-y-4">
            {STACK.map((s) => (
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

      {/* 3. Systems, grouped */}
      <Section
        label="03 · Systems"
        title="What I designed and built"
        intro="Grouped by what they do for the business. Open any system for the technical detail."
      >
        <div className="space-y-12">
          {groups.map((g) => {
            return (
              <div key={g.name}>
                <div className="reveal mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-base font-medium text-white">{g.name}</h3>
                  <p className="text-xs text-zinc-500">{g.description}</p>
                </div>
                <div style={delay(100)} className="reveal divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c11]/80">
                  {g.items.map((s) => (
                    <SystemRow key={s.id} system={s} index={numbered.get(s.id) ?? 0} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 4. Decisions */}
      <Section label="04 · Decisions" title="Engineering trade-offs">
        <div className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c11]/80">
          {DECISIONS.map((d) => (
            <div key={d.choice} className="reveal grid gap-1 p-5 sm:grid-cols-[0.9fr_1.1fr] sm:gap-8">
              <p className="text-sm font-medium text-white">{d.choice}</p>
              <p className="text-sm leading-relaxed text-zinc-400">{d.why}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section
        label="Work with me"
        title="Need a system like this?"
        intro="CRMs, sales funnels, payment flows and internal tools, built around how your business actually works."
      >
        <div className="reveal">
        <PrimaryButton href={WHATSAPP_URL} external>
          <MessageCircle className="h-4 w-4" />
          Message on WhatsApp
        </PrimaryButton>
        </div>
      </Section>
    </PageShell>
  );
}

function SystemRow({ system, index }: { system: System; index: number }) {
  return (
    <details id={system.id} className="group scroll-mt-8">
      <summary className="flex cursor-pointer list-none items-start gap-4 p-5 transition-colors duration-300 hover:bg-white/[0.03] [&::-webkit-details-marker]:hidden">
        <span className="mt-0.5 font-mono text-xs text-sky-300/80">{String(index).padStart(2, "0")}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white">{system.title}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">{system.intro}</p>
        </div>
        <span className="mt-0.5 text-lg leading-none text-zinc-500 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-45 group-open:text-sky-300">+</span>
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
