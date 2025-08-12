import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { Post } from "../types";

function Knot() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.2;
    ref.current.rotation.y += dt * 0.3;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={ref} position={[0, 0, 0]}>
        <torusKnotGeometry args={[1.2, 0.35, 220, 32]} />
        <meshStandardMaterial color="#2447ff" roughness={0.35} metalness={0.6} />
      </mesh>
    </Float>
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
        <button className="primary" onClick={onBack}>Back to Feed</button>
        <span className="crumb">Portal • {selected?.title || "…"}</span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ height: "calc(100vh - 48px)" }}
      >
        <color attach="background" args={["#05060a"]} />
        <hemisphereLight intensity={0.35} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <Stars radius={60} depth={40} factor={2} fade />

        <Knot />

        {selected && (
          <Html position={[0, -2.1, 0]} transform>
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 12,
                background: "rgba(0,0,0,.55)",
                color: "#fff",
                fontWeight: 800,
                boxShadow: "0 10px 30px rgba(0,0,0,.35)",
                backdropFilter: "blur(6px)",
                whiteSpace: "nowrap",
              }}
            >
              {selected.title} <br /> <span style={{ opacity: 0.8 }}>{selected.author}</span>
            </div>
          </Html>
        )}

        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
