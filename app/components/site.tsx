import Image from "next/image";
import Link from "next/link";

export const WHATSAPP_URL =
  "https://wa.me/393332988640?text=Hi%20Luigi,%20I%20visited%20lmps.dev%20and%20I%20would%20like%20to%20talk%20about%20a%20project.";

export const LINKEDIN_URL = "https://www.linkedin.com/in/luigi-palmar-80858a241";

export function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0">
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
  );
}

const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="flex items-center justify-between gap-4 pt-5 sm:pt-7">
      <Link href="/" aria-label="LMPS.dev home" className="relative h-14 w-40 sm:h-16 sm:w-52 scale-[2.25] origin-left">
        <Image
          src="/logo2.png"
          alt="LMPS.dev"
          fill
          sizes="(max-width: 640px) 160px, 208px"
          className="object-contain object-left"
          priority
        />
      </Link>
      <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur-md">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 flex flex-col items-center justify-between gap-2 border-t border-white/5 py-6 text-[11px] tracking-wide text-zinc-600 sm:flex-row">
      <span>© {new Date().getFullYear()} Luigi Palmar · LMPS.dev</span>
      <span>Software & data engineering · Italy</span>
    </footer>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-sky-300/90">
      {children}
    </p>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-zinc-300">
      {children}
    </span>
  );
}
