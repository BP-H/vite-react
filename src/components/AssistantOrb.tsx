// src/components/AssistantOrb.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import bus from "../lib/bus";
import { Post } from "../types";
import { WorldState } from "../lib/world";

/** Only declare speech recognition (built-in TTS types already exist) */
declare global {
  interface Window { webkitSpeechRecognition?: any; SpeechRecognition?: any; }
}
type SpeechRecognitionLike = any;

const FLY_MS = 600;
const defaultPost: Post = { id: -1, author: "@proto_ai", title: "Prototype Moment", image: "" };

function say(text: string) {
  try {
    const synth = (window as any).speechSynthesis;
    const Utter = (window as any).SpeechSynthesisUtterance;
    if (!synth || !Utter) return false;
    synth.cancel();
    const u = new Utter(text);
    const voices = synth.getVoices?.() || [];
    const v = voices.find((x: any) => x?.lang?.startsWith?.("en")) || voices[0];
    if (v) u.voice = v;
    u.rate = 1; u.pitch = 1; u.lang = "en-US";
    synth.speak(u);
    return true;
  } catch { return false; }
}

async function askModel(prompt: string): Promise<string | null> {
  const apiKey = localStorage.getItem("sn2177.apiKey") || "";
  if (!apiKey) return null;
  try {
    const r = await fetch("/api/assistant-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, prompt }),
    });
    const j = await r.json();
    if (!j?.ok) return j?.error || "Failed";
    return j.text || "";
  } catch (e: any) {
    return e?.message || "Network error";
  }
}

