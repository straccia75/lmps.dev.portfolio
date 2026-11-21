/*
  Ava's avatar: a cloud of particles drawn on a 2D canvas.
  - State shapes: sphere (idle / listening), ring (speaking), orbit (thinking).
  - showWord() writes a keyword with the particles for a few seconds (STRIPE, CRM, dbt...).
  - It reacts to the audio level of the conversation.
  - flyTo() sends a stream of particles from the avatar to an element of the page,
    drawn on a full-screen overlay canvas.
  No dependencies. Pauses when the tab is hidden.
*/

export type AvatarState = "idle" | "listening" | "speaking" | "thinking";

type Vec = { x: number; y: number; z: number };
type Flyer = {
  sx: number; sy: number; cx: number; cy: number; ex: number; ey: number;
  start: number; dur: number; hue: number;
  px: number; py: number;
};

const SKY = [56, 189, 248];
const VIOLET = [167, 139, 250];

type ShapeKey = "sphere" | "ring" | "orbit" | `word:${string}`;

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/* ---------- shape generators: N points in roughly [-1, 1], y grows downwards ---------- */

function sphere(n: number): Vec[] {
  const pts: Vec[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    pts.push({ x: Math.cos(t) * r, y, z: Math.sin(t) * r });
  }
  return pts;
}

// Speaking: a flat ring facing the visitor, it pulses with the voice
function ring(n: number): Vec[] {
  const pts: Vec[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rand(-0.01, 0.01);
    const r = 0.82 + rand(-0.07, 0.07);
    pts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, z: rand(-0.06, 0.06) });
  }
  return pts;
}

// Thinking: three tilted orbits around a small core
function orbit(n: number): Vec[] {
  const pts: Vec[] = [];
  const tilts = [0.35, -0.6, 1.2];
  for (let i = 0; i < n; i++) {
    if (i % 5 === 0) {
      const u = rand(-1, 1), a = rand(0, Math.PI * 2), r = Math.sqrt(1 - u * u) * 0.18;
      pts.push({ x: Math.cos(a) * r, y: u * 0.18, z: Math.sin(a) * r });
      continue;
    }
    const t = tilts[i % 3];
    const a = rand(0, Math.PI * 2);
    const r = 0.85 + rand(-0.03, 0.03);
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    pts.push({ x, y: z * Math.sin(t), z: z * Math.cos(t) });
  }
  return pts;
}

// A word written with particles. Width is normalised to [-1, 1].
function word(n: number, text: string): Vec[] {
  if (typeof document === "undefined") return sphere(n);
  const font = "bold 90px system-ui, -apple-system, sans-serif";
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return sphere(n);
  probe.font = font;
  const w = Math.ceil(probe.measureText(text).width) + 20;
  const h = 110;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return sphere(n);
  ctx.fillStyle = "#fff";
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2 + 4);
  const data = ctx.getImageData(0, 0, w, h).data;
  const filled: [number, number][] = [];
  for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) if (data[(y * w + x) * 4 + 3] > 128) filled.push([x, y]);
  if (!filled.length) return sphere(n);
  const pts: Vec[] = [];
  for (let i = 0; i < n; i++) {
    const [x, y] = filled[(Math.random() * filled.length) | 0];
    pts.push({ x: (x / w - 0.5) * 2, y: ((y / h - 0.5) * 2 * h) / w, z: rand(-0.05, 0.05) });
  }
  return pts;
}


/* ---------- engine ---------- */

export class AvatarEngine {
  private ctx: CanvasRenderingContext2D;
  private octx: CanvasRenderingContext2D;
  private n: number;
  private cur: Vec[];
  private shapes = new Map<ShapeKey, Vec[]>();
  private target: Vec[];
  private shape: ShapeKey = "sphere";
  private state: AvatarState = "idle";
  private wordTimer: ReturnType<typeof setTimeout> | undefined;
  private angle = 0;
  private level = 0;
  private active = false;
  private flyers: Flyer[] = [];
  private raf = 0;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private slow: boolean;
  private ro: ResizeObserver;
  private onVis = () => (document.hidden ? this.stop() : this.start());
  private onResize = () => this.resizeOverlay();

