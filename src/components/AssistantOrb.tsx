import { useEffect, useMemo, useRef, useState } from "react";
import bus from "../lib/bus";
import { Post } from "../types";

type Props = {
  onPortal: (post: Post, at: { x: number; y: number }) => void;
};

const FLY_MS = 600;

export default function AssistantOrb({ onPortal }: Props) {
  const dock = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    const x = window.innerWidth - 76;
    const y = window.innerHeight - 76;
    dock.current = { x, y };
    return { x, y };
  });
  const [micOn, setMicOn] = useState(false);
  const recRef = useRef<SpeechRecognition | null>(null);
  const lastHoverRef = useRef<{ post: Post; x: number; y: number } | null>(null);
  const [flying, setFlying] = useState(false);

  // keep dock position in bottom-right on resize
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

  // listen to feed hover (so voice can act on “the current one”)
  useEffect(() => {
    return bus.on("feed:hover", (p) => (lastHoverRef.current = p));
  }, []);

  // listen: feed asks the orb to fly to an image and portal
  useEffect(() => {
    return bus.on("orb:portal", (payload: { post: Post; x: number; y: number }) => {
      setFlying(true);
      setPos({ x: payload.x, y: payload.y });
      setTimeout(() => {
        onPortal(payload.post, { x: payload.x, y: payload.y });
        // glide back to dock
        setPos({ ...dock.current });
        setTimeout(() => setFlying(false), 350);
      }, FLY_MS);
    });
  }, [onPortal]);

  // simple speech: “enter world” triggers current hovered card
  useEffect(() => {
    const AnyRec: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!AnyRec) return;
    const rec: SpeechRecognition = new AnyRec();
    recRef.current = rec;
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript.toLowerCase()).join(" ");
      if (t.includes("enter") && (t.includes("world") || t.includes("portal"))) {
        const p = lastHoverRef.current;
        if (p) bus.emit("orb:portal", p);
      }
    };
    return () => rec.stop();
  }, []);

  const toggleMic = () => {
    if (!recRef.current) return;
    if (micOn) {
      recRef.current.stop();
      setMicOn(false);
    } else {
      try { recRef.current!.start(); setMicOn(true); } catch {}
    }
  };

  const style = useMemo(() => ({ left: pos.x + "px", top: pos.y + "px" }), [pos]);

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
