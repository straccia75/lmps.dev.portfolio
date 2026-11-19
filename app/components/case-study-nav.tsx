"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/*
  Case-study navigation helpers:
  - a link to a system (#id) opens its collapsible <details> before the page scrolls to it
  - opening the page with a system's #id in the URL opens that system too
  - a floating "Contents" button appears once the reader has scrolled past the index
*/
export function CaseStudyNav({ indexId }: { indexId: string }) {
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const openFromHash = (hash: string) => {
      const id = decodeURIComponent(hash.replace(/^#/, ""));
      if (!id) return;
      const target = document.getElementById(id);
      if (target instanceof HTMLDetailsElement) target.open = true;
    };

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href^='#']");
      if (link) openFromHash(link.getAttribute("href") ?? "");
    };
    const onHashChange = () => openFromHash(window.location.hash);

    openFromHash(window.location.hash);
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  useEffect(() => {
    const index = document.getElementById(indexId);
    if (!index) return;
    const onScroll = () => setShowBack(index.getBoundingClientRect().bottom < 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [indexId]);

  return (
    <a
      href={`#${indexId}`}
      aria-label="Back to contents"
      className={`fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0c0c11]/90 px-4 py-2 text-xs text-zinc-300 shadow-lg backdrop-blur transition-[opacity,translate,border-color] duration-500 hover:border-sky-400/30 hover:text-white ${
        showBack ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="h-3.5 w-3.5" />
      Contents
    </a>
  );
}