  constructor(private canvas: HTMLCanvasElement, private overlay: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    const octx = overlay.getContext("2d");
    if (!ctx || !octx) throw new Error("Canvas 2D not available");
    this.ctx = ctx;
    this.octx = octx;
    this.slow = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.n = window.innerWidth < 640 ? 520 : 900;
    this.target = this.get("sphere");
    this.cur = this.target.map((p) => ({ x: p.x * 0.2, y: p.y * 0.2, z: p.z * 0.2 }));

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();
    this.resizeOverlay();
    window.addEventListener("resize", this.onResize);
    document.addEventListener("visibilitychange", this.onVis);
    this.start();
  }

  private get(key: ShapeKey) {
    let pts = this.shapes.get(key);
    if (!pts) {
      if (key === "ring") pts = ring(this.n);
      else if (key === "orbit") pts = orbit(this.n);
      else if (key.startsWith("word:")) pts = word(this.n, key.slice(5));
      else pts = sphere(this.n);
      this.shapes.set(key, pts);
    }
    return pts;
  }

  private apply(key: ShapeKey) {
    if (key === this.shape) return;
    this.shape = key;
    this.target = this.get(key);
  }

  private stateShape(): ShapeKey {
    return this.state === "speaking" ? "ring" : this.state === "thinking" ? "orbit" : "sphere";
  }

  /* idle / listening / speaking / thinking. A word on screen keeps priority. */
  setState(s: AvatarState) {
    this.state = s;
    if (!this.wordTimer) this.apply(this.stateShape());
  }

  /* Write a keyword with the particles, then go back to the state shape */
  showWord(text: string, ms = 4500) {
    clearTimeout(this.wordTimer);
    this.apply(`word:${text}`);
    this.wordTimer = setTimeout(() => {
      this.wordTimer = undefined;
      this.apply(this.stateShape());
    }, ms);
  }

  /* 0..1 audio level of whoever is talking */
  setLevel(v: number) {
    this.level = Math.max(0, Math.min(1, v));
  }

  /* connected: brighter and faster */
  setActive(v: boolean) {
    this.active = v;
  }

  /* Stream of particles from the avatar to an element of the page */
  flyTo(el: Element) {
    const from = this.canvas.getBoundingClientRect();
    const to = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const top = Math.max(0, to.top);
    const bottom = Math.min(vh, to.top + Math.min(to.height, 260));
    if (bottom <= top) return;
    const now = performance.now();
    const count = this.slow ? 30 : 140;
    for (let i = 0; i < count; i++) {
      const sx = from.left + from.width / 2 + rand(-from.width / 4, from.width / 4);
      const sy = from.top + from.height / 2 + rand(-from.height / 4, from.height / 4);
      const ex = rand(to.left + 16, Math.max(to.left + 17, to.right - 16));
      const ey = rand(top + 8, Math.max(top + 9, bottom - 8));
      this.flyers.push({
        sx, sy, ex, ey,
        cx: (sx + ex) / 2 + rand(-160, 160),
        cy: Math.min(sy, ey) - rand(80, 260),
        start: now + rand(0, 450),
        dur: rand(900, 1400),
        hue: Math.random(),
        px: sx, py: sy,
      });
    }
  }

