import { useEffect, useRef, useState } from "react";
import { Post } from "../../types";
import bus from "../../lib/bus";

type XY = { x: number; y: number };
type Panel = "none" | "profile" | "react" | "comment" | "share" | "portal";

// Inline SVG avatar (also good as favicon placeholder)
const AVATAR_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'>
      <defs>
        <radialGradient id='g' cx='30%' cy='30%' r='80%'>
          <stop offset='0%' stop-color='#e7e9ff'/>
          <stop offset='60%' stop-color='#8aa2ff'/>
          <stop offset='100%' stop-color='#2736ff'/>
        </radialGradient>
      </defs>
      <rect width='96' height='96' rx='24' fill='#0b1226'/>
      <circle cx='48' cy='48' r='28' fill='url(#g)'/>
    </svg>`
  );

// stroke icons (subtle, modern)
const Heart = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const Chat = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M21 12a8 8 0 1 1-3.1-6.3L21 5v7z" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);
const Share = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M4 12v7a1 1 0 0 0 1 1h14M12 16l7-7m0 0h-5m5 0v5" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);
const PortalIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
  </svg>
);

// tiny seeded helpers (deterministic canvases)
function seeded(n: number) { let x = Math.sin(n * 7.77) * 10000; return x - Math.floor(x); }

export default function PostCard({
  post,
  onPortal,
}: {
  post: Post;
  onPortal: (p: Post, at?: XY) => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const mediaBoxRef = useRef<HTMLDivElement | null>(null);
  const procRef = useRef<HTMLCanvasElement | null>(null);
  const modelRef = useRef<HTMLCanvasElement | null>(null);
  const animId = useRef<number | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [panel, setPanel] = useState<Panel>("none");
  const [inView, setInView] = useState(false);

  // type of media
  const kind: "image" | "proc" | "model" = post.image?.startsWith("proc:")
    ? "proc"
    : post.image?.startsWith("model:")
    ? "model"
    : "image";

  // let voice “enter world” know the last hovered card
  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    const onEnter = () => {
      const r = node.getBoundingClientRect();
      bus.emit("feed:hover", {
        post,
        x: r.left + r.width * 0.82,
        y: r.top + r.height * 0.62,
      });
    };
    node.addEventListener("pointerenter", onEnter);
    return () => node.removeEventListener("pointerenter", onEnter);
  }, [post]);

  // click-away to close drawers
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const root = cardRef.current;
      if (!root) return;
      if (!root.contains(e.target as Node)) setPanel("none");
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  // intersection observer to pause canvases when offscreen
  useEffect(() => {
    const el = mediaBoxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setInView(e.isIntersecting);
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function handleEnterWorld() {
    const r = cardRef.current?.getBoundingClientRect();
    const at: XY = r
      ? { x: r.left + r.width - 56, y: r.top + r.height - 56 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    bus.emit("orb:portal", { post, ...at });
  }

  // Procedural abstract canvas
  useEffect(() => {
    if (kind !== "proc") return;
    const c = procRef.current;
    if (!c) return;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const parent = c.parentElement as HTMLElement | null;
    const w = (parent?.clientWidth ?? 800);
    const h = Math.floor((post as any)?.h || w * 0.56);
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    c.style.width = w + "px";
    c.style.height = h + "px";
    const g = c.getContext("2d"); if (!g) return;

    const s = (post.id ?? 1) * 13;
    const hue = Math.floor(seeded(s) * 360);
    const hue2 = (hue + 200) % 360;

    const grd = g.createLinearGradient(0, 0, c.width, c.height);
    grd.addColorStop(0, `hsl(${hue},70%,22%)`);
    grd.addColorStop(1, `hsl(${hue2},70%,14%)`);
    g.fillStyle = grd;
    g.fillRect(0, 0, c.width, c.height);

    for (let i = 0; i < 8; i++) {
      const rr = (0.15 + seeded(s + i) * 0.25) * Math.min(c.width, c.height);
      const x = seeded(s + i * 3.1) * c.width;
      const y = seeded(s + i * 7.7) * c.height;
      const rgr = g.createRadialGradient(x, y, 1, x, y, rr);
      const h2 = Math.floor((hue + i * 22) % 360);
      rgr.addColorStop(0, `hsla(${h2},80%,60%,.35)`);
      rgr.addColorStop(1, `hsla(${h2},80%,60%,0)`);
      g.fillStyle = rgr;
      g.beginPath(); g.arc(x, y, rr, 0, Math.PI * 2); g.fill();
    }
  }, [kind, post]);

  // Lightweight “low-poly tree” canvas (animates only in view)
  useEffect(() => {
    if (kind !== "model") return;
    const c = modelRef.current;
    if (!c) return;
    const parent = c.parentElement as HTMLElement | null;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const w = (parent?.clientWidth ?? 800);
    const h = Math.floor(w * 0.56);
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    c.style.width = w + "px";
    c.style.height = h + "px";
    const g = c.getContext("2d"); if (!g) return;

    const cx = c.width / 2, cy = c.height * 0.7;
    const fov = 480 * dpr;
    const proj = (x: number, y: number, z: number) => {
      const s = fov / (fov + z);
      return { x: cx + x * s, y: cy - y * s, s };
    };

    let t0 = performance.now();
    const draw = (t: number) => {
      const dt = (t - t0) / 1000; t0 = t; (void)dt; // keep for future physics
      if (!inView) { animId.current = requestAnimationFrame(draw); return; }

      const rot = (t * 0.0006) % (Math.PI * 2);
      g.clearRect(0, 0, c.width, c.height);
      g.fillStyle = "rgba(25,28,40,.9)"; g.fillRect(0, cy, c.width, c.height - cy);

      // trunk
      for (let i = 0; i < 14; i++) {
        const y = 10 * i;
        const p1 = proj(-6, y, 40), p2 = proj(6, y, 40), p3 = proj(6, y + 10, 40), p4 = proj(-6, y + 10, 40);
        g.fillStyle = "rgba(120,78,40,.9)";
        g.beginPath(); g.moveTo(p1.x, p1.y); g.lineTo(p2.x, p2.y); g.lineTo(p3.x, p3.y); g.lineTo(p4.x, p4.y); g.closePath(); g.fill();
      }

      const cones = [
        { baseY: 120, r: 60, h: 70, hue: 150 },
        { baseY: 80, r: 44, h: 55, hue: 160 },
        { baseY: 42, r: 28, h: 45, hue: 170 },
      ];
      for (const cone of cones) {
        const seg = 20;
        for (let i = 0; i < seg; i++) {
          const a1 = rot + (i / seg) * Math.PI * 2;
          const a2 = rot + ((i + 1) / seg) * Math.PI * 2;
          const x1 = Math.cos(a1) * cone.r, z1 = Math.sin(a1) * cone.r;
          const x2 = Math.cos(a2) * cone.r, z2 = Math.sin(a2) * cone.r;
          const apex = proj(0, cone.baseY + cone.h, 0);
          const p1 = proj(x1, cone.baseY, z1), p2 = proj(x2, cone.baseY, z2);
          const light = Math.max(0.25, 0.5 + Math.cos(a1) * 0.45);
          const col = `hsla(${cone.hue},60%,${40 + light * 20}%,.95)`;
          g.fillStyle = col;
          g.beginPath(); g.moveTo(apex.x, apex.y); g.lineTo(p1.x, p1.y); g.lineTo(p2.x, p2.y); g.closePath(); g.fill();
        }
      }
      animId.current = requestAnimationFrame(draw);
    };
    animId.current = requestAnimationFrame(draw);
    return () => { if (animId.current) cancelAnimationFrame(animId.current); };
  }, [kind, inView]);

  // emoji board (starts with 🤗)
  const EMOJI = "🤗😊😍🔥✨👍👏😮😢😂🤣😅🥹💖💜💙💛🧡💚🤍🤎❤️‍🔥😎🤩🙌💫🫶🤝🙏🌟🌈🎉🎊🎵🪩🧠🚀🛰️🌌🌀🧩🖼️🧪💡⚡️🌊🏞️🌿🍃🌸⭐️☀️🌙"
    .split("");

  const toggle = (p: Panel) => setPanel(panel === p ? "none" : p);

  return (
    <article ref={cardRef} className="post-card">
      {/* hairline ABOVE media */}
      <div className="thin-bg-line" />

      {/* MEDIA */}
      <div ref={mediaBoxRef} className={`post-media ${isPortrait ? "tall" : ""}`}>
        {kind === "image" && (
          <img
            src={post.image}
            alt={post.title}
            onLoad={(e) => {
              const img = e.currentTarget;
              setIsPortrait(img.naturalHeight >= img.naturalWidth * 0.95);
            }}
          />
        )}
        {kind === "proc" && <canvas ref={procRef} aria-label="Abstract artwork" />}
        {kind === "model" && <canvas ref={modelRef} aria-label="Low-poly tree" />}

        {/* TOP FROST (small, top-left) */}
        <div className="head-glass">
          <div className="head-left">
            <div className="pfp pfp--small">
              <img
                src={"/avatar.jpg"}
                alt=""
                onError={(ev) => {
                  (ev.currentTarget as HTMLImageElement).src = AVATAR_PLACEHOLDER;
                }}
              />
            </div>
            <div className="meta">
              <div className="handle">{post.author || "@me"}</div>
              <div className="sub">now • superNova_2177</div>
            </div>
          </div>
          <div className="title">{post.title || "Prototype moment."}</div>
        </div>
      </div>

      {/* hairline BELOW media */}
      <div className="thin-bg-line" />

      {/* BOTTOM FROST with drawers */}
      <footer className={`foot-glass ${panel !== "none" ? "has-drawer" : ""}`}>
        <div className="actions-row">
          <button className="miniact avatar-act" aria-label="Profile" onClick={() => toggle("profile")}>
            <span className="pfp pfp--tiny">
              <img
                src={"/avatar.jpg"}
                alt=""
                onError={(ev) => {
                  (ev.currentTarget as HTMLImageElement).src = AVATAR_PLACEHOLDER;
                }}
              />
            </span>
            <span className="sr-only">Profile</span>
          </button>
          <button className="miniact flat" aria-label="Engage" onClick={() => toggle("react")}><Heart /></button>
          <button className="miniact flat" aria-label="Comment" onClick={() => toggle("comment")}><Chat /></button>
          <button className="miniact flat" aria-label="Share" onClick={() => toggle("share")}><Share /></button>
          <button className="miniact flat" aria-label="Enter world" onClick={() => toggle("portal")}><PortalIcon /></button>
        </div>

        {/* Drawer (slides down) */}
        <div className={`drawer ${panel !== "none" ? "open" : ""}`}>
          {panel === "profile" && (
            <div className="menu-line">
              <button className="chip">Select…</button>
              <button className="chip">View profile</button>
              <button className="chip">Message</button>
              <button className="chip danger" onClick={() => setPanel("none")}>Close</button>
            </div>
          )}

          {panel === "react" && (
            <div className="emoji-grid" role="listbox" aria-label="Reactions">
              {EMOJI.map((e, i) => (
                <button key={i} className="emoji" aria-label={`react ${e}`} onClick={() => setPanel("none")}>
                  {e}
                </button>
              ))}
            </div>
          )}

          {panel === "comment" && (
            <div className="comment-row">
              <input className="comment-input" placeholder="Write a comment…" />
              <button className="send">Send</button>
            </div>
          )}

          {panel === "share" && (
            <div className="menu-line">
              <button className="chip">Remix</button>
              <button
                className="chip"
                onClick={() => {
                  try {
                    navigator.clipboard?.writeText(location.href);
                  } catch {}
                }}
              >
                Copy link
              </button>
              <button className="chip">Repost</button>
              <button className="chip danger" onClick={() => setPanel("none")}>Close</button>
            </div>
          )}

          {panel === "portal" && (
            <div className="portal-line">
              <button className="enter-btn" onClick={handleEnterWorld}>Enter world</button>
            </div>
          )}
        </div>
      </footer>
    </article>
  );
}