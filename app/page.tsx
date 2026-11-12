import Link from "next/link";
import { ArrowRight, ArrowUpRight, Lock, MessageCircle } from "lucide-react";
import { delay, LINKEDIN_URL, PageShell, PrimaryButton, SecondaryButton, Section, Tag, WHATSAPP_URL } from "./components/site";

const PROSPEAK_POINTS = [
  "Sales CRM with lead attribution and automatic commissions",
  "Self-serve and rep-led funnels, measured side by side",
  "Stripe billing that activates accounts and converts leads in one flow",
  "Real-time voice AI with server-side usage metering",
];

const PROSPEAK_TAGS = ["Next.js", "TypeScript", "FastAPI", "SQLAlchemy", "WebSockets", "Stripe", "Gemini Live"];

export default function Home() {
  return (
    <PageShell>
      {/* 1. Hero */}
      <section className="pb-16 pt-16 sm:pb-24 sm:pt-28">
        <p style={delay(150)} className="enter mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-sky-300/90">
          Luigi Straccia · Full-stack engineer
        </p>
        <h1 style={delay(250)} className="enter max-w-3xl text-[2.25rem] font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
          I turn business logic
          <span className="text-shimmer block pb-1">
            into production software.
          </span>
        </h1>
        <p style={delay(400)} className="enter mt-6 max-w-2xl text-[15px] leading-relaxed sm:text-base">
          CRMs, sales funnels, payment flows and real-time AI features, designed around how the business works and
          built end to end.
        </p>
        <div style={delay(550)} className="enter mt-10 flex flex-col gap-3 sm:flex-row">
          <PrimaryButton href="/#work">
            View work
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </PrimaryButton>
          <SecondaryButton href="/#contact">Get in touch</SecondaryButton>
        </div>
      </section>

      {/* 2. Work, organised by area */}
      <Section id="work" label="Work" title="Selected work">
        <div className="space-y-12">
          {/* Area: Software development */}
          <div>
            <AreaHeader index="A" name="Software development" count="1 project" />

            <Link
              href="/work/prospeak"
              style={delay(100)}
              className="reveal spotlight group block rounded-[1.5rem] border border-white/10 bg-[#0c0c11]/80 p-6 backdrop-blur-xl transition-[border-color,box-shadow,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-sky-400/30 hover:shadow-[0_30px_80px_-30px_rgba(56,189,248,0.35)] sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">SaaS · Founder & sole engineer</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">ProSpeak</h3>
                  <p className="mt-2 max-w-xl text-[15px] leading-relaxed">
                    English training platform for professionals, with the full business operation built around it.
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-zinc-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </div>

              <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {PROSPEAK_POINTS.map((p) => (
                  <li key={p} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-sky-400/70" />
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-5">
                <div className="flex flex-wrap gap-1.5">
                  {PROSPEAK_TAGS.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-300">
                  Read case study
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>

          {/* Area: Data engineering */}
          <div>
            <AreaHeader index="B" name="Data engineering" count="Coming soon" />
            <div style={delay(100)} className="reveal flex items-center gap-4 rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.015] p-6 sm:p-8">
              <Lock className="h-4 w-4 shrink-0 text-zinc-600" />
              <p className="text-sm leading-relaxed text-zinc-500">
                Pipelines, data modelling and analytics projects. In preparation.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. About */}
      <Section id="about" label="About" title="I learned the business before I wrote the code.">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.7fr]">
          <div className="reveal space-y-4 text-[15px] leading-relaxed">
            <p>
              Before engineering I spent five years in B2B sales, customer operations and real-time workforce
              management, working every day in CRMs like Salesforce and Zoho.
            </p>
            <p>
              That is where my software starts: who owns a lead, when a commission is earned, what happens when a
              payment is abandoned, what a manager needs to see at the end of the day. I define those rules, then
              implement them so they hold in production.
            </p>
          </div>
          <dl style={delay(150)} className="reveal space-y-5 text-sm">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Focus</dt>
              <dd className="mt-1.5 text-zinc-300">CRMs, sales funnels, billing, internal tools, real-time AI</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Main stack</dt>
              <dd className="mt-1.5 text-zinc-300">TypeScript, Next.js, Python, FastAPI, SQLAlchemy, Stripe</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Based in</dt>
              <dd className="mt-1.5 text-zinc-300">Italy</dd>
            </div>
          </dl>
        </div>
      </Section>

      {/* 4. Contact */}
      <Section
        id="contact"
        label="Contact"
        title="Have a process that should be a system?"
        intro="Tell me how your business works today and what you need it to do."
      >
        <div className="reveal flex flex-col gap-3 sm:flex-row">
          <PrimaryButton href={WHATSAPP_URL} external>
            <MessageCircle className="h-4 w-4" />
            Message on WhatsApp
          </PrimaryButton>
          <SecondaryButton href={LINKEDIN_URL} external>
            LinkedIn
            <ArrowUpRight className="h-4 w-4" />
          </SecondaryButton>
        </div>
      </Section>
    </PageShell>
  );
}

function AreaHeader({ index, name, count }: { index: string; name: string; count: string }) {
  return (
    <div className="reveal mb-4 flex items-baseline justify-between gap-4">
      <h3 className="flex items-baseline gap-3 text-base font-medium text-white">
        <span className="font-mono text-xs text-sky-300/80">{index}</span>
        {name}
      </h3>
      <span className="text-xs text-zinc-500">{count}</span>
    </div>
  );
}
