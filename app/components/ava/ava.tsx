"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { Mic, MicOff, PhoneOff, X } from "lucide-react";
import { AvatarEngine } from "./engine";

/*
  Ava: voice assistant of the portfolio (ElevenLabs agent).
  The agent calls client tools that run here, in the visitor's browser:
  they navigate the site, change the shape of the avatar and send a stream
  of particles to the section being shown.
*/

const AGENT_ID = "agent_7801m7zw4k5cfegs546m86g5m83b";
const MAX_SESSION_MS = 5 * 60 * 1000; // keeps ElevenLabs credits under control

// Keyword the particles write when Ava shows a section
const SECTION_WORDS: Record<string, string> = {
  "voice-gateway": "VOICE AI",
  "simulation-engine": "VOICE AI",
  "trial-funnel": "FUNNEL",
  crm: "CRM",
  billing: "STRIPE",
  acquisition: "FUNNEL",
  admin: "ADMIN",
  "claude-connector": "CLAUDE",
  certification: "EXAMS",
  "content-engine": "CONTENT",
  webgl: "WEBGL",
  producer: "API",
  bronze: "SPARK",
  "lake-sync": "GCS",
  silver: "dbt",
  gold: "BIGQUERY",
  anomalies: "ANOMALIES",
  "physics-tests": "TESTS",
  "airport-check": "TESTS",
  "model-tests": "TESTS",
  architecture: "SYSTEM",
  decisions: "DECISIONS",
};

const PROJECT_WORDS: Record<string, string> = {
  prospeak: "PROSPEAK",
  "aviation-pipeline": "PIPELINE",
};

const DEMOS: Record<string, { path: string; id: string; word: string; label: string }> = {
  "voice-simulation": { path: "/work/prospeak", id: "in-action", word: "VOICE AI", label: "the ProSpeak voice simulation" },
  "claude-connector": { path: "/work/prospeak", id: "demo-claude", word: "CLAUDE", label: "the Claude connector demo" },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/*
  Daily limit per browser, kept in localStorage. It stops casual overuse of
  ElevenLabs credits; it is not a security measure (incognito resets it).
*/
const DAILY_LIMIT = 3;
const USAGE_KEY = "ava-usage";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function sessionsToday(): number {
  try {
    const raw = window.localStorage.getItem(USAGE_KEY);
    if (!raw) return 0;
    const u = JSON.parse(raw) as { date?: string; count?: number };
    return u.date === today() && typeof u.count === "number" ? u.count : 0;
  } catch {
    return 0;
  }
}

function countSession() {
  try {
    window.localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today(), count: sessionsToday() + 1 }));
  } catch {
    // storage unavailable (private mode, blocked): no limit, nothing to do
  }
}

// Debug logs in the browser console, prefixed with [Ava]
const log = (...args: unknown[]) => console.log("[Ava]", ...args);
const logError = (...args: unknown[]) => console.error("[Ava]", ...args);

// Best-effort readable reason from SDK disconnect/error payloads
function reasonOf(x: unknown): string {
  if (!x) return "";
  if (typeof x === "string") return x;
  if (x instanceof Error) return x.message;
  if (typeof x === "object") {
    const o = x as Record<string, unknown>;
    for (const k of ["message", "reason", "closeReason", "error"]) {
      const v = o[k];
      if (typeof v === "string" && v) return v;
      if (v && typeof v === "object") {
        const inner = reasonOf(v);
        if (inner) return inner;
      }
    }
    try {
      return JSON.stringify(x);
    } catch {
      return "";
    }
  }
  return String(x);
}

export function Ava() {
  return (
    <ConversationProvider>
      <AvaPanel />
    </ConversationProvider>
  );
}

function AvaPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<AvatarEngine | null>(null);
  const sessionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [open, setOpen] = useState(false);
  // Label next to the orb: appears shortly after load, hidden once Ava has been opened
  const [hint, setHint] = useState(false);
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHint(true), 1500);
    return () => clearTimeout(t);
  }, []);
  const openPanel = () => {
    setOpen(true);
    setOpened(true);
  };
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!canvasRef.current || !overlayRef.current) return;
    try {
      engineRef.current = new AvatarEngine(canvasRef.current, overlayRef.current);
    } catch {
      engineRef.current = null;
    }
    return () => engineRef.current?.destroy();
  }, []);

  /* ---------- helpers used by the tools ---------- */

  const showWord = useCallback((w: string) => engineRef.current?.showWord(w), []);

  // Wait until the route has changed and the element exists
  const waitFor = useCallback(async (path: string, id: string | null) => {
    for (let i = 0; i < 50; i++) {
      if (pathRef.current === path) {
        if (!id) return document.body;
        const el = document.getElementById(id);
        if (el) return el;
      }
      await sleep(100);
    }
    return null;
  }, []);

  const goTo = useCallback(
    async (path: string, id: string | null, query = "") => {
      const samePage = pathRef.current === path && !query;
      if (!samePage) router.push(`${path}${query}${id ? `#${id}` : ""}`, { scroll: !id });
      const el = await waitFor(path, id);
      if (!el) return null;
      if (el instanceof HTMLDetailsElement) el.open = true;
      if (id) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      // let the scroll settle, then send the particles
      setTimeout(() => engineRef.current?.flyTo(id ? el : document.querySelector("main") ?? el), 700);
      return el;
    },
    [router, waitFor],
  );

  /* ---------- client tools: names must match the agent configuration ---------- */

  const rawTools = useMemo(
    () => ({
      show_area: async ({ area }: { area: "software" | "data" }) => {
        showWord(area === "data" ? "DATA" : "SOFTWARE");
        if (pathRef.current === "/") {
          window.dispatchEvent(new CustomEvent("work-area", { detail: area }));
          const url = new URL(window.location.href);
          url.searchParams.set("area", area);
          window.history.replaceState(null, "", url);
        }
        const el = await goTo("/", "work", pathRef.current === "/" ? "" : `?area=${area}`);
        return el
          ? `The ${area === "data" ? "data engineering" : "software and AI"} projects are now on screen.`
          : "Could not open that area.";
      },

      open_case_study: async ({ project, section }: { project: string; section?: string }) => {
        const id = section && section !== "overview" ? section : null;
        showWord((id && SECTION_WORDS[id]) || PROJECT_WORDS[project] || "WORK");
        const el = await goTo(`/work/${project}`, id);
        if (!el && id) {
          await goTo(`/work/${project}`, null);
          return `Opened the ${project} case study, but the section ${section} was not found.`;
        }
        return id ? `The ${project} case study is open at the ${section} section.` : `The ${project} case study is open.`;
      },

      play_demo: async ({ demo }: { demo: string }) => {
        const d = DEMOS[demo];
        if (!d) return "That demo does not exist.";
        showWord(d.word);
        const el = await goTo(d.path, d.id);
        const video = el?.querySelector("video");
        if (!video) return `Opened ${d.label}, but the video was not found.`;
        // muted so it does not talk over Ava; the visitor can unmute it
        video.muted = true;
        try {
          await video.play();
        } catch {
          return `${d.label} is on screen. The visitor needs to press play.`;
        }
        return `${d.label} is playing on screen, muted.`;
      },

      go_to_contact: async () => {
        showWord("HELLO");
        const el = await goTo("/", "contact");
        return el ? "The contact section is on screen." : "Could not open the contact section.";
      },
    }),
    [goTo, showWord],
  );

  const clientTools = useMemo(() => {
    type ToolFn = (params: Record<string, unknown>) => Promise<string>;
    const wrapped: Record<string, ToolFn> = {};
    for (const [name, fn] of Object.entries(rawTools)) {
      wrapped[name] = async (params) => {
        log("tool call", name, params);
        engineRef.current?.setState("thinking");
        try {
          const result = await (fn as unknown as ToolFn)(params);
          log("tool result", name, result);
          return result;
        } catch (e) {
          logError("tool failed", name, e);
          return `The ${name} tool failed.`;
        } finally {
          const c = convRef.current;
          engineRef.current?.setState(c.isSpeaking ? "speaking" : "listening");
        }
      };
    }
    return wrapped;
  }, [rawTools]);

  const conversation = useConversation({
    clientTools,
    onConnect: (info: unknown) => {
      log("connected", info);
      countSession();
      setError("");
      engineRef.current?.setActive(true);
      clearTimeout(sessionTimer.current);
      sessionTimer.current = setTimeout(() => void convRef.current.endSession(), MAX_SESSION_MS);
    },
    onDisconnect: (details: unknown) => {
      log("disconnected", details);
      const reason = reasonOf(details);
      if (reason && !/user|client|1000/i.test(reason)) setError(`Disconnected: ${reason}`);
      engineRef.current?.setActive(false);
      engineRef.current?.setLevel(0);
      engineRef.current?.setState("idle");
      clearTimeout(sessionTimer.current);
    },
    onError: (message: unknown, context?: unknown) => {
      logError("error", message, context);
      setError(reasonOf(message) || "Something went wrong. Please try again.");
    },
    onMessage: (m: unknown) => {
      log("message", m);
      if (m && typeof m === "object" && "source" in m && "message" in m) {
        const { source, message } = m as { source: string; message: unknown };
        if (source === "ai" && typeof message === "string") setCaption(message);
      }
    },
  });
  const convRef = useRef(conversation);
  useEffect(() => {
    convRef.current = conversation;
  });

  useEffect(() => {
    log("status", conversation.status);
  }, [conversation.status]);

  const connected = conversation.status === "connected";
  const connecting = conversation.status === "connecting";

  // Avatar state: sphere while listening, ring while speaking
  useEffect(() => {
    engineRef.current?.setState(!connected ? "idle" : conversation.isSpeaking ? "speaking" : "listening");
  }, [connected, conversation.isSpeaking]);

  // Feed the audio level to the avatar
  useEffect(() => {
    if (!connected) return;
    let raf = 0;
    const tick = () => {
      const c = convRef.current;
      const level = c.isSpeaking ? c.getOutputVolume() : c.getInputVolume() * 0.5;
      engineRef.current?.setLevel(level * 1.6);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [connected]);

  const [limited, setLimited] = useState(false);

  const start = async () => {
    setError("");
    if (sessionsToday() >= DAILY_LIMIT) {
      log("daily limit reached", { limit: DAILY_LIMIT });
      setLimited(true);
      return;
    }
    log("start: requesting microphone", { origin: window.location.origin });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      log("microphone ok", stream.getAudioTracks().map((t) => t.label));
      stream.getTracks().forEach((t) => t.stop());
    } catch (e) {
      logError("microphone denied", e);
      setError("Ava needs microphone access to talk with you.");
      return;
    }
    try {
      // WebSocket: the browser connects straight to ElevenLabs and sends its real Origin,
      // so the domain allowlist works. With WebRTC (LiveKit) the allowlist check failed.
      // Tells Ava where she is: booking calls only on lmps.dev, never on upwork.lmps.dev
      // (same host rule as app/lib/site-mode.ts), plus the visitor's time zone for the slots.
      const dynamicVariables = {
        site_mode: window.location.hostname.toLowerCase().startsWith("upwork.") ? "upwork" : "main",
        visitor_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
      };
      log("startSession", { agentId: AGENT_ID, connectionType: "websocket", dynamicVariables });
      const id = await conversation.startSession({ agentId: AGENT_ID, connectionType: "websocket", dynamicVariables });
      log("session started", id);
    } catch (e) {
      logError("startSession failed", e);
      setError(reasonOf(e) || "Could not connect. Please try again.");
    }
  };

  const stop = () => void conversation.endSession();

  const status = connecting
    ? "Connecting…"
    : connected
      ? conversation.isSpeaking
        ? "Speaking"
        : "Listening"
      : "Ask me about Luigi's work";

  return (
    <>
      {/* Particles flying to the page */}
      <canvas ref={overlayRef} aria-hidden className="pointer-events-none fixed inset-0 z-[55] h-full w-full" />

      <div
        className={`fixed bottom-4 right-4 z-50 transition-[width,border-radius] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:bottom-6 sm:right-6 ${
          open
            ? "w-[min(calc(100vw-2rem),340px)] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0b0b10]/90 shadow-[0_40px_120px_-30px_rgba(56,189,248,0.45)] backdrop-blur-xl"
            : "w-24 sm:w-28"
        }`}
      >
        {/* Who is this: label beside the orb while it is closed */}
        {!open && !opened && (
          <button
            type="button"
            onClick={openPanel}
            className={`absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-2xl border border-white/10 bg-[#0b0b10]/90 px-4 py-2.5 text-left shadow-[0_20px_60px_-25px_rgba(56,189,248,0.6)] backdrop-blur-xl transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-sky-400/30 ${
              hint ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-3 opacity-0"
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-medium text-white">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
              </span>
              Talk with Ava
            </span>
            <span className="mt-0.5 block text-[11px] text-zinc-400">Luigi&apos;s AI voice assistant</span>
          </button>
        )}
        {open && (
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">Ava</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Luigi&apos;s voice assistant</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Minimise"
              className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Avatar: the same canvas, small when closed and large when open */}
        <button
          type="button"
          onClick={openPanel}
          disabled={open}
          aria-label={open ? "Ava" : "Talk with Ava, Luigi's voice assistant"}
          className={`relative block w-full ${
            open
              ? "h-56 cursor-default"
              : "h-24 rounded-full border border-white/10 bg-[#0b0b10]/80 shadow-[0_20px_60px_-20px_rgba(56,189,248,0.6)] backdrop-blur-xl transition-transform duration-500 hover:scale-105 sm:h-28"
          }`}
        >
          {/* soft pulse so the orb reads as something to click */}
          {!open && (
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-1 rounded-full border border-sky-400/40 motion-safe:animate-[ping_2.6s_cubic-bezier(0,0,0.2,1)_infinite]"
            />
          )}
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        </button>

        {open && (
          <div className="px-4 pb-4">
            <p className="text-center text-[11px] uppercase tracking-[0.18em] text-sky-300">{status}</p>
            {caption && connected && (
              <p className="mt-2 line-clamp-3 text-center text-[13px] leading-relaxed text-zinc-300">{caption}</p>
            )}
            {error && <p className="mt-2 text-center text-[13px] text-rose-300">{error}</p>}
            {limited && !connected && (
              <div className="mt-3 text-center text-[13px] leading-relaxed text-zinc-300">
                <p>You&apos;ve reached today&apos;s limit of conversations with Ava. Come back tomorrow, or reach Luigi directly.</p>
                <a
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-block text-sky-300 underline-offset-4 hover:underline"
                >
                  Go to contact
                </a>
              </div>
            )}

            <div className="mt-4 flex items-center justify-center gap-2">
              {connected || connecting ? (
                <>
                  <button
                    type="button"
                    onClick={() => conversation.setMuted(!conversation.isMuted)}
                    aria-label={conversation.isMuted ? "Unmute microphone" : "Mute microphone"}
                    className="rounded-full border border-white/15 bg-white/[0.03] p-3 text-zinc-200 transition-colors hover:border-white/30 hover:text-white"
                  >
                    {conversation.isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={stop}
                    className="inline-flex items-center gap-2 rounded-full bg-rose-500/90 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-500"
                  >
                    <PhoneOff className="h-4 w-4" />
                    End
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={start}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_0_40px_rgba(255,255,255,0.12)] transition hover:scale-[1.03]"
                >
                  <Mic className="h-4 w-4" />
                  Talk with Ava
                </button>
              )}
            </div>
            {!connected && !connecting && (
              <p className="mt-3 text-center text-[11px] leading-relaxed text-zinc-500">
                Voice conversation, uses your microphone. Ava can open projects on this page while you talk.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
