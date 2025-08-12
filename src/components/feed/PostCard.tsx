import { useEffect, useMemo, useRef, useState } from "react";
import "./postcard.css";
import bus from "../../lib/bus";
import { Post } from "../../types";

type XPost = Post & {
  avatar?: string;
  time?: string;        // e.g. "2h"
  tag?: string;         // e.g. "#superNova"
  kind?: "image" | "abstract" | "tree";
};

export default function PostCard({
  post,
  onPortal,
}: {
  post: XPost;
  onPortal: (p: Post, at?: { x: number; y: number }) => void;
}) {
  const [open, setOpen] = useState<"" | "profile" | "engage" | "comment" | "share">("");
  const cardRef = useRef<HTMLDivElement | null>(null);

  // nice inline placeholder avatar
  const avatarSRC = useMemo(
    () =>
      post.avatar ||
      "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>
            <defs><radialGradient id='g' cx='30%' cy='30%' r='80%'>
              <stop offset='0%' stop-color='#fff9ff'/><stop offset='55%' stop-color='#ffb3ea'/><stop offset='100%' stop-color='#ff49cf'/>
            </radialGradient></defs>
            <rect width='64' height='64' rx='16' fill='#0f1117'/>
            <circle cx='32' cy='32' r='14' fill='url(#g)'/>
          </svg>`
        ),
    [post.avatar]
  );

  // small helpers
  const Icon = {
    profile: (
      <svg viewBox="0 0 24 24" className="i" aria-hidden><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"/></svg>
    ),
    heart: (
      <svg viewBox="0 0 24 24" className="i" aria-hidden><path d="M12 21s-7.19-4.35-9.33-8.22A5.67 5.67 0 0 1 12 6.31a5.67 5.67 0 0 1 9.33 6.47C19.19 16.65 12 21 12 21Z"/></svg>
    ),
    chat: (
      <svg viewBox="0 0 24 24" className="i" aria-hidden><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/></svg>
    ),
    share: (
      <svg viewBox="0 0 24 24" className="i" aria-hidden><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14"/></svg>
    ),
    spiral: (
      <svg viewBox="0 0 24 24" className="i" aria-hidden><path d="M12 4a8 8 0 1 0 8 8 3 3 0 0 0-6 0 6 6 0 1 1-6-6 9 9 0 1 0 9 9"/></svg>
    ),
  };

  // click handlers
  function toggle(which: typeof open) {
    setOpen((cur) => (cur === which ? "" : (which as any)));
  }
  function portalFromButton(e: React.MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const at = { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
    bus.emit("orb:portal", { post, x: at.x, y: at.y });
    // AssistantOrb will call onPortal after flying; still call here as a fallback:
    setTimeout(() => onPortal(post, at), 650);
  }

  // ---------- media kinds ----------
  useEffect(() => {
    if (post.kind === "abstract" || post.kind === "tree") {
      const c = cardRef.current?.querySelector("canvas") as HTMLCanvasElement | null;
      if (!c) return;
      const ctx = c.getContext("2d")!;
      const { width, height } = c;
      if (post.kind === "abstract") {
        // soft bokeh blobs
        ctx.clearRect(0, 0, width, height);
        const dots = 8;
        for (let i = 0; i < dots; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const r = 40 + Math.random() * 120;
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, `hsla(${Math.random() * 360},80%,70%,.6)`);
          g.addColorStop(1, "hsla(0,0%,0%,0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }
      } else {
        // tiny low-poly tree
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#0b0d12"; ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#0f8a2e";
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(width / 2, height * (0.15 + i * 0.18));
          ctx.lineTo(width * (0.15 + i * 0.1), height * (0.38 + i * 0.18));
          ctx.lineTo(width * (0.85 - i * 0.1), height * (0.38 + i * 0.18));
          ctx.closePath(); ctx.fill();
        }
        ctx.fillStyle = "#744f2a";
        ctx.fillRect(width / 2 - 10, height * 0.65, 20, height * 0.25);
      }
    }
  }, [post.kind]);

  // render media
  function renderMedia() {
    if (post.kind === "abstract" || post.kind === "tree") {
      return <canvas className="pcard__media" width={1200} height={1600} />;
    }
    return (
      <img
        className="pcard__media"
        src={post.image}
        alt={post.title}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.background =
            "linear-gradient(135deg,#1b2336,#101522)";
        }}
      />
    );
  }

  return (
    <article className={`pcard ${open ? "open" : ""}`} ref={cardRef}>
      {/* MEDIA */}
      {renderMedia()}

      {/* TOP FROST BAR (no gap; sits on image) */}
      <div className="pcard__top glass">
        <img className="pcard__av" src={avatarSRC} alt="avatar" />
        <div className="pcard__meta">
          <div className="pcard__name">{post.author || "@proto_ai"}</div>
          <div className="pcard__sub">{post.time || "now"} · {post.tag || "superNova_2177"}</div>
        </div>
        <div className="pcard__title">{post.title}</div>
      </div>

      {/* BOTTOM FROST BAR (icons only) */}
      <div className="pcard__bottom glass">
        <button className={`pcard__btn ${open === "profile" ? "on" : ""}`} aria-label="Profile" onClick={() => toggle("profile")}>
          {Icon.profile}
        </button>
        <button className={`pcard__btn ${open === "engage" ? "on" : ""}`} aria-label="Engage" onClick={() => toggle("engage")}>
          {Icon.heart}
        </button>
        <button className={`pcard__btn ${open === "comment" ? "on" : ""}`} aria-label="Comment" onClick={() => toggle("comment")}>
          {Icon.chat}
        </button>
        <button className={`pcard__btn ${open === "share" ? "on" : ""}`} aria-label="Share" onClick={() => toggle("share")}>
          {Icon.share}
        </button>
        <button className="pcard__btn world" aria-label="Enter world" onClick={portalFromButton}>
          {Icon.spiral}
        </button>
      </div>

      {/* DRAWER (slides under the image) */}
      <div className={`pcard__drawer ${open ? "on" : ""}`}>
        {open === "profile" && (
          <div className="drawer__section">
            <div className="drawer__chips">
              <button className="chip">View profile</button>
              <button className="chip">Follow</button>
              <button className="chip">Message</button>
              <button className="chip">Company A</button>
              <button className="chip">Company B</button>
            </div>
          </div>
        )}
        {open === "engage" && (
          <div className="drawer__section">
            <div className="drawer__emoji">
              {/* starts with 🤗 (hug) */}
              {["🤗","❤️","🔥","👏","😍","😂","😮","😢","👍","👎","✨","🫡","🤯","🙌","🥹","🤝","💎","🌀","🦾","🧠"].map((e,i)=>(
                <button key={i} className="em">{e}</button>
              ))}
            </div>
          </div>
        )}
        {open === "comment" && (
          <div className="drawer__section">
            <input className="drawer__input" placeholder="Write a comment…" />
            <button className="chip">Send</button>
          </div>
        )}
        {open === "share" && (
          <div className="drawer__section">
            <div className="drawer__chips">
              <button className="chip">Remix</button>
              <button className="chip">Copy link</button>
              <button className="chip">Embed</button>
              <button className="chip">Share to…</button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}