  destroy() {
    clearTimeout(this.wordTimer);
    this.stop();
    this.ro.disconnect();
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVis);
  }

  private start() {
    if (!this.raf) this.raf = requestAnimationFrame(this.frame);
  }

  private stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private resize() {
    const r = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = r.width;
    this.h = r.height;
    this.canvas.width = Math.max(1, Math.round(r.width * this.dpr));
    this.canvas.height = Math.max(1, Math.round(r.height * this.dpr));
  }

  private resizeOverlay() {
    const d = Math.min(window.devicePixelRatio || 1, 2);
    this.overlay.width = Math.round(window.innerWidth * d);
    this.overlay.height = Math.round(window.innerHeight * d);
    this.octx.setTransform(d, 0, 0, d, 0, 0);
  }

  private frame = (t: number) => {
    this.raf = requestAnimationFrame(this.frame);
    this.drawAvatar(t / 1000);
    this.drawFlyers(t);
  };

  private drawAvatar(time: number) {
    const { ctx, w, h, dpr } = this;
    if (!w || !h) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";

    // Spin the 3D shapes; turn the flat ones back to face the visitor
    const speed = this.slow ? 0.0015 : this.active ? 0.006 : 0.003;
    const spins = this.shape === "sphere" || this.shape === "orbit";
    if (spins) this.angle += this.shape === "orbit" ? speed * 3 : speed;
    else {
      this.angle = Math.atan2(Math.sin(this.angle), Math.cos(this.angle));
      this.angle *= 0.9;
    }
    const cos = Math.cos(this.angle), sin = Math.sin(this.angle);

    const breathe = 1 + Math.sin(time * 1.6) * 0.025;
    const isWord = this.shape.startsWith("word:");
    const scale = Math.min(w, h) * (isWord ? 0.46 : this.shape === "sphere" ? 0.34 : 0.38) * breathe;
    const cx = w / 2, cy = h / 2;
    const lvl = this.level;
    const morph = this.slow ? 0.04 : 0.075;
    const base = this.active ? 0.9 : 0.6;
    const size = Math.max(1, Math.min(w, h) / 160);

    for (let i = 0; i < this.n; i++) {
      const c = this.cur[i], tg = this.target[i];
      c.x += (tg.x - c.x) * morph;
      c.y += (tg.y - c.y) * morph;
      c.z += (tg.z - c.z) * morph;

      // audio: push particles outwards with a per-particle wobble
      const wob = 1 + lvl * (isWord ? 0.04 : 0.18 + 0.22 * Math.sin(i * 12.9898 + time * 9));
      const x = c.x * wob, y = c.y * wob, z = c.z * wob;

      const rx = x * cos - z * sin;
      const rz = x * sin + z * cos;
      const persp = 1 / (1.9 - rz * 0.6);
      const px = cx + rx * scale * persp * 1.9;
      const py = cy + y * scale * persp * 1.9;

      const k = Math.min(1, Math.max(0, (y + 1) / 2));
      const r = SKY[0] + (VIOLET[0] - SKY[0]) * k;
      const g = SKY[1] + (VIOLET[1] - SKY[1]) * k;
      const b = SKY[2] + (VIOLET[2] - SKY[2]) * k;
      const depth = Math.min(1, Math.max(0.15, (rz + 1.2) / 2.2));
      ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${(base * depth + lvl * 0.25).toFixed(3)})`;
      const s = size * (0.6 + depth);
      ctx.fillRect(px - s / 2, py - s / 2, s, s);
    }
    ctx.globalCompositeOperation = "source-over";
  }

  private drawFlyers(now: number) {
    const o = this.octx;
    o.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (!this.flyers.length) return;
    o.globalCompositeOperation = "lighter";
    o.lineCap = "round";
    this.flyers = this.flyers.filter((f) => {
      const p = (now - f.start) / f.dur;
      if (p < 0) return true;
      if (p > 1.25) return false;
      const e = p >= 1 ? 1 : p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      const u = 1 - e;
      const x = u * u * f.sx + 2 * u * e * f.cx + e * e * f.ex;
      const y = u * u * f.sy + 2 * u * e * f.cy + e * e * f.ey;
      const alpha = p > 1 ? Math.max(0, 1 - (p - 1) * 4) : Math.min(1, p * 4);
      const r = SKY[0] + (VIOLET[0] - SKY[0]) * f.hue;
      const g = SKY[1] + (VIOLET[1] - SKY[1]) * f.hue;
      const b = SKY[2] + (VIOLET[2] - SKY[2]) * f.hue;
      o.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${(alpha * 0.55).toFixed(3)})`;
      o.lineWidth = 1.6;
      o.beginPath();
      o.moveTo(f.px, f.py);
      o.lineTo(x, y);
      o.stroke();
      o.fillStyle = `rgba(224,242,254,${(alpha * 0.9).toFixed(3)})`;
      o.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
      f.px = x;
      f.py = y;
      return true;
    });
    o.globalCompositeOperation = "source-over";
  }
}
