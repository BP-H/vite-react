import { useMemo, useRef, useState } from "react";
import bus from "../../lib/bus";
import { Post } from "../../types";

/** inline avatar placeholder (used when no avatar is available) */
const AVATAR_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
  <defs>
    <radialGradient id='g' cx='35%' cy='30%' r='80%'>
      <stop offset='0%' stop-color='#ffffff'/>
      <stop offset='55%' stop-color='#ffd6f4'/>
      <stop offset='100%' stop-color='#ff74de'/>
    </radialGradient>
  </defs>
  <rect width='96' height='96' rx='24' fill='#0f1117'/>
  <circle cx='48' cy='48' r='28' fill='url(#g)'/>
</svg>`);

/** minimal icons (kept inline to avoid deps) */
const ICON = {
  heart: (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 21s-7.5-4.6-9.6-8.2C.7 10 .9 6.9 3.2 5.2 5.6 3.5 8.3 4.1 10 6c1.7-1.9 4.4-2.5 6.8-.8 2.3 1.7 2.5 4.8.8 7C19.5 16.4 12 21 12 21z"
        fill="currentColor"
      />
    </svg>
  ),
  comment: (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M20 15a3 3 0 0 1-3 3H9l-4 3V6a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9z"
        fill="currentColor"
      />
    </svg>
  ),
  share: (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M18 8a3 3 0 1 0-2.9-3.6L8.9 7.4a3 3 0 1 0 0 5.2l6.2 3a3 3 0 1 0 1-1.8l-6.1-3a3 3 0 0 0 0-1.6l6.2-3A3 3 0 0 0 18 8z"
        fill="currentColor"
      />
    </svg>
  ),
  spiral: (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7v2a5 5 0 1 0 5 5h2A7 7 0 1 1 12 5V3z"
        fill="currentColor"
      />
    </svg>
  ),
  dot: (
    <svg width="6" height="6" viewBox="0 0 6 6" aria-hidden>
      <circle cx="3" cy="3" r="3" fill="currentColor" />
    </svg>
  ),
};

type Drawer = null | "profile" | "engage" | "comment" | "share";

export default function PostCard({ post }: { post: Post }) {
  const elRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Drawer>(null);

  const avatar = useMemo(() => AVATAR_SVG, []);
  const title = post.title || "Prototype moment.";
  const handle = post.author || "@proto_ai";

  const toggle = (d: Drawer) => setOpen((p) => (p === d ? null : d));

  const enterWorld = () => {
    const r = elRef.current?.getBoundingClientRect();
    const x = r ? r.right - 44 : window.innerWidth - 56;
    const y = r ? r.bottom - 44 : window.innerHeight - 56;
    bus.emit("orb:portal", { post, x, y });
  };

  return (
    <article ref={elRef} className="post-card edge">
      {/* TOP FROSTED STRIP */}
      <div className="post-top glass">
        <img className="post-top__avatar" src={avatar} alt="" />
        <div className="post-top__meta">
          <div className="post-top__line">
            <strong className="post-top__handle">{handle}</strong>
            <span className="post-top__dot" aria-hidden>{ICON.dot}</span>
            <span className="post-top__time">now</span>
            <span className="post-top__dot" aria-hidden>{ICON.dot}</span>
            <span className="post-top__space">superNova_2177</span>
          </div>
          <div className="post-top__title">{title}</div>
        </div>
      </div>

      {/* MEDIA */}
      <div className="post-media">
        {post.image ? (
          <img src={post.image} alt={title} />
        ) : (
          <div className="post-media__fallback" />
        )}
      </div>

      {/* THIN GAP (background peeks through) */}
      <div className="post-gap" aria-hidden />

      {/* BOTTOM FROSTED STRIP (5 items) */}
      <div className="post-bot glass">
        <button className="icon-btn avatar-btn" onClick={() => toggle("profile")} aria-label="Profile actions">
          <img className="post-bot__avatar" src={avatar} alt="" />
        </button>
        <button className={`icon-btn ${open === "engage" ? "on" : ""}`} onClick={() => toggle("engage")} title="Engage">
          {ICON.heart}<span>Engage</span>
        </button>
        <button className={`icon-btn ${open === "comment" ? "on" : ""}`} onClick={() => toggle("comment")} title="Comment">
          {ICON.comment}<span>Comment</span>
        </button>
        <button className={`icon-btn ${open === "share" ? "on" : ""}`} onClick={() => toggle("share")} title="Share">
          {ICON.share}<span>Share</span>
        </button>
        <button className="icon-btn enter" onClick={enterWorld} title="Enter world">
          {ICON.spiral}<span>Enter</span>
        </button>
      </div>

      {/* DRAWER */}
      <div className={`post-drawer ${open ? "open" : ""}`}>
        {open === "profile" && <ProfileDrawer />}
        {open === "engage" && <EngageDrawer />}
        {open === "comment" && <CommentDrawer />}
        {open === "share" && <ShareDrawer />}
      </div>
    </article>
  );
}

/* ---------- Drawers ---------- */

function ProfileDrawer() {
  return (
    <div className="drawer glass">
      <div className="drawer-row">
        <button className="chip">View profile</button>
        <button className="chip">Message</button>
        <button className="chip">Follow</button>
      </div>
      <div className="drawer-sub">Switch identity</div>
      <div className="drawer-row">
        <button className="chip">me</button>
        <button className="chip">@superNova_2177</button>
        <button className="chip">@test_tech</button>
      </div>
    </div>
  );
}

/** Keep this as two simple lines so TS never chokes on a leading '.' */
const EMOJI_STR =
  "🤗😍🔥✨👍💜💙💚👏🙌🤩🥳🎉😁😎🤍🖤🤝💡🧠🫶🤔😮😭🥰😇😴😅🤤🫡🤯😱😌😤😏😆😄😊😉😃🙂🤓🤖👾🦄🌈⭐️⚡️🌟🌸🌺🌼🍀🍃🍁🍂🍇🍉🍒🍩🍪🍫🍿🍭☕️🍵🍔🍕🍟🌮🌯🍣🍙🍜🍝🥗🥐🥞🥓🥩🍗🍳🥚🧇🍰🧁🍨🍦🍷🍸🍹🍺🥂🎨🎧🎮🎲🎯🎬🎼🎹🎻🥁🏆🏀⚽️🏈🎾🏐🏓🥊⛳️🛼🛹🚲🛴🚀✈️🛰️🌍🌌🪐🌙☀️🌤️🌧️❄️";
const EMOJIS = Array.from(EMOJI_STR);

function EngageDrawer() {
  return (
    <div className="drawer glass">
      <div className="emoji-grid">
        {EMOJIS.map((e, i) => (
          <button key={i} className="emoji">{e}</button>
        ))}
      </div>
    </div>
  );
}

function CommentDrawer() {
  return (
    <div className="drawer glass">
      <textarea className="comment-box" placeholder="Write a comment…" rows={3} />
      <div className="drawer-row right">
        <button className="chip primary">Post</button>
      </div>
    </div>
  );
}

function ShareDrawer() {
  return (
    <div className="drawer glass">
      <div className="drawer-row">
        <button className="chip">Remix</button>
        <button className="chip">Share to feed</button>
        <button className="chip">Copy link</button>
      </div>
    </div>
  );
}