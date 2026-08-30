"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Code2, Lock, MessageCircle, Sparkles, Terminal } from "lucide-react";

const TARGET = new Date("2026-09-21T00:00:00").getTime();

const STACK = [
  "Next.js",
  "React",
  "Tailwind CSS",
  "TypeScript",
  "Python",
  "FastAPI",
  "Alembic",
  "SQLite",
  "JWT Cookies",
];

const WORK = [
  {
    code: "01",
    name: "ProSpeak",
    tag: "SaaS · Upcoming",
    blurb: "AI pronunciation practice for working professionals.",
    locked: false,
  },
  {
    code: "02",
    name: "Client systems",
    tag: "Build · Private",
    blurb: "Product work and commissioned engineering.",
    locked: true,
  },
  {
    code: "03",
    name: "Selected builds",
    tag: "Archive · Soon",
    blurb: "The public case studies ship with the new site.",
    locked: true,
  },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function PortfolioPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const tick = () => {
      const distance = TARGET - Date.now();
      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return false;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
      return true;
    };

    if (!tick()) return;
    const interval = setInterval(() => {
      if (!tick()) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hrs", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-[#07070a] text-zinc-400 font-sans antialiased selection:bg-sky-500/30 selection:text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.10),transparent_50%)]" />
        <div className="absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 78%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 sm:px-8">
        <header className="flex items-center justify-between gap-4 pt-5 sm:pt-7">
          <div className="relative h-14 w-40 sm:h-16 sm:w-52 scale-[2.25]">
            <Image
              src="/logo2.png"
              alt="Brand Logo"
              fill
              sizes="(max-width: 640px) 160px, 208px"
              className="object-contain object-left"
              priority
            />
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-zinc-300 backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
            </span>
            V2.0 · 21.09.26
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center gap-8 py-8 lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12 lg:py-6">
          <section>
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-sky-300/90">
              <Terminal className="h-3.5 w-3.5" />
              Portfolio offline · rebuild in progress
            </p>

            <h1 className="text-[2.15rem] font-semibold leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl">
              Rebuilding
              <span className="mt-1 block bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                my public work.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
              This page is temporary. The portfolio is offline while I put the
              new showcase together — code projects, systems, and product work.
              What comes next is not a single-SaaS landing page. It is the full
              body of work.
            </p>

            <div className="mt-8">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                New site drops in
              </p>
              <div className="grid max-w-md grid-cols-4 gap-2 sm:gap-3">
                {units.map((unit) => (
                  <div
                    key={unit.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-2 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
                  >
                    <div className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-white sm:text-3xl">
                      {isMounted ? pad(unit.value) : "--"}
                    </div>
                    <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="https://wa.me/393332988640?text=Hi,%20I%20visited%20your%20portfolio%20and%20I%20would%20like%20to%20request%20a%20quote%20for%20my%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.12)]"
              >
                <MessageCircle className="h-4 w-4" />
                Request a quote
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <p className="text-xs text-zinc-500 sm:max-w-[240px]">
                Here for a build or a commission? Message me directly.
              </p>
            </div>
          </section>

          <section className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-sky-500/10 blur-3xl" />
            <article className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0c0c11]/80 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
                    <Code2 className="h-3.5 w-3.5" />
                    Selected work
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    Index / 2026
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Case studies unlock with the new portfolio
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-300">
                  3 pieces
                </span>
              </div>

              <div className="mb-5 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-zinc-700" />
                    <span className="h-2 w-2 rounded-full bg-zinc-700" />
                    <span className="h-2 w-2 rounded-full bg-zinc-700" />
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-zinc-500">
                    work.index
                  </span>
                </div>

                <ul className="divide-y divide-white/5">
                  {WORK.map((item) => (
                    <li
                      key={item.code}
                      className="flex items-start gap-3 px-4 py-3.5"
                    >
                      <span className="mt-0.5 font-mono text-[10px] text-zinc-500">
                        {item.code}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-medium text-white">
                            {item.name}
                          </h3>
                          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-zinc-400">
                            {item.tag}
                          </span>
                        </div>
                        <p className="mt-1 text-[12px] leading-relaxed text-zinc-500">
                          {item.blurb}
                        </p>
                      </div>
                      {item.locked ? (
                        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-600" />
                      ) : (
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mb-5 text-[13px] leading-relaxed text-zinc-400">
                <span className="text-zinc-200">ProSpeak</span> is a company I am
                launching. It will live in the portfolio as one product — not as
                this page. It is one of the pieces that unlock on 21.09.
              </p>

              <div>
                <h3 className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  <Code2 className="h-3 w-3" />
                  Current stack
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {STACK.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </section>
        </main>

        <footer className="pb-5 text-center text-[10px] tracking-wide text-zinc-600">
          © 2026. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
