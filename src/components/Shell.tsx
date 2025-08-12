// src/components/Shell.tsx
import { useMemo } from "react";
import Sidebar from "./Sidebar";
import AssistantOrb from "./AssistantOrb";
import bus from "../lib/bus";
import { Post } from "../types";

type Props = {
  onPortal: (p: Post, at: { x: number; y: number }) => void;
  hideOrb?: boolean;
};

// simple demo posts; replace with your real data source if you like
const demoPosts: Post[] = [
  { id: 1, author: "taha_gungor", title: "Prototype moment. Enter the void.", image: "/cover1.jpg" },
  { id: 2, author: "superNova_2177", title: "Frosted glass + 3D worlds → engagement ↑", image: "/cover2.jpg" },
  { id: 3, author: "test_tech", title: "Tap the orb or say “enter world”.", image: "/cover3.jpg" },
];

export default function Shell({ onPortal, hideOrb = false }: Props) {
  // you can swap this to props or a fetch; memo keeps renders light
  const posts = useMemo(() => demoPosts, []);

  function emitHover(p: Post, el: HTMLElement) {
    const r = el.getBoundingClientRect();
    // center (x,y) for the orb flight target
    const x = r.left + r.width / 2;
    const y = r.top + Math.min(56, r.height * 0.25);
    bus.emit("feed:hover", { post: p, x, y });
  }

  function clearHover() {
    // optional: you can emit a null hover if you want the orb to ignore
    // bus.emit("feed:hover", null);
  }

  function portalFrom(el: HTMLElement, p: Post) {
    const r = el.getBoundingClientRect();
    onPortal(p, { x: r.left + r.width / 2, y: r.top + 24 });
  }

  return (
    <>
      {/* Tiny avatar dock (fixed) + sliding panel */}
      <Sidebar />

      {/* Centered, full-width feed (Instagram/LinkedIn style) */}
      <div className="feed-frame">
        <div className="feed-col">
          {posts.map((p) => (
            <article
              key={p.id}
              className="post-card"
              onMouseEnter={(e) => emitHover(p, e.currentTarget)}
              onMouseMove={(e) => emitHover(p, e.currentTarget)}
              onMouseLeave={clearHover}
            >
              <header className="post-head">
                <div className="avatar">
                  <img
                    src="/avatar.jpg"
                    alt=""
                    onError={(e) => {
                      // hide if missing; Sidebar provides a nice pink placeholder already
                      (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                    }}
                  />
                </div>
                <div className="meta">
                  <div className="name">{p.author}</div>
                  <div className="sub">superNova_2177 • now</div>
                </div>
              </header>

              {p.image ? (
                <div className="post-media">
                  <img src={p.image} alt="" />
                </div>
              ) : null}

              <div className="post-body">{p.title}</div>

              <div className="post-engage">
                <button className="pill">❤️ 1.2k</button>
                <button className="pill">💬 342</button>
                <button
                  className="pill"
                  onClick={(e) => portalFrom(e.currentTarget.closest(".post-card") as HTMLElement, p)}
                >
                  🌀 Enter world
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Voice orb – floats over everything, uses the hover coordinates */}
      {!hideOrb && <AssistantOrb onPortal={onPortal} />}
    </>
  );
}
