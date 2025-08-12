import React, { useEffect, useState } from "react";
import bus from "../lib/bus";
type Row = { who: "you" | "ai"; text: string; partial?: boolean };

export default function ChatDock(){
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    const add = (r: Row) => setRows(prev => {
      // collapse partials
      if (r.partial) {
        const next = prev.slice();
        if (next.length && next[next.length-1].who === "you" && next[next.length-1].partial) {
          next[next.length-1] = r;
          return next;
        }
      }
      return [...prev, r].slice(-8);
    });
    bus.on("chat:add", add);
    return () => { bus.off("chat:add", add); };
  }, []);
  return (
    <div style={{
      position:"fixed", left:16, right:16, bottom:90, zIndex:60,
      display:"flex", gap:8, flexDirection:"column", pointerEvents:"none"
    }}>
      {rows.map((r,i)=>(
        <div key={i} style={{
          alignSelf: r.who==="you"?"flex-start":"flex-end",
          maxWidth: "70%", padding:"8px 10px", borderRadius:12,
          background: r.who==="you" ? "rgba(255,255,255,.08)" : "rgba(255,31,185,.18)",
          color:"#fff", backdropFilter:"blur(10px) saturate(140%)",
          border: "1px solid rgba(255,255,255,.12)"
        }}>
          {r.text}
          {r.partial && <span style={{opacity:.6}}> …</span>}
        </div>
      ))}
    </div>
  );
}
