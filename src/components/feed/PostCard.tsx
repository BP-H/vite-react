import { useEffect, useRef, useState } from "react";
import { Post } from "../../types";
import bus from "../../lib/bus";

export default function PostCard({ post, onPortal }: { post: Post; onPortal: (p: Post, at?: {x:number;y:number}) => void }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tall, setTall] = useState(false);

  // keep hover target for voice "enter world"
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    function onEnter() {
      const r = el.getBoundingClientRect();
      bus.emit("feed:hover", { post, x: r.left + r.width * 0.8, y: r.top + r.height * 0.5 });
    }
    el.addEventListener("pointerenter", onEnter);
    return () => el.removeEventListener("pointerenter", onEnter);
  }, [post]);

  function handleEnterWorld() {
    const el = cardRef.current;
    const r = el?.getBoundingClientRect();
    const at = r ? { x: r.left + r.width - 56, y: r.top + r.height - 56 } : { x: window.innerWidth/2, y: window.innerHeight/2 };
    bus.emit("orb:portal", { post, ...at });
  }

  return (
    <article ref={cardRef} className="post-card">
      <header className="post-head">
        <div className="avatar"><img src="/avatar.jpg" alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} /></div>
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
        <button className="pill" onClick={handleEnterWorld}>🌀 Enter world</button>
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