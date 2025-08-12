import { useEffect, useState } from "react";
import Feed2d from "./components/Feed2d";
import World3d from "./components/World3d";

type Mode = "feed" | "portal";

export default function App() {
  const [mode, setMode] = useState<Mode>("feed");
  const [transitioning, setTransitioning] = useState(false);
  const [worldId, setWorldId] = useState<string | null>(null);

  function openPortal(nextWorldId: string | null) {
    setWorldId(nextWorldId);
    // White-void suck effect
    setTransitioning(true);
    window.setTimeout(() => {
      setMode("portal");
      setTransitioning(false);
    }, 700); // match CSS animation duration
  }

  function backToFeed() {
    setTransitioning(true);
    window.setTimeout(() => {
      setMode("feed");
      setTransitioning(false);
    }, 500);
  }

  useEffect(() => {
    document.body.classList.toggle("portal-mode", mode === "portal");
  }, [mode]);

  return (
    <div className={`app ${mode === "feed" ? "feed-mode" : "portal-mode"}`}>
      {mode === "feed" ? (
        <Feed2d onOpenPortal={openPortal} />
      ) : (
        <World3d worldId={worldId} onBack={backToFeed} />
      )}

      {/* Bright white void overlay during transitions */}
      {transitioning && <div className="whiteout" aria-hidden="true" />}
    </div>
  );
}
