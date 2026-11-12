import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Effects } from "./effects";
import { getSiteMode, UPWORK_PROFILE_URL } from "../lib/site-mode";
import { Header } from "./header";

/* Stagger helper for .enter / .reveal: delay(120) */
export function delay(ms: number) {
  return { "--delay": `${ms}ms` } as React.CSSProperties;
}

const WHATSAPP_URL =
  "https://wa.me/393332988640?text=Hi%20Luigi,%20I%20visited%20lmps.dev%20and%20I%20would%20like%20to%20talk%20about%20a%20project.";

const LINKEDIN_URL = "https://www.linkedin.com/in/luigi-straccia-80858a241";

/* Page frame: background, fixed header, footer. Every page uses this. */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh w-full overflow-x-clip bg-[#07070a] text-zinc-400 font-sans antialiased selection:bg-sky-500/30 selection:text-white">
      <Effects />
      <Backdrop />
      <Header />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-16 sm:px-8 sm:pt-20 lg:px-12">
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}

/*
  Parallax background. Effects writes the scroll position to --scroll;
  each layer moves at its own speed, which creates depth.
*/
function layer(speed: number) {
  return { transform: `translate3d(0, calc(var(--scroll, 0) * ${speed}px), 0)` } as React.CSSProperties;
}

function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* base tint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.10),transparent_50%)]" />

      {/* far layer: grid, slowest */}
      <div className="absolute inset-x-0 -top-[20%] h-[160%] will-change-transform" style={layer(-0.06)}>
        <div
          className="h-full w-full opacity-[0.22]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse at 50% 35%, black 25%, transparent 70%)",
          }}
        />
      </div>

      {/* mid layer: sky light */}
      <div className="absolute -top-24 left-1/2 h-[560px] w-[900px] -translate-x-1/2 will-change-transform" style={layer(-0.18)}>
        <div className="drift-a h-full w-full rounded-full bg-sky-500/10 blur-[120px]" />
      </div>

      {/* mid layer: orbit rings */}
      <div className="absolute right-[-12%] top-[8%] h-[720px] w-[720px] will-change-transform" style={layer(-0.3)}>
        <div className="spin-slow h-full w-full rounded-full border border-white/[0.05]" />
        <div className="spin-slower absolute inset-[14%] rounded-full border border-dashed border-sky-300/[0.07]" />
        <div className="absolute inset-[30%] rounded-full border border-white/[0.04]" />
      </div>

      {/* near layer: violet light, moves against the scroll */}
      <div className="absolute bottom-[-25%] right-[-10%] h-[520px] w-[520px] will-change-transform" style={layer(0.12)}>
        <div className="drift-b h-full w-full rounded-full bg-violet-600/15 blur-[110px]" />
      </div>

      {/* noise vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55))]" />
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/5 py-6 text-[11px] tracking-wide text-zinc-600 sm:flex-row">
      <span>© {new Date().getFullYear()} Luigi Straccia</span>
      <span>Software & data engineering</span>
    </footer>
  );
}

/* Consistent section block: label, title, optional intro, content. */
export function Section({
  id,
  label,
  title,
  intro,
  children,
}: {
  id?: string;
  label: string;
  title?: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-white/5 py-16 sm:py-24">
      <div className="reveal">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-sky-300/90">{label}</p>
        {title && <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>}
        {intro && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-400">{intro}</p>}
      </div>
      {children && <div className={title || intro ? "mt-12" : ""}>{children}</div>}
    </section>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-zinc-300">
      {children}
    </span>
  );
}

export function PrimaryButton({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const cls =
    "group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 shadow-[0_0_40px_rgba(255,255,255,0.12)] transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] hover:shadow-[0_0_60px_rgba(125,211,252,0.25)] active:scale-[0.98]";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function SecondaryButton({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const cls =
    "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-zinc-200 transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.06] hover:text-white";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/*
  Contact buttons. On upwork.lmps.dev only the Upwork profile is rendered;
  WhatsApp and LinkedIn are not sent to the browser at all.
*/
export async function ContactActions({ withLinkedIn = true }: { withLinkedIn?: boolean }) {
  const mode = await getSiteMode();

  if (mode === "upwork") {
    return (
      <PrimaryButton href={UPWORK_PROFILE_URL} external>
        Hire me on Upwork
        <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </PrimaryButton>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <PrimaryButton href={WHATSAPP_URL} external>
        <MessageCircle className="h-4 w-4" />
        Message on WhatsApp
      </PrimaryButton>
      {withLinkedIn && (
        <SecondaryButton href={LINKEDIN_URL} external>
          LinkedIn
          <ArrowUpRight className="h-4 w-4" />
        </SecondaryButton>
      )}
    </div>
  );
}
