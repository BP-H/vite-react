import { useEffect, useMemo, useRef, useState } from "react";
import bus from "../lib/bus";
import { Post } from "../types";
import AssistantOrb from "./AssistantOrb";
import PostCard from "./feed/PostCard";
import "./SidebarFab.css";

/* Tiny profile FAB that reveals the sidebar */
function ProfileFab() {
  return (
    <button
      className="profile-fab"
      aria-label="Open menu"
      onClick={() => bus.emit("sidebar:toggle", {})}
      title="Menu"
    >
      <span className="pfab-core" />
    </button>
  );
}

/* Slide-in sidebar (kept super light) */
function SlideSidebar() {
  const [open, setOpen] = useState(false);
  useEffect(() => bus.on("sidebar:toggle", () => setOpen((v) => !v)), []);
  return (
    <>
      <div className={`side-overlay ${open ? "on" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`side-panel ${open ? "on" : ""}`} aria-hidden={!open}>
        <div className="side-head">
          <div className="pfab-core sm" />
          <strong>superNova_2177</strong>
        </div>
        <nav className="side-nav">
          <button>Feed</button>
          <button>Messages</button>
          <button>Profile</button>
          <button>Agents</button>
          <button>Settings</button>
        </nav>
      </aside>
    </>
  );
}

/* Demo feed generator (image-only to keep structure steady) */
function makeFeed(): Post[] {
  const imgs = [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1200&auto=format&fit=crop",
  ];
  const authors = ["@proto_ai", "@forest_bot", "@superNova_2177", "@test_tech"];
  const titles = ["Ocean study", "Prototype moment. Enter the void.", "City textures", "Low-poly tree"];
  const out: Post[] = [];
  for (let i = 0; i < 24; i++) {
    out.push({
      id: i + 1,
      author: authors[i % authors.length],
      title: titles[i % titles.length],
      image: imgs[i % imgs.length],
    });
  }
  return out;
}

export default function Shell({
  onPortal,
  hideOrb = false,
}: {
  onPortal?: (post: Post) => void;
  hideOrb?: boolean;
}) {
  const [posts] = useState<Post[]>(() => makeFeed());

  // allow external "leave" to go back from world (kept for compatibility)
  useEffect(() => bus.on("nav:goto", () => {}), []);

  // orb handoff (when AssistantOrb finishes flying it calls App via bus already)
  useEffect(() => {
    return bus.on("orb:portal-commit", (p: { post: Post }) => {
      onPortal?.(p.post);
    });
  }, [onPortal]);

  return (
    <>
      <ProfileFab />
      <SlideSidebar />

      <div className="feed-frame">
        <div className="feed-col">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </div>

      {!hideOrb && (
        <AssistantOrb
          onPortal={(post) => onPortal?.(post)}
          hidden={false}
        />
      )}
    </>
  );
}