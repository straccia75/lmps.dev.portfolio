"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { Mic, MicOff, PhoneOff, X } from "lucide-react";
import { AvatarEngine, type Shape } from "./engine";

/*
  Ava: voice assistant of the portfolio (ElevenLabs agent).
  The agent calls client tools that run here, in the visitor's browser:
  they navigate the site, change the shape of the avatar and send a stream
  of particles to the section being shown.
*/

const AGENT_ID = "agent_7801m7zw4k5cfegs546m86g5m83b";
const MAX_SESSION_MS = 5 * 60 * 1000; // keeps ElevenLabs credits under control
const SHAPE_HOLD_MS = 14000;

const SECTION_SHAPES: Record<string, Shape> = {
  "voice-gateway": "wave",
  "simulation-engine": "wave",
  "content-engine": "wave",
  webgl: "wave",
  crm: "funnel",
  billing: "funnel",
  acquisition: "funnel",
  "trial-funnel": "funnel",
  admin: "funnel",
  certification: "funnel",
  "claude-connector": "bridge",
};

const DEMOS: Record<string, { path: string; id: string; shape: Shape; label: string }> = {
  "voice-simulation": { path: "/work/prospeak", id: "in-action", shape: "wave", label: "the ProSpeak voice simulation" },
  "claude-connector": { path: "/work/prospeak", id: "demo-claude", shape: "bridge", label: "the Claude connector demo" },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
  const shapeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sessionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [open, setOpen] = useState(false);
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

  const showShape = useCallback((s: Shape) => {
    engineRef.current?.setShape(s);
    clearTimeout(shapeTimer.current);
    shapeTimer.current = setTimeout(() => engineRef.current?.setShape("sphere"), SHAPE_HOLD_MS);
  }, []);

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
        showShape(area === "data" ? "pipeline" : "funnel");
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
        showShape(project === "aviation-pipeline" ? "pipeline" : (id && SECTION_SHAPES[id]) || "wave");
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
        showShape(d.shape);
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
        showShape("logo");
        const el = await goTo("/", "contact");
        return el ? "The contact section is on screen." : "Could not open the contact section.";
      },
    }),
    [goTo, showShape],
  );

  const clientTools = useMemo(() => {
    type ToolFn = (params: Record<string, unknown>) => Promise<string>;
    const wrapped: Record<string, ToolFn> = {};
    for (const [name, fn] of Object.entries(rawTools)) {
      wrapped[name] = async (params) => {
        log("tool call", name, params);
        try {
          const result = await (fn as unknown as ToolFn)(params);
          log("tool result", name, result);
          return result;
        } catch (e) {
          logError("tool failed", name, e);
          return `The ${name} tool failed.`;
        }
      };
    }
    return wrapped;
  }, [rawTools]);

  const conversation = useConversation({
    clientTools,
    onConnect: (info: unknown) => {
      log("connected", info);
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
      engineRef.current?.setShape("sphere");
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

  const start = async () => {
    setError("");
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
      log("startSession", { agentId: AGENT_ID, connectionType: "websocket" });
      const id = await conversation.startSession({ agentId: AGENT_ID, connectionType: "websocket" });
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
            : "w-20"
        }`}
      >
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
          onClick={() => setOpen(true)}
          disabled={open}
          aria-label={open ? "Ava" : "Talk with Ava, Luigi's voice assistant"}
          className={`relative block w-full ${
            open
              ? "h-56 cursor-default"
              : "h-20 rounded-full border border-white/10 bg-[#0b0b10]/80 shadow-[0_20px_60px_-20px_rgba(56,189,248,0.6)] backdrop-blur-xl transition-transform duration-500 hover:scale-105"
          }`}
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        </button>

        {open && (
          <div className="px-4 pb-4">
            <p className="text-center text-[11px] uppercase tracking-[0.18em] text-sky-300">{status}</p>
            {caption && connected && (
              <p className="mt-2 line-clamp-3 text-center text-[13px] leading-relaxed text-zinc-300">{caption}</p>
            )}
            {error && <p className="mt-2 text-center text-[13px] text-rose-300">{error}</p>}

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
