import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import bus from "../lib/bus"; // your event bus
import "./AssistantOrb.css";   // styles below

type Mode = "idle" | "listening" | "speaking";

export default function AssistantOrb() {
  const [mode, setMode] = useState<Mode>("idle");
  const [toast, setToast] = useState<string>("");
  const streamRef = useRef<MediaStream | null>(null);
  const recogRef = useRef<any>(null);
  const autoContinueRef = useRef<boolean>(true);
  const ttsBusyRef = useRef<boolean>(false);
  const ttsQueueRef = useRef<string[]>([]);
  const firstGestureRef = useRef<boolean>(false);

  // --- helpers -------------------------------------------------------------
  const ensureGestureUnlockedAudio = useCallback(async () => {
    // Calling speechSynthesis/AudioContexts after a user gesture prevents most autoplay blocks
    if (!firstGestureRef.current) {
      try { window.speechSynthesis.cancel(); } catch {}
      firstGestureRef.current = true;
    }
  }, []);

  const getMicOnce = useCallback(async () => {
    if (streamRef.current) return streamRef.current;
    // Mic access requires HTTPS or localhost
    if (!location.hostname.includes("localhost") && location.protocol !== "https:") {
      setToast("Microphone needs HTTPS. Deploy on Vercel/https or test on localhost.");
      return null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      return stream;
    } catch (err) {
      setToast("Microphone permission was denied.");
      console.error(err);
      return null;
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!text) return;
    ttsQueueRef.current.push(text);
    processQueue();
  }, []);

  const processQueue = useCallback(() => {
    if (ttsBusyRef.current) return;
    const text = ttsQueueRef.current.shift();
    if (!text) return;

    ttsBusyRef.current = true;
    setMode("speaking");

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.onend = () => {
      ttsBusyRef.current = false;
      setMode("idle");
      processQueue();
    };
    try {
      window.speechSynthesis.cancel(); // drop any stale utterances
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.error(e);
      ttsBusyRef.current = false;
      setMode("idle");
    }
  }, []);

  const showYouSaid = (text: string, partial = false) => {
    bus.emit("chat:add", { who: "you", text, partial });
  };
  const showAssistantSaid = (text: string) => {
    bus.emit("chat:add", { who: "ai", text });
  };

  // --- Recognition wiring --------------------------------------------------
  const startListening = useCallback(async () => {
    await ensureGestureUnlockedAudio();
    const stream = await getMicOnce();
    if (!stream) return;

    const SR: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setToast("SpeechRecognition not supported. (Chrome desktop works best.)");
      return;
    }
    if (!recogRef.current) {
      const recog = new SR();
      recog.lang = "en-US";
      recog.continuous = true;       // keep going
      recog.interimResults = true;   // partial captions
      recog.onstart = () => setMode("listening");
      recog.onerror = (e: any) => console.warn("recog error", e);
      recog.onresult = (ev: any) => {
        // last result
        const res = ev.results[ev.results.length - 1];
        const text = res[0].transcript.trim();
        if (res.isFinal) {
          showYouSaid(text, false);
          // TODO: call your backend here with `text`
          // Simulate answer:
          const reply = planActionAndGenerateReply(text);
          showAssistantSaid(reply);
          speak(reply);
        } else {
          showYouSaid(text, true);
        }
      };
      recog.onend = () => {
        setMode("idle");
        if (autoContinueRef.current) {
          // small delay helps avoid “end loop” spam
          setTimeout(() => {
            try { recog.start(); } catch {}
          }, 150);
        }
      };
      recogRef.current = recog;
    }

    try {
      recogRef.current.start();
    } catch {
      // start can throw if already started — harmless
    }
  }, [ensureGestureUnlockedAudio, getMicOnce]);

  const stopListening = useCallback(() => {
    autoContinueRef.current = false;
    try { recogRef.current?.stop(); } catch {}
    setMode("idle");
  }, []);

  const toggle = useCallback(() => {
    if (mode === "listening") stopListening();
    else {
      autoContinueRef.current = true;
      startListening();
    }
  }, [mode, startListening, stopListening]);

  // Minimal “intent router” so you can change the 3D world by speaking
  function planActionAndGenerateReply(text: string): string {
    const t = text.toLowerCase();
    if (t.includes("enter world") || t.includes("go inside")) {
      bus.emit("world:enter");
      return "Jumping into the world.";
    }
    if (t.includes("leave world") || t.includes("back")) {
      bus.emit("world:leave");
      return "Okay, taking you back to the feed.";
    }
    const m = t.match(/color (?:of|for)? (?:players|balls) to (\w+)/);
    if (m) {
      bus.emit("world:setPlayerColor", m[1]);
      return `Changing player colors to ${m[1]}.`;
    }
    return "Got it.";
  }

  // Clean up
  useEffect(() => () => {
    try { recogRef.current?.stop(); } catch {}
    streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  return (
    <>
      <button
        className={`assistant-orb ${mode === "listening" ? "mic" : ""}`}
        onClick={toggle}
        aria-label="Voice Assistant"
        title="Voice Assistant"
      >
        <div className="assistant-orb__ring" />
        <div className="assistant-orb__core sn-logo" />
        {toast && <div className="assistant-orb__toast">{toast}</div>}
      </button>
    </>
  );
}
