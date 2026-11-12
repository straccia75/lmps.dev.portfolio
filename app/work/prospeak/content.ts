export type System = {
  id: string;
  title: string;
  intro: string;
  points: string[];
};

export const SUMMARY =
  "ProSpeak teaches English to Spanish-speaking professionals through levelled lessons (A1–B2) and real-time voice simulations in which the student interviews an AI character, such as a patient. Around the learning product I built the full business layer: a CRM for the sales team, an automated acquisition funnel, Stripe billing, channel analytics and a certification system.";

export const META = [
  { label: "Role", value: "Founder and sole engineer" },
  {
    label: "Scope",
    value: "Business logic, architecture, backend, frontend, AI integration, payments, CRM, admin, deployment",
  },
  { label: "Status", value: "In production, early stage" },
];

export const STACK = [
  { group: "Frontend", items: ["Next.js", "React", "TypeScript", "WebGL / GLSL"] },
  {
    group: "Backend",
    items: [
      "Python",
      "FastAPI (async)",
      "Uvicorn",
      "Pydantic v2",
      "SQLAlchemy 2.0 async",
      "Alembic",
      "SQLite (aiosqlite)",
      "WebSockets",
      "JWT",
      "bcrypt",
    ],
  },
  { group: "AI & voice", items: ["Gemini Live API", "Deepgram"] },
  { group: "Payments & email", items: ["Stripe", "Resend"] },
  { group: "Infrastructure", items: ["DigitalOcean"] },
];

export const FACTS = [
  { value: "10", label: "subsystems designed and built" },
  { value: "24", label: "trial paths: 6 professions × 4 levels" },
  { value: "~10 KB", label: "custom WebGL avatar engine" },
  { value: "1", label: "engineer, from business model to deploy" },
];

export const ARCHITECTURE = [
  "The Next.js frontend talks to a FastAPI backend over REST and, during AI practice, over a bidirectional audio WebSocket. The backend is fully asynchronous (FastAPI + SQLAlchemy 2.0 async), so real-time voice sessions, AI calls and payment webhooks never block the API.",
  "The backend is the only authority over anything with economic or academic value: AI usage, grades, certificates, prices and account state.",
  "Persistence runs on SQLite behind SQLAlchemy, with chained Alembic migrations applied automatically on every deploy. Moving to PostgreSQL is a configuration change plus a data migration; the driver is already included.",
];

export const JOURNEY = [
  { step: "Landing page", detail: "One per profession, or a sales rep's trial link", actor: "Automated" },
  { step: "Placement test", detail: "Audio questions, level assigned", actor: "Automated" },
  { step: "Trial lesson", detail: "8 blocks with a voice simulation", actor: "AI" },
  { step: "AI report", detail: "Level and performance written to the CRM", actor: "AI" },
  { step: "Sales call", detail: "Rep calls knowing the result", actor: "Sales rep" },
  { step: "Payment", detail: "Stripe or approved manual method", actor: "Automated" },
  { step: "Active student", detail: "Account, AI access, commission, email", actor: "Automated" },
  { step: "Certificate", detail: "Exam graded on the server", actor: "Automated" },
];

export const GROUPS = [
  {
    name: "Product",
    description: "What the student uses.",
    ids: ["simulation-engine", "voice-gateway", "content-engine", "webgl"],
  },
  {
    name: "Sales and growth",
    description: "How students are acquired, and how the team sells.",
    ids: ["acquisition", "trial-funnel", "crm", "admin"],
  },
  {
    name: "Money and trust",
    description: "Payments, grades and anything that must not be tampered with.",
    ids: ["billing", "certification"],
  },
];

