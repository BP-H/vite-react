import { useState } from "react";
import { Post } from "../../types";

const fallbackImg =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop";

const avatarSVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'>
      <defs>
        <radialGradient id='g' cx='30%' cy='30%' r='80%'>
          <stop offset='0%' stop-color='#ffffff'/>
          <stop offset='60%' stop-color='#c7d2fe'/>
          <stop offset='100%' stop-color='#7c83ff'/>
        </radialGradient>
      </defs>
      <rect width='80' height='80' rx='40' fill='#0f1117'/>
      <circle cx='40' cy='40' r='26' fill='url(#g)'/>
    </svg>`
  );

export default function PostCard({ post, onPortal }: { post: Post; onPortal?: (p: Post, at?: { x: number; y: number }) => void }) {
  const [open, setOpen] = useState(false);

  const author = post.author || "@proto_ai";
  const title = post.title || "Study";
  const when = "now";
  const space = post.space || "superNova_2177";
  const image = post.image || fallbackImg;

  return (
    <article className={`pc ${open ? "dopen" : ""}`} aria-label={`Post by ${author}`}>
      {/* media */}
      <div className="pc-media">
        <img src={image} alt={title} loading="lazy" onError={(e) => ((e.currentTarget.src = fallbackImg))} />
        {/* top frosted bar */}
        <div className="pc-topbar">
          <div className="pc-ava"><img src={post.avatar || avatarSVG} alt="" /></div>
          <div className="pc-meta">
            <div className="pc-handle">{author}</div>
            <div className="pc-sub">{when} • {space}</div>
          </div>
          <div className="pc-title">{title}</div>
        </div>

        {/* bottom frosted bar with 5 actions */}
        <div className="pc-botbar">
          <div className="pc-actions">
            <button className="pc-act profile" onClick={() => setOpen((v) => !v)} aria-label="Profile actions">
              <span className="ico" />
              <span>Profile</span>
            </button>
            <button className="pc-act" onClick={() => setOpen((v) => !v)} aria-label="Engage">
              <span className="ico heart" />
              <span>Engage</span>
            </button>
            <button className="pc-act" onClick={() => setOpen((v) => !v)} aria-label="Comment">
              <span className="ico comment" />
              <span>Comment</span>
            </button>
            <button className="pc-act" onClick={() => setOpen((v) => !v)} aria-label="Share / Remix">
              <span className="ico share" />
              <span>Share</span>
            </button>
            <button
              className="pc-act"
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                onPortal?.(post, { x: rect.left + rect.width / 2, y: rect.top });
              }}
              aria-label="Enter world"
            >
              <span className="ico world" />
              <span>Enter</span>
            </button>
          </div>
        </div>
      </div>

      {/* expanding drawer */}
      <div className="pc-drawer">
        {/* Simple content: replace with your emoji keyboard / comment box later */}
        <div style={{ padding: 12, display: "grid", gap: 10 }}>
          <input
            placeholder="Write a comment…"
            style={{
              height: 40,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,.14)",
              background: "rgba(20,22,32,.65)",
              color: "#fff",
              padding: "0 12px",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["🤗","🔥","💜","✨","🚀","🌌","🧠","💡","🎯","❤️‍🔥","🎉","👏","😎","🫶","💬","🔁"].map((e, i) => (
              <button
                key={i}
                style={{
                  height: 34, padding: "0 10px", borderRadius: 999,
                  border: "1px solid rgba(255,255,255,.14)",
                  background: "rgba(17,20,35,.6)", color: "#fff", cursor: "pointer"
                }}
              >{e}</button>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
