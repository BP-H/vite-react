// src/components/AssistantOrb.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import bus from "../lib/bus";
import { Post } from "../types";
import { WorldState } from "../lib/world";

// Remove the old declare-global block and use this (or nothing at all):
declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}
type SpeechRecognitionLike = any;

const FLY_MS = 600;
const defaultPost: Post = { id: -1, author: "@proto_ai", title: "Prototype Moment", image: "" };

function say(text: string) {
  try {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return false;
    window.speechSynthesis.cancel();
    const u = new window.SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 1;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}

function parseLocalIntent(t: string, prev: Partial<WorldState>) {
  const patch: Partial<WorldState> = {};
  let action: "portal" | "leave" | null = null;
  let message: string | null = null;

  // normalize
  t = t.toLowerCase();

  // navigation
  if ((/enter|open/.test(t)) && /(world|portal|void)/.test(t)) {
    action = "portal"; message = "Entering world";
  }
  if ((/leave|exit|back/.test(t)) && /(world|portal|feed|void)/.test(t)) {
    action = "leave"; message = "Back to feed";
  }

  // theme
  if (/dark(er)?/.test(t)) { patch.theme = "dark"; message = "Dark mode"; }
  if (/light|bright(er)?/.test(t)) { patch.theme = "light"; message = "Light mode"; }

  // grid
  if (/(hide|turn off) grid/.test(t)) { patch.gridOpacity = 0; message = "Grid off"; }
  if (/(show|turn on) grid/.test(t)) { patch.gridOpacity = 0.18; message = "Grid on"; }

  // fog
  if (/(more|increase) fog/.test(t)) { patch.fogLevel = Math.min(1, (prev.fogLevel ?? .5) + 0.15); message = "More fog"; }
  if (/(less|decrease|clear) fog/.test(t)) { patch.fogLevel = Math.max(0, (prev.fogLevel ?? .5) - 0.15); message = "Less fog"; }

  // orbs count
  const mCount = t.match(/(?:set )?(?:orbs?|people) to (\d{1,2})/);
  if (mCount) { patch.orbCount = Math.max(1, Math.min(64, parseInt(mCount[1], 10))); message = `Orbs ${patch.orbCount}`; }
  if (/(more|add) (?:orbs?|people)/.test(t)) {
    const base = (prev.orbCount ?? 14) + 4; patch.orbCount = Math.min(64, base); message = `Orbs ${patch.orbCount}`;
  }
  if (/(less|fewer|remove) (?:orbs?|people)/.test(t)) {
    const base = (prev.orbCount ?? 14) - 4; patch.orbCount = Math.max(1, base); message = `Orbs ${patch.orbCount}`;
  }

  // orbs color (basic names + hex)
  const named: Record<string,string> = {
    red:"#ef4444", blue:"#3b82f6", purple:"#8b5cf6", pink:"#ec4899", teal:"#14b8a6",
    green:"#22c55e", orange:"#f97316", white:"#ffffff", black:"#111827"
  };
  const hex = t.match(/#([0-9a-f]{3,6})/);
  const cname = Object.keys(named).find(k => t.includes(k+" orb") || t.includes(k+" sphere") || t.includes(k+" color"));
  if (hex) { patch.orbColor = "#"+hex[1]; message = "Orb color updated"; }
  else if (cname) { patch.orbColor = named[cname]; message = `Orbs ${cname}`; }

  return { patch, action, message };
}

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
  const worldRef = useRef<Partial<WorldState>>({}); // remember last patch to do relative changes
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
    return () => window.removeEventListener("resize", onR);
  }, [flying]);

  // remember currently hovered card
  useEffect(() => bus.on("feed:hover", (p) => (lastHoverRef.current = p)), []);

  // allow external code to update our remembered world (optional)
  useEffect(() => bus.on("world:remember", (s: Partial<WorldState>) => (worldRef.current = { ...worldRef.current, ...s })), []);

  // fly to target + portal
  useEffect(() => {
    return bus.on("orb:portal", (payload: { post: Post; x: number; y: number }) => {
      setFlying(true);
      setPos({ x: payload.x, y: payload.y });
      setTimeout(() => {
        onPortal(payload.post, { x: payload.x, y: payload.y });
        setPos({ ...dock.current });
        setTimeout(() => setFlying(false), 350);
      }, FLY_MS);
    });
  }, [onPortal]);

  // Web Speech: listen -> parse -> update world / navigate -> speak back
  useEffect(() => {
    const Ctor: any = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!Ctor) { setToast("Voice not supported"); return; }
    const rec: SpeechRecognitionLike = new Ctor();
    recRef.current = rec;
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onstart = () => setToast("Listening…");
    rec.onend   = () => setToast(micOn ? "…" : "");
    rec.onerror = () => setToast("Mic error");

    rec.onresult = (e: any) => {
      const t = Array.from(e.results as any).map((r: any) => (r?.[0]?.transcript || "")).join(" ").trim();
      if (!t) return;
      setToast(`Heard: “${t}”`);

      const { patch, action, message } = parseLocalIntent(t, worldRef.current);

      if (patch && Object.keys(patch).length) {
        worldRef.current = { ...worldRef.current, ...patch };
        bus.emit("world:update", patch);
      }
      if (action === "portal") {
        const target = lastHoverRef.current ?? { post: defaultPost, x: window.innerWidth - 56, y: window.innerHeight - 56 };
        bus.emit("orb:portal", target);
      }
      if (action === "leave") {
        bus.emit("ui:leave", {});
      }

      const spoken = message || "Done";
      setToast(spoken);
      say(spoken);
      // auto clear toast
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
