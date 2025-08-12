// src/components/AssistantOrb.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import bus from "../lib/bus";
import { Post } from "../types";

/** minimal typings so TS/Vercel don't complain */
declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}
type SpeechRecognitionLike = any;

const FLY_MS = 600;

export default function AssistantOrb({
  onPortal,
  hidden = false,
}: {
  onPortal: (post: Post, at: { x: number; y: number }) => void;
  hidden?: boolean;
}) {
  const dock = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    const x = window.innerWidth - 76;
    const y = window.innerHeight - 76;
    dock.current = { x, y };
    return { x, y };
  });
  const [micOn, setMicOn] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const lastHoverRef = useRef<{ post: Post; x: number; y: number } | null>(null);
  const [flying, setFlying] = useState(false);

  // keep dock in bottom-right on resize
  useEffect(() => {
    const onR = () => {
      const x = window.innerWidth - 76;
      const y = window.innerHeight - 76;
      dock.current = { x, y };
      if (!flying) setPos({ x, y });
    };
    window.addEventListener("resize", onR);
    return () => {
      window.removeEventListener("resize", onR);
    };
  }, [flying]);

  // remember the currently hovered card (so voice can act on it)
  useEffect(() => {
    const off = bus.on("feed:hover", (p: { post: Post; x: number; y: number }) => {
      lastHoverRef.current = p;
    });
    return off;
  }, []);

  // when feed asks the orb to portal, fly to that point then trigger the burst
  useEffect(() => {
    const off = bus.on("orb:portal", (payload: { post: Post; x: number; y: number }) => {
      setFlying(true);
      setPos({ x: payload.x, y: payload.y });
      window.setTimeout(() => {
        onPortal(payload.post, { x: payload.x, y: payload.y });
        setPos({ ...dock.current });
        window.setTimeout(() => setFlying(false), 350);
      }, FLY_MS);
    });
    return off;
  }, [onPortal]);

  // Web Speech API (best effort)
  useEffect(() => {
    const Ctor: any = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!Ctor) return;
    const rec: SpeechRecognitionLike = new Ctor();
    recRef.current = rec;
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e: any) => {
      const t = Array.from(e.results as any)
        .map((r: any) => (r?.[0]?.transcript || "").toLowerCase())
        .join(" ");
      if (t.includes("enter") && (t.includes("world") || t.includes("portal"))) {
        const p = lastHoverRef.current;
        if (p) bus.emit("orb:portal", p);
      }
    };
    return () => {
      try { rec.stop(); } catch {}
    };
  }, []);

  const toggleMic = () => {
    const rec = recRef.current;
    if (!rec) return;
    try {
      if (micOn) { rec.stop(); setMicOn(false); }
      else { rec.start(); setMicOn(true); }
    } catch {}
  };

  const style = useMemo(
    () => ({ left: pos.x + "px", top: pos.y + "px", display: hidden ? "none" : undefined }),
    [pos, hidden]
  );

  return (
    <button
      className={`assistant-orb ${micOn ? "mic" : ""} ${flying ? "flying" : ""}`}
      style={style}
      aria-label="Assistant"
      title={micOn ? "Listening… (click to stop)" : "Assistant (click to talk)"}
      onClick={toggleMic}
    >
      <span className="assistant-orb__core" />
      <span className="assistant-orb__ring" />
    </button>
  );
}
