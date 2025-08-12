import { useCallback, useMemo, useState } from "react";
import "./styles.css";
import BackgroundVoid from "./three/BackgroundVoid";
import Sidebar from "./components/Sidebar";
import Feed2D from "./components/Feed2D";
import World3D from "./components/World3D";
import AssistantOrb from "./components/AssistantOrb";
import { Post } from "./types";

export default function App() {
  const [mode, setMode] = useState<"feed" | "world">("feed");
  const [selected, setSelected] = useState<Post | null>(null);
  const [burst, setBurst] = useState<{ on: boolean; x: number; y: number }>({
    on: false,
    x: 0,
    y: 0,
  });

  const portalNow = useCallback((p: Post, at: { x: number; y: number }) => {
    setSelected(p);
    setBurst({ on: true, x: at.x, y: at.y });
    setTimeout(() => {
      setMode("world");
      setBurst((b) => ({ ...b, on: false }));
    }, 650);
  }, []);

  const leaveWorld = useCallback(() => setMode("feed"), []);

  const overlayStyle = useMemo(
    () => ({ "--px": `${burst.x}px`, "--py": `${burst.y}px` }) as React.CSSProperties,
    [burst.x, burst.y]
  );

  return (
    <div style={{ position: "relative" }}>
      {/* 3D background */}
      <BackgroundVoid />

      {/* UI */}
      <div className="apple-white-bg" style={{ position: "relative", zIndex: 1 }}>
        {mode === "feed" ? (
          <div className="app-root">
            <Sidebar onOpen={() =>
              portalNow({ id: -1, author: "@proto_ai", title: "Prototype Moment", image: "" }, { x: window.innerWidth - 60, y: window.innerHeight - 60 })
            } />
            <main className="content">
              <Feed2D onEnterWorld={portalNow} />
            </main>
          </div>
        ) : (
          <main className="content" style={{ padding: 0 }}>
            <World3D selected={selected} onBack={leaveWorld} />
          </main>
        )}
      </div>

      {/* Assistant orb (flies to a card then calls onPortal) */}
      <AssistantOrb onPortal={portalNow} />

      {/* expanding white portal mask */}
      <div className={`portal-overlay ${burst.on ? "on" : ""}`} style={overlayStyle} aria-hidden />
    </div>
  );
}
