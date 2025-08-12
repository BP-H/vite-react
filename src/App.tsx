// src/App.tsx
import { useState } from "react";
import Shell from "./components/Shell";
import Feed2D from "./components/Feed2D";
import World3D from "./components/World3D";
import type { Post } from "./types";

const DEMO_POSTS: Post[] = [
  { id: "1", title: "Prototype Moment", author: "@proto_ai" },
  { id: "2", title: "Symbolic Feed", author: "@neonfork" },
  { id: "3", title: "Ocean Study", author: "@superNova_2177" },
  { id: "4", title: "Cloud Garden", author: "@axl" },
  { id: "5", title: "Neon Metro", author: "@io_dev" },
];

export default function App() {
  const [mode, setMode] = useState<"feed" | "void">("feed");
  const [selected, setSelected] = useState<Post | null>(null);

  const openVoid = (p?: Post) => {
    setSelected(p ?? null);
    setMode("void");
  };
  const closeVoid = () => setMode("feed");

  return (
    <div className={`stage ${mode === "void" ? "stage--void" : "stage--feed"}`}>
      <Shell>
        {mode === "feed" ? (
          <Feed2D posts={DEMO_POSTS} onOpenWorld={openVoid} />
        ) : (
          <World3D posts={DEMO_POSTS} selected={selected} onExit={closeVoid} />
        )}
      </Shell>

      {/* Floating portal button (visible over feed) */}
      {mode === "feed" && (
        <button
          className="portal-fab"
          aria-label="Open Portal"
          onClick={() => openVoid()}
        >
          <span className="orb" />
        </button>
      )}
    </div>
  );
}