function parseLocalIntent(t: string, prev: Partial<WorldState>) {
  const patch: Partial<WorldState> = {};
  let action: "portal" | "leave" | null = null;
  let message: string | null = null;

  t = t.toLowerCase();
  if ((/enter|open/.test(t)) && /(world|portal|void)/.test(t)) { action = "portal"; message = "Entering world"; }
  if ((/leave|exit|back/.test(t)) && /(world|portal|feed|void)/.test(t)) { action = "leave"; message = "Back to feed"; }

  if (/dark(er)?/.test(t)) { patch.theme = "dark"; message = "Dark mode"; }
  if (/light|bright(er)?/.test(t)) { patch.theme = "light"; message = "Light mode"; }

  if (/(hide|turn off) grid/.test(t)) { patch.gridOpacity = 0; message = "Grid off"; }
  if (/(show|turn on) grid/.test(t)) { patch.gridOpacity = 0.18; message = "Grid on"; }

  if (/(more|increase) fog/.test(t)) { patch.fogLevel = Math.min(1, (prev.fogLevel ?? .5) + 0.15); message = "More fog"; }
  if (/(less|decrease|clear) fog/.test(t)) { patch.fogLevel = Math.max(0, (prev.fogLevel ?? .5) - 0.15); message = "Less fog"; }

  const mCount = t.match(/(?:set )?(?:orbs?|people) to (\d{1,2})/);
  if (mCount) { patch.orbCount = Math.max(1, Math.min(64, parseInt(mCount[1], 10))); message = `Orbs ${patch.orbCount}`; }
  if (/(more|add) (?:orbs?|people)/.test(t)) { patch.orbCount = Math.min(64, (prev.orbCount ?? 14) + 4); message = `Orbs ${patch.orbCount}`; }
  if (/(less|fewer|remove) (?:orbs?|people)/.test(t)) { patch.orbCount = Math.max(1, (prev.orbCount ?? 14) - 4); message = `Orbs ${patch.orbCount}`; }

  const named: Record<string,string> = { red:"#ef4444", blue:"#3b82f6", purple:"#8b5cf6", pink:"#ec4899", teal:"#14b8a6", green:"#22c55e", orange:"#f97316", white:"#ffffff", black:"#111827" };
  const hex = t.match(/#([0-9a-f]{3,6})/);
  const cname = Object.keys(named).find(k => t.includes(k+" orb") || t.includes(k+" sphere") || t.includes(k+" color"));
  if (hex) { patch.orbColor = "#"+hex[1]; message = "Orb color updated"; }
  else if (cname) { patch.orbColor = named[cname]; message = `Orbs ${cname}`; }

  return { patch, action, message };
}

export default function AssistantOrb({
  onPortal,
  hidden = false,
}: { onPortal: (post: Post, at: { x: number; y: number }) => void; hidden?: boolean; }) {
  const dock = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    const x = window.innerWidth - 76, y = window.innerHeight - 76;
    dock.current = { x, y }; return { x, y };
  });
  const [micOn, setMicOn] = useState(false);
  const [toast, setToast] = useState<string>("");
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const worldRef = useRef<Record<string, any>>({});
  const lastHoverRef = useRef<{ post: Post; x: number; y: number } | null>(null);
  const [flying, setFlying] = useState(false);

  useEffect(() => {
    const onR = () => { const x = window.innerWidth - 76, y = window.innerHeight - 76; dock.current = { x, y }; if (!flying) setPos({ x, y }); };
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, [flying]);

  useEffect(() => bus.on("feed:hover", (p) => (lastHoverRef.current = p)), []);
  useEffect(() => bus.on("world:remember", (s) => (worldRef.current = { ...worldRef.current, ...s })), []);

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

  // Speech in / out
  useEffect(() => {
    const Ctor: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!Ctor) { setToast("Voice not supported"); bus.emit("chat:add", { role: "system", text: "Voice not supported in this browser." }); return; }
    const rec: SpeechRecognitionLike = new Ctor();
    recRef.current = rec;
    rec.continuous = true; rec.interimResults = false; rec.lang = "en-US";
    rec.onstart = () => setToast("Listening…");
    rec.onend   = () => setToast(micOn ? "…" : "");
    rec.onerror = () => setToast("Mic error");

    rec.onresult = async (e: any) => {
      const t = Array.from(e.results as any).map((r: any) => (r?.[0]?.transcript || "")).join(" ").trim();
      if (!t) return;
      setToast(`Heard: “${t}”`);
      bus.emit("chat:add", { role: "user", text: t });

      const { patch, action, message } = parseLocalIntent(t, worldRef.current);

      if (patch && Object.keys(patch).length) {
        worldRef.current = { ...worldRef.current, ...patch };
        bus.emit("world:update", patch);
      }
      if (action === "portal") {
        const target = lastHoverRef.current ?? { post: defaultPost, x: window.innerWidth - 56, y: window.innerHeight - 56 };
        bus.emit("orb:portal", target);
      }
      if (action === "leave") bus.emit("ui:leave", {});

      // If the phrase wasn't purely a local command, ask the model
      const onlyLocal = !!(message || action || (patch && Object.keys(patch).length));
      if (!onlyLocal || (!message && !action)) {
        const reply = await askModel(t);
        const text = reply || "Done.";
        bus.emit("chat:add", { role: "assistant", text });
        say(text);
        setToast(text);
      } else {
        const text = message || "Done.";
        bus.emit("chat:add", { role: "assistant", text });
        say(text);
        setToast(text);
      }

      setTimeout(() => setToast(""), 1500);
    };

    return () => { try { rec.stop(); } catch {} };
  }, [micOn]);

  const toggleMic = () => {
    const rec = recRef.current; if (!rec) return;
    try { if (micOn) { rec.stop(); setMicOn(false); setToast(""); } else { rec.start(); setMicOn(true); setToast("Listening…"); } } catch {}
  };

  const style = useMemo(() => ({ left: pos.x + "px", top: pos.y + "px", display: hidden ? "none" : undefined }), [pos, hidden]);

  return (
    <button className={`assistant-orb ${micOn ? "mic" : ""} ${flying ? "flying" : ""}`}
      style={style} aria-label="Assistant" title={micOn ? "Listening… (click to stop)" : "Assistant (click to talk)"} onClick={toggleMic}>
      <span className="assistant-orb__core" />
      <span className="assistant-orb__ring" />
      {toast && <span className="assistant-orb__toast">{toast}</span>}
    </button>
  );
}
