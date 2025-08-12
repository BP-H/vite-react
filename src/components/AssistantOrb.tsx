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
const defaultPost: Post = { id: -1, author: "@proto_ai", title: "Prototype Moment", image: "" };

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
  const [toast, setToast] = useState<string>("");
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
    return () => { window.removeEventListener("resize", onR); };
  }, [flying]);

  // remember the currently hovered card
  useEffect(() => {
    const off = bus.on("feed:hover", (p: { post: Post; x: number; y: number }) => {
      lastHoverRef.current = p;
    });
    return off;
  }, []);

  // fly to target + portal
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

  // Web Speech (visible status + fallback behavior)
  useEffect(() => {
    const Ctor: any = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!Ctor) {
      setToast("Voice not supported in this browser");
      return;
    }
    const rec: SpeechRecognitionLike = new Ctor();
    recRef.current = rec;
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onstart = () => setToast("Listening…");
    rec.onend   = () => setToast(micOn ? "…" : "");
    rec.onerror = () => setToast("Mic error");

    rec.onresult = (e: any) => {
      const t = Array.from(e.results as any)
        .map((r: any) => (r?.[0]?.transcript || "").toLowerCase())
        .join(" ")
        .trim();
      if (!t) return;
      setToast(`Heard: “${t}”`);

      const enter =
        t.includes("enter") || t.includes("open portal") || t.includes("go inside") || t.includes("enter void");

      if (enter) {
        const target = lastHoverRef.current
          ?? { post: defaultPost, x: window.innerWidth - 56, y: window.innerHeight - 56 };
        setToast("Opening portal…");
        bus.emit("orb:portal", target);
        // (Optional) auto stop listening after action:
        try { rec.stop(); setMicOn(false); } catch {}
        return;
      }
      // not a portal command — just show what we heard
      window.setTimeout(() => setToast(""), 1500);
    };

    return () => { try { rec.stop(); } catch {} };
  }, [micOn]);

  const toggleMic = () => {
    const rec = recRef.current;
    if (!rec) return;
    try {
      if (micOn) { rec.stop(); setMicOn(false); setToast(""); }
      else { rec.start(); setMicOn(true); setToast("Listening…"); }
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
      {toast && <span className="assistant-orb__toast">{toast}</span>}
    </button>
  );
}
