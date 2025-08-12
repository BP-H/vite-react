// src/components/World3D.tsx
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Html, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Post } from "./Feed2D";

function Knot() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.15;
    ref.current.rotation.y += dt * 0.25;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <torusKnotGeometry args={[1.4, 0.42, 200, 32]} />
      <meshStandardMaterial color="#3042ff" roughness={0.25} metalness={0.5} />
    </mesh>
  );
}

type Props = {
  selected: Post | null;
  onBack: () => void;
};

export default function World3D({ selected, onBack }: Props) {
  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <Canvas dpr={[1, 1.5]} camera={{ fov: 65, position: [0, 0, 5] }}>
        <color attach="background" args={["#06080f"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 3]} intensity={0.6} />
        <fog attach="fog" args={["#06080f", 8, 22]} />
        <Suspense fallback={null}>
          <Stars radius={60} depth={80} count={6000} factor={2} fade speed={1} />
          <Knot />
          {selected && (
            <Float>
              <Html center transform distanceFactor={10}>
                <div className="chip"
                     style={{ fontWeight: 700, color: "#fff", background: "rgba(0,0,0,.6)" }}>
                  {selected.title}<br />{selected.author}
                </div>
              </Html>
            </Float>
          )}
          <OrbitControls enablePan={false} />
        </Suspense>
      </Canvas>

      <div className="world-topbar">
        <button className="pill" onClick={onBack}>Back to Feed</button>
        {selected && <span className="crumb">Portal • {selected.title}</span>}
      </div>
    </div>
  );
}
