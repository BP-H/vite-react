// src/components/World3D.tsx
import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, Instances, Instance, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Post } from "../types";

function FloorGrid() {
  const geo = useMemo(() => new THREE.PlaneGeometry(240, 240, 120, 120), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, -8]} geometry={geo}>
      <meshBasicMaterial color="#e5eaf4" wireframe transparent opacity={0.18} />
    </mesh>
  );
}

function PeopleRing() {
  const count = 14;
  const positions = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        const r = 7.2;
        return [Math.cos(a) * r, Math.sin(a) * 0.6, -10 - (i % 3) * 0.35] as [number, number, number];
      }),
    []
  );
  return (
    <Instances limit={count}>
      <sphereGeometry args={[0.26, 32, 32]} />
      <meshStandardMaterial
        color="#8e96ff"
        emissive="#b6bcff"
        emissiveIntensity={0.16}
        roughness={0.25}
        metalness={0.55}
      />
      {positions.map((p, i) => (
        <Float key={i} floatIntensity={0.6} rotationIntensity={0.25} speed={0.9 + (i % 4) * 0.15}>
          <Instance position={p} />
        </Float>
      ))}
    </Instances>
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
    <div className="world-wrap" style={{ position: "relative" }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0.2, 7], fov: 50 }} style={{ height: "100vh" }}>
        {/* Bright minimalist void */}
        <color attach="background" args={["#f6f8fb"]} />
        <fog attach="fog" args={["#f1f4fa", 12, 44]} />
        <ambientLight intensity={1.0} />
        <directionalLight position={[5, 8, 3]} intensity={0.65} />

        <FloorGrid />
        <PeopleRing />

        <OrbitControls enablePan={false} />
      </Canvas>

      {/* Bottom glass bar (no top UI) */}
      <div className="world-bottombar">
        <button className="pill" onClick={onBack}>Back to Feed</button>
        {selected && <span className="crumb">Portal • {selected.title}</span>}
      </div>
    </div>
  );
}
