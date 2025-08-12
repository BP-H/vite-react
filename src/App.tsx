// src/App.tsx
import { useCallback, useMemo, useState } from "react";
import "./styles.css";
import BackgroundVoid from "./three/BackgroundVoid";
import Sidebar from "./components/Sidebar";
import Feed2D, { Post } from "./components/Feed2D";
import World3D from "./components/World3D";
import AssistantOrb from "./components/AssistantOrb";

export default function App() {
  const [mode, setMode] = useState<"feed" | "world">("feed");
  const [selected, setSelected] = useState<Post | null>(null);
  const [burst, setBurst] = useState<{ on: boolean; x: number; y: number }>({
    on: false,
    x: 0,
    y: 0,
  });

  const enterWorld = useCallback((p: Post, at?: { x: number; y: number }) => {
    setSelected(p);
    setBurst({
      on: true,
      x: at?.x ?? window.innerWidth / 2,
      y: at?.y ?? window.innerHeight / 2,
    });
    setTimeout(() => {
      setMode("world");
      setBurst((b) => ({ ...b, on: false }));
    }, 650);
  }, []);

  const leaveWorld = useCallback(() => setMode("feed"), []);

  const overlayStyle = useMemo(
    () =>
      ({
        "--px": `${burst.x}px`,
        "--py": `${burst.y}px`,
      }) as React.CSSProperties,
    [burst.x, burst.y]
  );

  // default orb portal target
  const defaultPost: Post = {
    id: -1,
    author: "@proto_ai",
    title: "Prototype Moment",
    image: "",
  };

  return (
    <div style={{ position: "relative" }}>
      {/* living 3D background under everything */}
      <BackgroundVoid />

      {/* UI layer */}
      <div className="apple-white-bg" style={{ position: "relative", zIndex: 1 }}>
        {mode === "feed" ? (
          <div className="app-root">
            <Sidebar onOpen={() => enterWorld(defaultPost)} />
            <main className="content">
              <Feed2D onEnterWorld={enterWorld} />
            </main>
          </div>
        ) : (
          <main className="content" style={{ padding: 0 }}>
            <World3D selected={selected} onBack={leaveWorld} />
          </main>
        )}
      </div>

      {/* floating assistant orb (hidden on world) */}
      <AssistantOrb
        hidden={mode === "world"}
        onOpen={(x, y) => enterWorld(defaultPost, { x, y })}
      />

      {/* expanding white portal */}
      <div className={`portal-overlay ${burst.on ? "on" : ""}`} style={overlayStyle} aria-hidden />
    </div>
  );
}
