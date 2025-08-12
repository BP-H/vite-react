import { useCallback, useState } from "react";
import Feed2D from "./components/Feed2D";
import World3D from "./components/World3D";
import "./App.css";

type Mode = "feed" | "portal";

export default function App() {
  const [mode, setMode] = useState<Mode>("feed");
  const [sucking, setSucking] = useState(false);
  const [activeWorld, setActiveWorld] = useState<string | null>(null);

  const enterPortal = useCallback((worldId: string) => {
    setActiveWorld(worldId);
    // animate "sucked into bright white void", then switch scenes
    setSucking(true);
    setTimeout(() => {
      setMode("portal");
      setSucking(false);
    }, 1200);
  }, []);

  const backToFeed = useCallback(() => {
    setMode("feed");
    setActiveWorld(null);
  }, []);

  return (
    <div className={`app-root ${mode}`}>
      {mode === "feed" ? (
        <Feed2D sucking={sucking} onEnterPortal={enterPortal} />
      ) : (
        <World3D worldId={activeWorld ?? "prototype"} onBack={backToFeed} />
      )}
    </div>
  );
}
