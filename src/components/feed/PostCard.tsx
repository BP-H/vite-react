import { useEffect, useRef, useState } from "react";
import { Post } from "../../types";
import bus from "../../lib/bus";

type XY = { x: number; y: number };

export default function PostCard({
  post,
  onPortal,
}: {
  post: Post;
  onPortal: (p: Post, at?: XY) => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tall, setTall] = useState(false);

  // Keep hover target for voice "enter world"
  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const onEnter = () => {
      const r = node.getBoundingClientRect();
      bus.emit("feed:hover", {
        post,
        x: r.left + r.width * 0.8,
        y: r.top + r.height * 0.5,
      });
    };

    node.addEventListener("pointerenter", onEnter);
    return () => {
      // Guard again for strict builds
      if (node) node.removeEventListener("pointerenter", onEnter);
    };
  }, [post]);

  function handleEnterWorld() {
    const node = cardRef.current;
    const r = node?.getBoundingClientRect();
    const at: XY = r
      ? { x: r.left + r.width - 56, y: r.top + r.height - 56 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // Fire the nice fly animation + portal
    bus.emit("orb:portal", { post, ...at });
    // (Shell listens and calls onPortal already via the orb event)
    // If you want to bypass the bus, uncomment:
    // onPortal(post, at);
  }

  return (
    <article ref={cardRef} className="post-card">
      <header className="post-head">
        <div className="avatar">
          <img
            src="/avatar.jpg"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="meta">
          <span className="name">{post.author}</span>
          <span className="sub">now • superNova_2177</span>
        </div>
      </header>

      <div className={`post-media ${tall ? "tall" : ""}`}>
        <img
          src={post.image}
          alt={post.title}
          onLoad={(e) => {
            const img = e.currentTarget;
            // Treat portrait as IG-style tall media
            setTall(img.naturalHeight >= img.naturalWidth);
          }}
        />
      </div>

      <div className="post-body">
        <strong>{post.title}</strong>
      </div>

      <div className="post-engage">
        <button className="pill">❤️ Like</button>
        <button className="pill">💬 Comment</button>
        <button className="pill">🔁 Share</button>
        <div style={{ flex: 1 }} />
        <button className="pill" onClick={handleEnterWorld}>
          🌀 Enter world
        </button>
      </div>

      {/* LinkedIn-style composer under the post */}
      <div className="post-composer">
        <img className="me" src="/avatar.jpg" alt="me" />
        <div className="chips">
          <button className="chip">Thanks for sharing</button>
          <button className="chip">Love this</button>
          <button className="chip">Comment</button>
          <button className="chip">Repost</button>
          <button className="chip">Send</button>
        </div>
      </div>
    </article>
  );
}