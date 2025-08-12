// src/components/Shell.tsx
import Sidebar from "./Sidebar";
import AssistantOrb from "./AssistantOrb";
import Feed2D from "./Feed2D";
import { Post } from "../types";
import bus from "../lib/bus";
import { useEffect } from "react";

export default function Shell({ onPortal, hideOrb = false }: { onPortal: (p: Post, at?: {x:number;y:number}) => void; hideOrb?: boolean }) {
  // simple nav bus (optional): route labels to your feed for now
  useEffect(() => {
    return bus.on("nav:goto", ({ label }: { label: string }) => {
      // You can wire real routing later; for now we just log/ignore.
      console.info("nav:goto", label);
    });
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <div className="content-col">
        <Feed2D posts={[]} onOpenWorld={(p?: Post) => {
          const at = { x: window.innerWidth - 56, y: window.innerHeight - 56 };
          onPortal?.(p as Post, at);
        }}/>
      </div>

      {!hideOrb && <AssistantOrb onPortal={(post, at) => onPortal(post, at)} />}
    </div>
  );
}
