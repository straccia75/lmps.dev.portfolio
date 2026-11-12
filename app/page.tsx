import Link from "next/link";
import { ArrowRight, ArrowUpRight, Lock, MessageCircle } from "lucide-react";
import { Backdrop, Footer, Header, LINKEDIN_URL, Pill, SectionLabel, WHATSAPP_URL } from "./components/site";

const PROSPEAK_HIGHLIGHTS = [
  {
    title: "Sales CRM",
    text: "Leads by funnel stage, trial links per rep for attribution, automatic commissions and an internal chat that references leads.",
  },
  {
    title: "Conversion funnel",
    text: "Landing pages per profession, placement test, trial lesson and a closing screen with price and assigned advisor.",
  },
  {
    title: "Stripe billing",
    text: "One webhook flow activates the account, records the payment, attributes the commission and converts the lead.",
  },
  {
    title: "Real-time voice AI",
    text: "WebSocket proxy to Gemini Live with server-side usage metering, character supervision and automatic evaluation.",
  },
  {
    title: "Admin analytics",
    text: "Rep activity, sales by channel and payment method, and the assisted and self-serve funnels compared.",
  },
  {
    title: "Server-graded exams",
    text: "Answers never leave the backend. Attempt limits, atomic grading and certificate issuance on the server.",
  },
];

const CAPABILITIES = [
  {
    title: "Business logic in code",
    text: "Pricing, commissions, access rules, attribution and lead ownership, modelled explicitly and enforced on the server.",
  },
  {
    title: "CRMs and internal tools",
    text: "Pipelines, roles and permissions, activity tracking and dashboards that a sales team uses every day.",
  },
  {
    title: "Funnels and payments",
    text: "Acquisition flows, Stripe checkout and webhooks, abandoned-payment recovery and channel analytics.",
  },
  {
    title: "Real-time and AI features",
    text: "WebSocket services, voice AI integration and usage metering that keeps AI cost under control.",
  },
];

const STACK = [
  { group: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "WebGL / GLSL"] },
  { group: "Backend", items: ["Python", "FastAPI", "SQLAlchemy", "Alembic", "Pydantic", "WebSockets", "JWT"] },
  { group: "Data", items: ["SQLite", "PostgreSQL-ready", "Python data analysis"] },
  { group: "Services", items: ["Stripe", "Gemini Live", "Deepgram", "Resend", "DigitalOcean"] },
];

export default function Home() {
  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-[#07070a] text-zinc-400 font-sans antialiased selection:bg-sky-500/30 selection:text-white">
      <Backdrop />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Header />

        <main>
          {/* Hero */}
          <section className="pb-20 pt-16 sm:pt-24 lg:pt-28">
            <SectionLabel>Luigi Palmar · Software & data engineering</SectionLabel>
            <h1 className="max-w-4xl text-[2.35rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl">
              I turn business logic
              <span className="block bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                into production software.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-zinc-400 sm:text-base">
              Full-stack engineer. I design how a product makes money and how a team works with it, then build it:
              CRMs, sales funnels, Stripe billing, admin dashboards and real-time AI features, from the database to
              the interface.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/work/prospeak"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 shadow-[0_0_40px_rgba(255,255,255,0.12)] transition hover:scale-[1.03] active:scale-[0.98]"
              >
                Read the ProSpeak case study
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-zinc-200 transition hover:border-white/30 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Request a quote
              </a>
            </div>
          </section>

          {/* Featured work */}
          <section id="work" className="scroll-mt-8">
            <SectionLabel>Selected work</SectionLabel>

            <article className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0c0c11]/80 p-6 shadow-2xl backdrop-blur-xl sm:p-9">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-sky-300/80">01</span>
                    <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-zinc-400">
                      SaaS · In production
                    </span>
                    <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-zinc-400">
                      Founder · Sole engineer
                    </span>
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">ProSpeak</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">
                    English training for Spanish-speaking professionals, with real-time voice simulations against AI
                    characters. I designed the business model and built the whole operation around it: the learning
                    platform, the CRM my sales team works in, the acquisition funnel, billing and the admin panel I use
                    to run it.
                  </p>
                </div>
                <Link
                  href="/work/prospeak"
                  className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition hover:border-sky-400/50"
                >
                  Full case study
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <div className="relative mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
                {PROSPEAK_HIGHLIGHTS.map((h) => (
                  <div key={h.title} className="bg-[#0b0b10] p-5">
                    <h3 className="text-sm font-medium text-white">{h.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">{h.text}</p>
                  </div>
                ))}
              </div>

              <div className="relative mt-6 flex flex-wrap gap-1.5">
                {["Next.js", "TypeScript", "FastAPI", "SQLAlchemy async", "WebSockets", "Stripe", "Gemini Live", "WebGL"].map(
                  (t) => (
                    <Pill key={t}>{t}</Pill>
                  ),
                )}
              </div>
            </article>

            {/* Areas */}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.4rem] border border-white/10 bg-[#0c0c11]/80 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300/90">
                    Software development
                  </p>
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  Web applications, internal tools, CRMs, payment flows and APIs. More projects are being added to
                  this section.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/[0.015] p-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    Data engineering
                  </p>
                  <Lock className="h-3.5 w-3.5 text-zinc-600" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  Pipelines, data modelling and analytics projects. In preparation.
                </p>
              </div>
            </div>
          </section>

          {/* Capabilities */}
          <section className="mt-24">
            <SectionLabel>What I build</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              {CAPABILITIES.map((c) => (
                <div key={c.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <h3 className="text-base font-medium text-white">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{c.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* About */}
          <section id="about" className="mt-24 scroll-mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionLabel>About</SectionLabel>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                I learned the business before I wrote the code.
              </h2>
            </div>
            <div className="space-y-4 text-[15px] leading-relaxed">
              <p>
                Before engineering I spent five years in B2B sales, customer operations and real-time workforce
                management, working every day in CRMs like Salesforce and Zoho.
              </p>
              <p>
                That is where my software starts: who owns a lead, when a commission is earned, what happens when a
                payment is abandoned, what a manager needs to see at the end of the day. I write those rules down,
                then I implement them so they hold in production.
              </p>
            </div>
          </section>

          {/* Stack */}
          <section className="mt-24">
            <SectionLabel>Stack</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STACK.map((s) => (
                <div key={s.group} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <p className="mb-3 text-xs text-zinc-500">{s.group}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.items.map((i) => (
                      <Pill key={i}>{i}</Pill>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section
            id="contact"
            className="mt-24 scroll-mt-8 rounded-[1.7rem] border border-white/10 bg-[#0c0c11]/80 p-8 backdrop-blur-xl sm:p-12"
          >
            <SectionLabel>Contact</SectionLabel>
            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Have a process that should be a system?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed">
              Tell me how your business works today. I will tell you what I would build and how long it would take.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:scale-[1.03] active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:border-white/30 hover:text-white"
              >
                LinkedIn
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
