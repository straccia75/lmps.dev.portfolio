"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

/* Fixed header: transparent at the top, glass bar once the page scrolls. */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[#07070a]/70 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="enter mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:h-20 sm:px-8 lg:px-12">
        <Link href="/" aria-label="LMPS.dev home" className="shrink-0">
          <Image
            src="/logo-mark.png"
            alt="LMPS.dev"
            width={706}
            height={316}
            priority
            className={`w-auto transition-[height] duration-500 ${scrolled ? "h-8 sm:h-9" : "h-9 sm:h-11"}`}
          />
        </Link>

        <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-[#0c0c11]/70 p-1 backdrop-blur-md">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 transition-colors duration-300 hover:bg-white/[0.08] hover:text-white sm:px-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
