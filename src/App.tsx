import { useCallback, useMemo, useRef, useState } from "react";
import "./styles.css";
import Feed2D, { PostCard } from "./components/Feed2D";
import World3D from "./components/World3D";

type Mode = "feed" | "world";

export default function App() {
  const [mode, setMode] = useState<Mode>("feed");
  const [activePost, setActivePost] = useState<PostCard | null>(null);

  // Where the portal animation starts (mouse/touch position)
  const portalFrom = useRef<{ x: number; y: number }>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [portalOn, setPortalOn] = useState(false);

  const posts = useMemo<PostCard[]>(
    () => [
      {
        id: "p1",
        handle: "@proto_ai",
        title: "Prototype Moment",
        demo: true,
        world: "void",
        palette: ["#ffffff", "#e8ecf7", "#dfe6f2"],
      },
      {
        id: "p2",
        handle: "@neonfork",
        title: "Symbolic Feed",
        demo: true,
        world: "knots",
        palette: ["#0f1220", "#22263b", "#6a73ff"],
      },
      {
        id: "p3",
        handle: "@superNova_2177",
        title: "Ocean Study",
        demo: true,
        world: "ocean",
        palette: ["#edf7ff", "#cbe8ff", "#7bb3ff"],
      },
    ],
    []
  );

  const enterWorld = useCallback((post: PostCard, start: { x: number; y: number }) => {
    portalFrom.current = start;
    setActivePost(post);
    setPortalOn(true);
    // Wait for the portal animation to expand, then switch to world
    window.setTimeout(() => {
      setPortalOn(false);
      setMode("world");
    }, 700);
  }, []);

  const backToFeed = useCallback(() => {
    // Reverse: world fades to white, shrink portal, show feed
    setPortalOn(true);
    window.setTimeout(() => {
      setPortalOn(false);
      setActivePost(null);
      setMode("feed");
    }, 600);
  }, []);

  return (
    <div className="app-root apple-white-bg">
      {/* Sidebar (kept minimal and light, Apple-like) */}
      <aside className="sidebar">
        <div className="sidebar-inner">
          <div className="brand">superNova_2177</div>
          <button
            className="siri-orb"
            onClick={(e) =>
              enterWorld(posts[0], { x: (e.clientX ?? window.innerWidth / 2), y: (e.clientY ?? 0) })
            }
            aria-label="Open Portal"
          >
            Open Portal
          </button>

          <nav className="side-links">
            <span className="section">Spaces</span>
            <a>AccessAI Tech</a>
            <a>superNova_2177</a>
            <a>GLOBALRUNWAY</a>
            <span className="section">Navigate</span>
            <a>Feed</a>
            <a>Messages</a>
            <a>Profile</a>
            <a>Proposals</a>
            <a>Decisions</a>
            <a>Execution</a>
          </nav>
        </div>
      </aside>

      <main className="content">
        {mode === "feed" && (
          <Feed2D posts={posts} onEnterWorld={enterWorld} />
        )}

        {mode === "world" && activePost && (
          <World3D key={activePost.id} post={activePost} onBack={backToFeed} />
        )}
      </main>

      {/* Bright-white “sucked into the void” portal */}
      <PortalOverlay active={portalOn} from={portalFrom.current} />
    </div>
  );
}

function PortalOverlay({ active, from }: { active: boolean; from: { x: number; y: number } }) {
  // CSS variables drive the clip-path circle expansion from the click/touch
  const style = {
    // position in viewport coords
    ["--px" as any]: `${from.x}px`,
    ["--py" as any]: `${from.y}px`,
  };
  return <div className={`portal-overlay ${active ? "on" : ""}`} style={style} />;
}
