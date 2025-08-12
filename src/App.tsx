// src/App.tsx
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import "./styles.css";
import Shell from "./components/Shell";
import ChatDock from "./components/ChatDock";
import { Post } from "./types";
import bus from "./lib/bus";

// code-split the heavy bits
const BackgroundVoid = lazy(() => import("./three/BackgroundVoid"));
const World3D = lazy(() => import("./components/World3D"));

export default function App() {
  const [mode, setMode] = useState<"feed" | "world">("feed");
  const [selected, setSelected] = useState<Post | null>(null);
  const [burst, setBurst] = useState<{ on: boolean; x: number; y: number }>({ on: false, x: 0, y: 0 });

  const enterWorld = useCallback((p: Post, at?: { x: number; y: number }) => {
    setSelected(p);
    setBurst({
      on: true,
      x: at?.x ?? window.innerWidth / 2,
      y: at?.y ?? window.innerHeight / 2,
    });
    window.setTimeout(() => {
      setMode("world");
      setBurst((b) => ({ ...b, on: false }));
    }, 650);
  }, []);

  const leaveWorld = useCallback(() => setMode("feed"), []);

  // Allow voice command "back/exit" to leave world
  useEffect(() => bus.on("ui:leave", () => setMode("feed")), []);

  const overlayStyle = useMemo(
    () =>
      ({
        "--px": `${burst.x}px`,
        "--py": `${burst.y}px`,
      }) as React.CSSProperties,
    [burst.x, burst.y]
  );

  return (
    <div style={{ position: "relative" }}>
      {/* Background is lazy — show a soft gradient while loading */}
      <Suspense
        fallback={
          <div
            aria-hidden
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 0,
              background:
                "radial-gradient(120% 100% at -20% -20%, rgba(255,75,208,.18), transparent 60%), linear-gradient(180deg,#0f1117,#10131a)",
            }}
          />
        }
      >
        <BackgroundVoid />
      </Suspense>

      {/* Foreground UI */}
      <div className="apple-white-bg" style={{ position: "relative", zIndex: 1 }}>
        {mode === "feed" ? (
          // Shell renders the feed + AssistantOrb
          <Shell onPortal={enterWorld} hideOrb={false} />
        ) : (
          <main className="content" style={{ padding: 0 }}>
            {/* World is lazy — show a simple placeholder while it loads */}
            <Suspense
              fallback={
                <div
                  style={{
                    height: "70vh",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 600,
                    opacity: 0.8,
                  }}
                >
                  Loading world…
                </div>
              }
            >
              <World3D selected={selected} onBack={leaveWorld} />
            </Suspense>
          </main>
        )}
      </div>

      {/* Chat dock shows transcripts + replies */}
      <ChatDock />

      {/* Expanding white portal mask */}
      <div className={`portal-overlay ${burst.on ? "on" : ""}`} style={overlayStyle} aria-hidden />
    </div>
  );
}