export const SYSTEMS: System[] = [
  {
    id: "voice-gateway",
    title: "Real-time voice gateway with usage metering",
    intro:
      "AI usage is the main variable cost of the business, so the server controls it from start to finish.",
    points: [
      "Custom WebSocket proxy between the browser and Gemini Live. Authentication travels in the first frame instead of the URL, so tokens never reach the logs. Two credential types: student or public trial link.",
      "The server rewrites every session config: fixed model, audio only, an allowlist of voices, a prompt size limit and no tools. The provider only receives PCM audio and short, validated text.",
      "Audio seconds are measured in both directions and balance is debited atomically every 5 seconds and on close. Free trials have their own cap per link.",
      "Controlled lifecycle: authentication deadline, idle disconnect, maximum session length, and automatic close when the balance reaches zero or access is revoked.",
      "Custom close-code protocol (4400–4502) that the frontend maps to user-facing messages, plus live remaining-balance updates.",
      "Migration without breaking cached clients: the old client-side debit endpoint still responds but no longer debits, which prevents double charging during the transition.",
    ],
  },
  {
    id: "simulation-engine",
    title: "Conversational simulation engine",
    intro:
      "The core of the product: voice interviews with characters that behave in a believable and pedagogically useful way.",
    points: [
      "Prompts built per level, using a “theatre rehearsal” frame, turn examples calibrated to each level, and a one-fact-per-turn rule so the student has to keep asking.",
      "Real-time character supervision: a detector reads the transcript and, if the model breaks character, the system sends a silent stage direction mid-session without interrupting the conversation (capped per session). Subtitles and transcripts are stripped of meta-text.",
      "Stage-style, no-scroll interface: objectives bar, central avatar with status ring, live subtitles, a current-objective card that ticks itself when met, support phrases graded by level (always, on demand or none), a “lifeline” after 8 seconds of silence, and tap, hold or spacebar microphone control.",
      "Audio orchestration: tutor narration, the character's turn and the timer are chained so voices never overlap and the clock starts at the right moment.",
      "Automatic evaluation at the end: a second model writes a performance report and assigns a level. The result is stored and shown in the CRM.",
    ],
  },
  {
    id: "trial-funnel",
    title: "Conversion-oriented trial funnel",
    intro: "The trial lesson is designed as a sales funnel, not just a demo.",
    points: [
      "Placement test with audio questions, a question bank per profession and no answers exposed to the client. Users can change level afterwards and the choice is saved.",
      "Full 8-block lesson with an AI consultation at the assigned level.",
      "Personalised closing screen with the level achieved, objectives met, next step, price and a WhatsApp call to action that names the assigned advisor.",
    ],
  },
  {
    id: "crm",
    title: "Sales CRM",
    intro: "The internal tool for the sales team.",
    points: [
      "Lead management with funnel stage and origin (sales rep or automatic).",
      "Trial links generated per sales rep, so every sale can be attributed.",
      "Each lead's trial result, level and AI report, so the rep calls knowing exactly how the prospect performed.",
      "Sales logging and manual approval of alternative payment methods (Binance, PayPal) for markets where cards are not viable.",
      "Commissions calculated automatically, only when the sale was originated by a rep.",
      "Internal chat between reps and admin, with messages that reference specific leads.",
    ],
  },
  {
    id: "billing",
    title: "Stripe billing",
    intro: "Payments, account activation and attribution in a single flow.",
    points: [
      "Checkout with inline prices from a single source of truth in the backend, which also serves those prices to the frontend. The price on the site and the price charged cannot drift apart.",
      "One webhook flow creates or activates the account, unlocks AI access, records the payment, attributes the commission, marks the lead as converted, sends the access email and notifies the admin.",
      "Abandoned payments detected through Stripe's session-expired event, with an admin alert and a follow-up list.",
      "Enrolment offer tied to each trial link, valid for 30 days.",
    ],
  },
  {
    id: "acquisition",
    title: "Automated acquisition funnel",
    intro: "A self-serve channel that runs without a sales rep.",
    points: [
      "A general landing page plus one per profession, generated dynamically.",
      "Sign-up with consent. The trial link is sent by email only and expires in 72 hours, which also validates the contact.",
      "Layered anti-abuse: one trial per email and per WhatsApp number, per-IP limits and a honeypot against bots.",
      "Automatic leads enter without a rep or commission and are handled directly by the admin.",
    ],
  },
  {
    id: "admin",
    title: "Admin panel and channel analytics",
    intro: "Built to decide, with data, which acquisition channel to scale.",
    points: [
      "Sales-rep funnel and automated funnel compared side by side.",
      "Sales by rep and by payment method (card or manual).",
      "Rep activity: calls made and notes left on each lead.",
      "Unfinished payments and funnel leads with direct WhatsApp contact.",
    ],
  },
  {
    id: "certification",
    title: "Server-graded certification",
    intro: "Grades and certificates are never decided by the client.",
    points: [
      "Exam bank stored in the backend, organised by language, profession, level and lesson. The client only receives questions, never answers.",
      "Timed attempts, resume of an open attempt, level-unlock checks, a maximum of 3 attempts per 24 hours (with retry time) and a latency grace margin.",
      "Atomic, single-use grading. A pass is never downgraded, and certificate issuance and level-up run in a dedicated backend service.",
    ],
  },
  {
    id: "content-engine",
    title: "Declarative content engine and generation pipeline",
    intro: "Adding a new profession is content work, not engineering work.",
    points: [
      "Lessons are JSON documents made of reusable blocks: vocabulary, matching with translation, grammar, listening, gap-fill, pronunciation, simulation and AI consultation.",
      "Professions, courses and levels are discovered from the content structure at runtime, with no hard-coded lists.",
      "Python generators produce each profession's lesson JSON and its placement test.",
      "Pronunciation is checked with speech recognition and tolerant matching; speech synthesis runs on Deepgram.",
      "Current output: 6 professions with a trial lesson at 4 levels, 24 paths with their own pedagogical progression.",
    ],
  },
  {
    id: "webgl",
    title: "WebGL particle avatars",
    intro: "A custom renderer built for mid-range Android phones.",
    points: [
      "Own engine on WebGL 1 with GLSL shaders, no Three.js: about 10 KB and no dependencies.",
      "Animated states: breathing, a 68 bpm heartbeat for the patient, assembly vortex, listening, counter-rotating “thinking” rings, speech driven by the real audio signal (low frequencies move the equator, attacks move the poles) and an error state.",
      "Pauses when off-screen, recovers from WebGL context loss, and falls back to 2D when WebGL is unavailable or the user enables reduced motion.",
    ],
  },
];

