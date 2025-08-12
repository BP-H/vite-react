import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

type Props = {
  worldId: string | null;
  onBack: () => void;
};

function Knot() {
  return (
    <mesh>
      <torusKnotGeometry args={[1, 0.35, 256, 32]} />
      <meshStandardMaterial color="#5b5ce2" roughness={0.4} metalness={0.2} />
    </mesh>
  );
}

export default function World3d({ worldId, onBack }: Props) {
  return (
    <div className="world3d">
      <div className="topbar">
        <span className="crumbs">Portal • {worldId ?? "World"}</span>
        <button className="pill" onClick={onBack}>
          Back to Feed
        </button>
      </div>

      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        {/* 3D "void" (dark to feel deep; switchable to pure white if you prefer) */}
        <color attach="background" args={["#0b0b0d"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <Knot />
          <Stars radius={60} depth={40} factor={2} />
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
