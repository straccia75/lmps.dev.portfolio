import Image from "next/image";
import Link from "next/link";
import { Effects } from "./effects";

/* Stagger helper for .enter / .reveal: delay(120) */
export function delay(ms: number) {
  return { "--delay": `${ms}ms` } as React.CSSProperties;
}

export const WHATSAPP_URL =
  "https://wa.me/393332988640?text=Hi%20Luigi,%20I%20visited%20lmps.dev%20and%20I%20would%20like%20to%20talk%20about%20a%20project.";

export const LINKEDIN_URL = "https://www.linkedin.com/in/luigi-straccia-80858a241";

/* Page frame: background, header, footer. Every page uses this. */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-[#07070a] text-zinc-400 font-sans antialiased selection:bg-sky-500/30 selection:text-white">
      <Effects />
      <Backdrop />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}

function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.10),transparent_50%)]" />
      <div className="absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2">
        <div className="drift-a h-full w-full rounded-full bg-sky-500/10 blur-[120px]" />
      </div>
      <div className="drift-b absolute bottom-[-20%] right-[-10%] h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-[110px]" />
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
  );
}

const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

function Header() {
  return (
    <header className="enter flex items-center justify-between gap-4 pt-5 sm:pt-7">
      <Link href="/" aria-label="LMPS.dev home" className="relative h-14 w-40 sm:h-16 sm:w-52 scale-[2.25]">
        <Image
          src="/logo2.png"
          alt="LMPS.dev"
          fill
          sizes="(max-width: 640px) 160px, 208px"
          className="object-contain object-left"
          priority
        />
      </Link>
      <nav className="relative z-10 flex items-center gap-1 rounded-full border border-white/10 bg-[#0c0c11]/80 p-1 backdrop-blur-md">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 transition-colors duration-300 hover:bg-white/[0.08] hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 flex flex-col items-center justify-between gap-2 border-t border-white/5 py-6 text-[11px] tracking-wide text-zinc-600 sm:flex-row">
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
    <section id={id} className="scroll-mt-8 border-t border-white/5 py-16 sm:py-24">
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
