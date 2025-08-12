import { useEffect, useRef, useState } from "react";
import { Post } from "../../types";

type Props = { post: Post };

// tiny inline fallback avatar (pink orb) for authors
const avatarData =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>
      <defs>
        <radialGradient id='g' cx='30%' cy='30%' r='80%'>
          <stop offset='0%' stop-color='#fff9ff'/>
          <stop offset='55%' stop-color='#ffb3ea'/>
          <stop offset='100%' stop-color='#ff49cf'/>
        </radialGradient>
      </defs>
      <rect width='64' height='64' rx='16' fill='#0f1117'/>
      <circle cx='32' cy='32' r='14' fill='url(#g)'/>
    </svg>`
  );

export default function PostCard({ post }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState<"none" | "profile" | "comments" | "like" | "share" | "save">("none");

  // lazy fade-in when card enters viewport (guard against null)
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoaded(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article ref={cardRef} className="post-card" style={{ opacity: loaded ? 1 : 0.92, transition: "opacity .35s ease" }}>
      {/* Top frosted strip: avatar + meta (mirrors bottom strip) */}
      <header className="post-head" style={{ backdropFilter: "blur(10px) saturate(140%)", background: "rgba(17,19,29,.45)" }}>
        <div className="avatar">
          <img
            src={avatarData}
            alt="author"
            width={36}
            height={36}
            onClick={() => setOpen(open === "profile" ? "none" : "profile")}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="meta">
          <span className="name">{post.author}</span>
          <span className="sub">placeholder • 2h • #superNova</span>
        </div>
      </header>

      {/* The media (full-bleed, square-ish) */}
      <div className="post-media">
        <img src={post.image} alt={post.title} loading="lazy" />
      </div>

      {/* tiny separator that lets the real background peek through */}
      <div style={{ height: 6, background: "transparent" }} />

      {/* Bottom frosted strip: 5 icon actions (left-most = profile avatar) */}
      <footer
        className="post-engage"
        style={{
          backdropFilter: "blur(10px) saturate(140%)",
          background: "rgba(17,19,29,.45)",
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0,1fr))",
          gap: 10,
        }}
      >
        {/* 1) profile (same avatar; opens profile drawer) */}
        <button className="pill" onClick={() => setOpen(open === "profile" ? "none" : "profile")} title="Profile">
          <img src={avatarData} width={18} height={18} style={{ borderRadius: 999 }} alt="" />
          <span>Profile</span>
        </button>

        {/* 2) like */}
        <button className="pill" onClick={() => setOpen(open === "like" ? "none" : "like")} title="Engage">
          ❤️ <span>Engage</span>
        </button>

        {/* 3) comment */}
        <button className="pill" onClick={() => setOpen(open === "comments" ? "none" : "comments")} title="Comment">
          💬 <span>Comment</span>
        </button>

        {/* 4) share/remix */}
        <button className="pill" onClick={() => setOpen(open === "share" ? "none" : "share")} title="Share">
          🔁 <span>Share</span>
        </button>

        {/* 5) save */}
        <button className="pill" onClick={() => setOpen(open === "save" ? "none" : "save")} title="Save">
          📎 <span>Save</span>
        </button>
      </footer>

      {/* drawers (expand under the card when an action is active) */}
      {open !== "none" && (
        <div
          className="post-body"
          style={{
            background: "rgba(18,22,35,.55)",
            backdropFilter: "blur(14px) saturate(150%)",
            borderTop: "1px solid rgba(255,255,255,.06)",
          }}
        >
          {open === "profile" && (
            <div>
              <strong>{post.author}</strong>
              <div style={{ opacity: 0.75, fontSize: 13, marginTop: 4 }}>
                Company • Role • Tags • Actions (Follow / Message)
              </div>
            </div>
          )}
          {open === "like" && <div>Pick an emotion: 🤗 🤩 🔥 🙌 💎 ✨</div>}
          {open === "comments" && (
            <div>
              <div style={{ marginBottom: 8, opacity: 0.85 }}>Comments</div>
              <input
                placeholder="Write a comment…"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #202637",
                  background: "#0c0f19",
                  color: "#e9ecf1",
                }}
              />
              <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
                Emoji: 🤗 🤝 🫶 😎 🎉 🌟 🚀 💡 🧠 🪐
              </div>
            </div>
          )}
          {open === "share" && <div>Remix / Repost / Copy link / Send to…</div>}
          {open === "save" && <div>Save to collection • Create new…</div>}
        </div>
      )}
    </article>
  );
}