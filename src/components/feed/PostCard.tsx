import { useEffect, useRef, useState } from "react";
import { Post } from "../../types";
import bus from "../../lib/bus";

type XY = { x: number; y: number };

// Inline SVG placeholder (also good for favicon if you want)
const AVATAR_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'>
      <defs>
        <radialGradient id='g' cx='30%' cy='30%' r='80%'>
          <stop offset='0%' stop-color='#d8e1ff'/>
          <stop offset='60%' stop-color='#86a3ff'/>
          <stop offset='100%' stop-color='#2635ff'/>
        </radialGradient>
      </defs>
      <rect width='96' height='96' rx='24' fill='#0b1226'/>
      <circle cx='48' cy='48' r='28' fill='url(#g)'/>
    </svg>`
  );

// tiny inline icons
const Heart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);
const Chat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M21 12a8 8 0 1 1-3.1-6.3L21 5v7z" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);
const Share = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M4 12v7a1 1 0 0 0 1 1h14M12 16l7-7m0 0h-5m5 0v5" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);
const Portal = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
  </svg>
);

export default function PostCard({
  post,
  onPortal,
}: {
  post: Post;
  onPortal: (p: Post, at?: XY) => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Voice “enter world” hover target
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

  function handleEnterWorld() {
    const r = cardRef.current?.getBoundingClientRect();
    const at: XY = r
      ? { x: r.left + r.width - 56, y: r.top + r.height - 56 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    bus.emit("orb:portal", { post, ...at });
  }

  return (
    <article ref={cardRef} className="post-card">
      {/* MEDIA (edge-to-edge, square corners) */}
      <div className={`post-media ${isPortrait ? "tall" : ""}`}>
        <img
          src={post.image}
          alt={post.title}
          onLoad={(e) => {
            const img = e.currentTarget;
            setIsPortrait(img.naturalHeight >= img.naturalWidth * 0.95);
          }}
        />

        {/* TOP FROSTED FRAME (over image) */}
        <div className="head-glass">
          <div className="head-left">
            <div className="pfp">
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
          <div className="title">{post.title || "Prototype moment. Enter the void."}</div>
        </div>
      </div>

      {/* super-thin true background line */}
      <div className="thin-bg-line" />

      {/* BOTTOM FROSTED FRAME (below image) */}
      <footer className="foot-glass">
        <div className="actions-row">
          {/* 1) Profile action (round) */}
          <button className="miniact avatar-act" onClick={() => setMenuOpen((v) => !v)} aria-label="Profile actions">
            <span className="pfp pfp--small">
              <img
                src={"/avatar.jpg"}
                alt=""
                onError={(ev) => {
                  (ev.currentTarget as HTMLImageElement).src = AVATAR_PLACEHOLDER;
                }}
              />
            </span>
            <span>Profile</span>
          </button>

          {/* 2) Engage */}
          <button className="miniact flat">
            <Heart /> <span>Engage</span>
          </button>

          {/* 3) Comment */}
          <button className="miniact flat">
            <Chat /> <span>Comment</span>
          </button>

          {/* 4) Share */}
          <button className="miniact flat">
            <Share /> <span>Share</span>
          </button>

          {/* 5) Enter world */}
          <button className="miniact flat" onClick={handleEnterWorld}>
            <Portal /> <span>Enter world</span>
          </button>
        </div>

        {/* tiny placeholder menu for the avatar action */}
        {menuOpen && (
          <div className="owner-menu" onMouseLeave={() => setMenuOpen(false)}>
            <button className="menu-item">Select…</button>
            <button className="menu-item">View profile</button>
            <button className="menu-item danger" onClick={() => setMenuOpen(false)}>Close</button>
          </div>
        )}
      </footer>
    </article>
  );
}