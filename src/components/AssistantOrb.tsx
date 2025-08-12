// src/components/AssistantOrb.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import bus from "../lib/bus";
import { Post } from "../types";

/** shim just for Web Speech recognition (do NOT redeclare speechSynthesis) */
declare global { interface Window { webkitSpeechRecognition?: any; SpeechRecognition?: any; } }
type SpeechRecognitionLike = any;

const FLY_MS = 600;
const DEFAULT_POST: Post = { id: -1, author: "@proto_ai", title: "Prototype Moment", image: "" };

export default function AssistantOrb({
  onPortal,
  hidden = false,
}: {
  onPortal: (post: Post, at: { x: number; y: number }) => void;
  hidden?: boolean;
}) {
  // ---- positioning / flight ------------------------------------------------
  const dock = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [pos, setPos] = useState(() => {
    const x = window.innerWidth - 76, y = window.innerHeight - 76;
    dock.current = { x, y };
    return { x, y };
  });
  const [flying, setFlying] = useState(false);

  useEffect(() => {
    const onR = () => {
      const x = window.innerWidth - 76, y = window.innerHeight - 76;
      dock.current = { x, y };
      if (!flying) setPos({ x, y });
    };
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, [flying]);

  // Feed tells orb to fly → then we trigger the portal callback
  useEffect(() => {
    return bus.on("orb:portal", (payload: { post: Post; x: number; y: number }) => {
      setFlying(true);
      setPos({ x: payload.x, y: payload.y });
      window.setTimeout(() => {
        onPortal(payload.post, { x: payload.x, y: payload.y });
        setPos({ ...dock.current });
        window.setTimeout(() => setFlying(false), 350);
      }, FLY_MS);
    });
  }, [onPortal]);

  // ---- voice: continuous listen + talk back --------------------------------
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const listeningRef = useRef(false);
  const speakingRef = useRef(false);
  const restartOnEndRef = useRef(false);
  const lastHoverRef = useRef<{ post: Post; x: number; y: number } | null>(null);

  const [micOn, setMicOn] = useState(false);
  const [toast, setToast] = useState("");

  // let orb know which card you're on so "enter world" can target it
  useEffect(() => bus.on("feed:hover", (p) => (lastHoverRef.current = p)), []);

  // request mic once so browser remembers permission for this origin
  async function ensureMic(): Promise<boolean> {
    try {
      const stAny = (navigator as any).permissions?.query
        ? await (navigator as any).permissions.query({ name: "microphone" as any })
        : null;
      if (stAny?.state === "denied") return false;
    } catch {}
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      s.getTracks().forEach(t => t.stop());
      return true;
    } catch {
      return false;
    }
  }

  // speak helper — pause recognition during TTS to avoid feedback
  function speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      try {
        const synth = window.speechSynthesis as any;
        const Utter = (window as any).SpeechSynthesisUtterance;
        if (!synth || !Utter) return resolve();
        synth.cancel();
        const u = new Utter(text);
        const v = synth.getVoices?.().find((vv: any) => vv?.lang?.startsWith?.("en"));
        if (v) u.voice = v;
        u.rate = 1; u.pitch = 1; u.lang = "en-US";
        u.onstart = () => { speakingRef.current = true; try { recRef.current?.stop(); } catch {} };
        u.onend   = () => { speakingRef.current = false; if (micOn) try { recRef.current?.start(); } catch {}; resolve(); };
        synth.speak(u);
      } catch { resolve(); }
    });
  }

  // recognizer lifecycle (one instance)
  useEffect(() => {
    const Ctor = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!Ctor) { setToast("Voice not supported"); return; }
    const rec: SpeechRecognitionLike = new Ctor();
    recRef.current = rec;
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => { listeningRef.current = true; setToast("Listening…"); };
    rec.onerror = () => { setToast("Mic error"); };
    rec.onend = () => {
      listeningRef.current = false;
      setToast(micOn ? "…" : "");
      if (restartOnEndRef.current && !speakingRef.current) {
        try { rec.start(); } catch {}
      }
    };

    rec.onresult = async (e: any) => {
      // interim bubble
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (!r.isFinal) interim += (r[0]?.transcript || "");
      }
      if (interim) setToast(`…${interim.trim()}`);

      // final text
      const finals = Array.from(e.results as any).filter((r: any) => r.isFinal);
      if (!finals.length) return;
      const final = finals.map((r: any) => r[0]?.transcript || "").join(" ").trim();
      if (!final) return;

      bus.emit("chat:add", { role: "user", text: final });

      // very small command router
      const t = final.toLowerCase();
      if ((/enter|open/.test(t)) && /(world|portal|void)/.test(t)) {
        const target = lastHoverRef.current ?? { post: DEFAULT_POST, x: window.innerWidth - 56, y: window.innerHeight - 56 };
        bus.emit("orb:portal", target);
        await speak("Entering world.");
        setToast(""); return;
      }
      if ((/leave|exit|back/.test(t)) && /(world|portal|feed|void)/.test(t)) {
        bus.emit("ui:leave", {});
        await speak("Back to feed.");
        setToast(""); return;
      }

      // fallback "assistant" reply — replace with your /api call when ready
      const reply = "Got it.";
      bus.emit("chat:add", { role: "assistant", text: reply });
      await speak(reply);
      setToast("");
    };

    return () => { try { rec.stop(); } catch {} };
  }, [micOn]);

  async function startListening() {
    const ok = await ensureMic();
    if (!ok) {
      setToast("Mic blocked — allow in site settings");
      bus.emit("chat:add", { role: "system", text: "Microphone blocked. Click the padlock → allow microphone." });
      return;
    }
    restartOnEndRef.current = true;
    try { recRef.current?.start(); setMicOn(true); } catch {}
  }
  function stopListening() {
    restartOnEndRef.current = false;
    try { recRef.current?.stop(); } catch {}
    setMicOn(false);
    setToast("");
  }
  const toggleMic = () => (micOn ? stopListening() : startListening());

  // ---- render --------------------------------------------------------------
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
