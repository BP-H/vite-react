import { useEffect, useRef, useState } from "react";
import { Post } from "../../types";
import bus from "../../lib/bus";

type XY = { x: number; y: number };

// tiny inline placeholder (also nice for favicon)
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

// simple inline icons (keeps bundle tiny)
const Heart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const Chat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M21 12a8 8 0 1 1-3.1-6.3L21 5v7z" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const Share = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M4 12v7a1 1 0 0 0 1 1h14M12 16l7-7m0 0h-5m5 0v5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const Portal = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
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
  const [showEngage, setShowEngage] = useState(false);

  // hover target for voice “enter world”
  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const onEnter = () => {
      const r = node.getBoundingClientRect();
      bus.emit("feed:hover", {
        post,
        x: r.left + r.width * 0.82,
        y: r.top + r.height * 0.6,
      });
    };

    node.addEventListener("pointerenter", onEnter);
    return () => {
      if (node) node.removeEventListener("pointerenter", onEnter);
    };
  }, [post]);

  function handleEnterWorld() {
    const node = cardRef.current;
    const r = node?.getBoundingClientRect();
    const at: XY = r
      ? { x: r.left + r.width - 56, y: r.top + r.height - 56 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    bus.emit("orb:portal", { post, ...at });
    // if you prefer bypassing bus: onPortal(post, at);
  }

  return (
    <article ref={cardRef} className="post-card overlay-style">
      {/* Media with overlays */}
      <div className={`post-media ${isPortrait ? "tall" : ""}`}>
        <img
          src={post.image}
          alt={post.title}
          onLoad={(e) => {
            const img = e.currentTarget;
            setIsPortrait(img.naturalHeight >= img.naturalWidth * 0.95);
          }}
        />

        {/* top-left circular badge like your sketch */}
        <div className="post-user">
          <div className="badge">
            <img
              src={"/avatar.jpg"}
              onError={(ev) => {
                (ev.currentTarget as HTMLImageElement).src = AVATAR_PLACEHOLDER;
              }}
              alt=""
            />
          </div>
          <span className="who">{post.author || "me"}</span>
        </div>

        {/* subtle corner orb for vibe */}
        <div className="corner-orb" />
      </div>

      {/* title/caption on frosted glass strip */}
      <div className="post-caption">
        <h3>{post.title}</h3>
      </div>

      {/* Actions with faint frosted separators above and below */}
      <footer className={`post-actions ${showEngage ? "open" : ""}`}>
        <div className="actions-row">
          <button className="miniact" onClick={() => setShowEngage((v) => !v)}>
            <Heart /> <span>Engage</span>
          </button>
          <button className="miniact">
            <Chat /> <span>Comment</span>
          </button>
          <button className="miniact">
            <Share /> <span>Share</span>
          </button>
          <button className="miniact" onClick={handleEnterWorld}>
            <Portal /> <span>Enter world</span>
          </button>
        </div>

        {/* tray pops under actions when Engage toggled */}
        <div className="engage-tray">
          <button className="chip">Thanks for sharing</button>
          <button className="chip">Love this</button>
          <button className="chip">🔥 Trendy</button>
          <button className="chip">Save</button>
          <button className="chip">Bookmark</button>
        </div>
      </footer>
    </article>
  );
}