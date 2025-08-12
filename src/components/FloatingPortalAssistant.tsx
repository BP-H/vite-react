// src/components/FloatingPortalAssistant.tsx
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function Orb() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, d) => { ref.current.rotation.y += 0.6 * d; ref.current.rotation.x += 0.15 * d; });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.9, 0]} />
      <meshStandardMaterial color="#b9b5ff" metalness={0.4} roughness={0.25} />
    </mesh>
  );
}

export default function FloatingPortalAssistant() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [drag, setDrag] = useState<{ x:number; y:number } | null>(null);
  const [pos, setPos] = useState<{ x:number; y:number }>({ x: 22, y: 22 });

  const onPointerDown = (e: React.PointerEvent) => {
    const wrap = wrapRef.current; if (!wrap) return;
    wrap.setPointerCapture(e.pointerId);
    setDrag({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    setPos({ x: Math.max(8, window.innerWidth - (e.clientX - drag.x) - 64), y: Math.max(8, e.clientY - drag.y) });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const wrap = wrapRef.current; if (wrap) wrap.releasePointerCapture(e.pointerId);
    setDrag(null);
  };

  return (
    <div
      ref={wrapRef}
      className="assist-wrap"
      style={{ right: pos.x, bottom: pos.y }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="assist-orb" onClick={() => setOpen((v) => !v)} title="Open assistant">
        <Canvas dpr={[1, 1.5]} gl={{ antialias: true }} camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[2, 3, 2]} intensity={0.9} />
          {/* soft background */}
          <color attach="background" args={["#0c0f16"]} />
          <Orb />
        </Canvas>
      </div>

      {open && (
        <div className="assist-pop">
          <div className="assist-head">superNova Assistant</div>
          <div className="assist-body">
            <div className="muted">How can I help?</div>
            <div style={{ height: 8 }} />
            <div>• Try: “Summarize my latest posts”</div>
            <div>• Or: “Draft an announcement with neon tone”</div>
          </div>
          <div style={{ padding: 10, borderTop: "1px solid var(--line)" }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Hook this up to your API later ✨");
              }}
            >
              <div className="assist-row">
                <input className="assist-input" placeholder="Ask anything…" />
                <button className="btn btn--primary" type="submit">Send</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
