import { ContactActions, delay, PageShell, Section } from "./components/site";
import { AreaDoors } from "./components/area-doors";
import { getSiteMode } from "./lib/site-mode";
import { WorkTabs } from "./components/work-tabs";
import { CATEGORIES, PROJECTS } from "./work/registry";
import { HeroShowcase } from "./components/hero-showcase";

export default async function Home() {
  const mode = await getSiteMode();

  return (
    <PageShell>
      {/* 1. Hero */}
      <section className="grid min-h-[calc(100dvh-5rem)] items-center gap-14 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-0">
        <div>
          <p style={delay(150)} className="enter mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-sky-300/90">
            Luigi Straccia · Software, data & AI engineer
          </p>
          <h1
            style={delay(250)}
            className="enter text-[2.25rem] font-semibold leading-[1.04] tracking-tight text-white sm:text-5xl xl:text-6xl"
          >
            I build business software, data pipelines
            <span className="text-shimmer block pb-2">and the AI that connects them.</span>
          </h1>
          <p style={delay(400)} className="enter mt-7 max-w-xl text-[15px] leading-relaxed sm:text-base">
            CRMs, sales funnels and streaming data platforms, with custom MCP connectors that let Claude work directly
            with your business data. Designed around how the business works and built end to end.
          </p>
          <div style={delay(550)} className="enter mt-10">
            <AreaDoors />
          </div>
          <a
            href="#contact"
            style={delay(650)}
            className="enter mt-5 inline-block text-sm text-zinc-400 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Or tell me about your project
          </a>
        </div>

        <div style={delay(500)} className="enter mx-auto hidden w-full max-w-[560px] sm:block">
          <HeroShowcase />
        </div>
      </section>

      {/* 2. Work, classified by area */}
      <Section
        id="work"
        label="Work"
        title="Projects"
      >
        <div className="reveal">
          <WorkTabs
            tabs={CATEGORIES}
            projects={PROJECTS.map((p) => ({
              slug: p.slug,
              category: p.category,
              name: p.name,
              thumbnail: p.media?.thumbnail,
              ...p.card,
            }))}
          />
        </div>
      </Section>

      {/* 3. About */}
      <Section id="about" label="About" title="I learned the business before I wrote the code.">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.7fr]">
          <div className="reveal space-y-4 text-[15px] leading-relaxed">
            <p>
              Before I moved into engineering, I spent five years in B2B sales, sales training and customer
              operations, working in Salesforce and Zoho every day. At a New York funding company I trained a
              45-person outbound team, wrote its first sales playbook and cut new-agent ramp-up from six weeks to
              three.
            </p>
            <p>
              That is where my software starts: who owns a lead, when a commission is earned, what happens when a
              payment is abandoned, what a manager needs to see at the end of the day. I define those rules first,
              then build software that enforces them.
            </p>
            <p>
              Today I run ProSpeak, an EdTech business I planned, coded and launched myself, from the platform to
              the cold-call scripts the sales team works with.
            </p>
          </div>
          <dl style={delay(150)} className="reveal space-y-5 text-sm">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Focus</dt>
              <dd className="mt-1.5 text-zinc-300">CRMs, sales funnels, billing, data pipelines, AI automation, custom MCP connectors</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Main stack</dt>
              <dd className="mt-1.5 text-zinc-300">TypeScript, Next.js, Python, FastAPI, Stripe, Spark, BigQuery, dbt</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Based in</dt>
              <dd className="mt-1.5 text-zinc-300">Bogotá, Colombia</dd>
            </div>
          </dl>
        </div>
      </Section>

      {/* 4. Contact */}
      <Section
        id="contact"
        label="Contact"
        title="Have a process that should be a system?"
        intro={
          mode === "upwork"
            ? "Tell me how your business runs today and where it is losing time or sales. Invite me to your job on Upwork and we can start there."
            : "Tell me how your business runs today and where it is losing time or sales."
        }
      >
        <div className="reveal">
          <ContactActions />
        </div>
      </Section>
    </PageShell>
  );
}