export const SECURITY = [
  "Onboarding with signed, short-lived, single-use tokens, and responses that do not allow account enumeration.",
  "JWTs typed by context (access, onboarding, email) that cannot be reused outside their purpose, with backward compatibility.",
  "Passwords hashed with bcrypt and Pydantic validation on every endpoint.",
  "Upload validation (type and size) and internal errors never leaked to the client.",
  "All logic with economic or academic value (usage, grades, certificates, prices) runs on the server.",
];

export const DECISIONS = [
  {
    choice: "Plain WebGL instead of Three.js",
    why: "Performance on mid-range phones and minimal bundle weight.",
  },
  {
    choice: "Server-side metering instead of client-side",
    why: "Turns AI cost into something controllable and billable.",
  },
  {
    choice: "Declarative content instead of code",
    why: "Scaling to new professions is a content task, not an engineering one.",
  },
  {
    choice: "One source of truth for prices, no Stripe price IDs",
    why: "Prices change in one place without redeploying configuration.",
  },
  {
    choice: "Two funnels measured in parallel",
    why: "The architecture supports both assisted sales and self-serve, and the admin panel compares them.",
  },
  {
    choice: "SQLite in production during validation",
    why: "Zero operating cost, single-server deploys and trivial backups, with the data layer ready to move to PostgreSQL when volume justifies it.",
  },
];
