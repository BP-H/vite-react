// src/components/World3D.tsx
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import type { Post } from "./Feed2D";

function Knot() {
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.25;
    ref.current.rotation.y += dt * 0.15;
  });
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1.2, 0.35, 120, 16]} />
      <meshStandardMaterial color="#6a73ff" metalness={0.3} roughness={0.25} />
    </mesh>
  );
}

export default function World3D({
  selected,
  onBack,
}: {
  selected: Post | null;
  onBack: () => void;
}) {
  return (
    <div className="world-wrap">
      <div className="world-topbar">
        <button className="pill" onClick={onBack}>Back to Feed</button>
        {selected && <span className="crumb">Portal • {selected.title}</span>}
      </div>

      <Canvas
        dpr={[1, 1.5]}
        camera={{ fov: 60, position: [0, 1.2, 6] }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#07080d"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 3]} intensity={0.6} />

        <Stars radius={60} depth={80} count={6000} factor={2} fade speed={1} />
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.6}>
          <Knot />
        </Float>

        {selected && (
          <Html center>
            <div
              style={{
                background: "rgba(0,0,0,.6)",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,.15)",
              }}
            >
              {selected.title} — {selected.author}
            </div>
          </Html>
        )}

        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
