import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MessageCircle } from "lucide-react";
import { Backdrop, Footer, Header, Pill, SectionLabel, WHATSAPP_URL } from "../../components/site";
import { ARCHITECTURE, DECISIONS, FACTS, META, SECURITY, STACK, SUMMARY, SYSTEMS } from "./content";

export const metadata: Metadata = {
  title: "ProSpeak case study | LMPS.dev",
  description:
    "AI English training SaaS with real-time voice simulations, a sales CRM, Stripe billing and an automated acquisition funnel. Designed and built by Luigi Palmar.",
};

export default function ProSpeakCaseStudy() {
  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-[#07070a] text-zinc-400 font-sans antialiased selection:bg-sky-500/30 selection:text-white">
      <Backdrop />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Header />

        <main className="pt-14 sm:pt-20">
          <Link
            href="/#work"
            className="mb-8 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to work
          </Link>

          {/* Intro */}
          <section>
            <SectionLabel>Case study · 01</SectionLabel>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">ProSpeak</h1>
            <p className="mt-3 text-lg text-zinc-300 sm:text-xl">
              Professional English SaaS with real-time voice AI, a sales CRM and automated billing.
            </p>
            <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-zinc-400">{SUMMARY}</p>

            <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-3">
              {META.map((m) => (
                <div key={m.label} className="bg-[#0c0c11]/90 p-5">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">{m.label}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-zinc-200">{m.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {FACTS.map((f) => (
                <div
                  key={f.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                >
                  <div className="font-mono text-2xl font-semibold tracking-tight text-white">{f.value}</div>
                  <div className="mt-1 text-[11px] leading-snug text-zinc-500">{f.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Stack */}
          <section className="mt-20">
            <SectionLabel>Stack</SectionLabel>
            <div className="space-y-3">
              {STACK.map((s) => (
                <div key={s.group} className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="w-36 shrink-0 text-xs text-zinc-500">{s.group}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {s.items.map((i) => (
                      <Pill key={i}>{i}</Pill>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Architecture */}
          <section className="mt-20">
            <SectionLabel>Architecture</SectionLabel>
            <h2 className="text-2xl font-semibold tracking-tight text-white">One backend owns everything of value</h2>
            <div className="mt-5 max-w-3xl space-y-4 text-[15px] leading-relaxed">
              {ARCHITECTURE.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>

          {/* Systems */}
          <section className="mt-20">
            <SectionLabel>Systems I designed and built</SectionLabel>
            <h2 className="text-2xl font-semibold tracking-tight text-white">From business rule to production code</h2>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed">
              Each system below started as a business decision (who pays, who gets credit for a sale, what a trial
              is allowed to cost) and was implemented end to end.
            </p>

            <nav className="mt-6 flex flex-wrap gap-1.5">
              {SYSTEMS.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-zinc-400 transition hover:border-sky-400/40 hover:text-white"
                >
                  {String(i + 1).padStart(2, "0")} {s.title}
                </a>
              ))}
            </nav>

            <div className="mt-10 space-y-4">
              {SYSTEMS.map((s, i) => (
                <article
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-8 rounded-[1.4rem] border border-white/10 bg-[#0c0c11]/80 p-6 backdrop-blur-xl sm:p-8"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-sky-300/80">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-white">{s.title}</h3>
                      <p className="mt-1 text-sm text-zinc-400">{s.intro}</p>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2.5 sm:pl-9">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-3 text-[14px] leading-relaxed text-zinc-300">
                        <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-sky-400/70" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {/* Security */}
          <section className="mt-20">
            <SectionLabel>Security</SectionLabel>
            <h2 className="text-2xl font-semibold tracking-tight text-white">Audited and hardened</h2>
            <ul className="mt-5 max-w-3xl space-y-2.5">
              {SECURITY.map((p) => (
                <li key={p} className="flex gap-3 text-[14px] leading-relaxed text-zinc-300">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-sky-400/70" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Decisions */}
          <section className="mt-20">
            <SectionLabel>Engineering decisions</SectionLabel>
            <h2 className="text-2xl font-semibold tracking-tight text-white">Trade-offs, and why</h2>
            <div className="mt-6 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c11]/80">
              {DECISIONS.map((d) => (
                <div key={d.choice} className="grid gap-1 p-5 sm:grid-cols-[0.9fr_1.1fr] sm:gap-6">
                  <p className="text-sm font-medium text-white">{d.choice}</p>
                  <p className="text-sm leading-relaxed text-zinc-400">{d.why}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-20 rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-8 text-center sm:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-white">Need a system like this?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed">
              CRMs, sales funnels, payment flows and internal tools, built around how your business actually works.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:scale-[1.03] active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" />
              Request a quote
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
