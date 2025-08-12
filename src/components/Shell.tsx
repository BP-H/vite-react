// src/components/Shell.tsx
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import AssistantOrb from "./AssistantOrb";
import Feed2D from "./Feed2D";
import { Post } from "../types";
import bus from "../lib/bus";

type XY = { x: number; y: number };

// NOTE: App passes `enterWorld(p, at?)`, so keep `at` optional here.
export default function Shell({
  onPortal,
  hideOrb = false,
}: {
  onPortal: (p: Post, at?: XY) => void;
  hideOrb?: boolean;
}) {
  // optional: react to sidebar nav events
  useEffect(() => {
    return bus.on("nav:goto", ({ label }: { label: string }) => {
      console.info("nav:goto", label);
    });
  }, []);

  // Bridge to Feed2D's expected signature: (p, at: XY) => void
  const handleEnterWorld = (p: Post, at: XY) => onPortal(p, at);

  return (
    <div className="layout">
      <Sidebar />
      <div className="content-col">
        {/* Feed2D expects onEnterWorld only (no posts prop) */}
        <Feed2D onEnterWorld={handleEnterWorld} />
      </div>

      {!hideOrb && (
        // AssistantOrb expects (post, at: XY). We forward to onPortal.
        <AssistantOrb onPortal={(post, at) => onPortal(post, at)} />
      )}
    </div>
  );
}
