import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as React from "react";
import * as THREE from "three";
import { Post } from "../types";

function Knot() {
  const ref = React.useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    ref.current.rotation.x += dt * 0.2;
    ref.current.rotation.y += dt * 0.3;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <torusKnotGeometry args={[1.2, 0.35, 220, 32]} />
      <meshStandardMaterial color="#2f3af9" metalness={0.7} roughness={0.2} />
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
        <span className="crumb">Portal • {selected?.title ?? "World"}</span>
      </div>

      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4.5], fov: 55 }}>
        <color attach="background" args={["#0b0d12"]} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[6, 8, 3]} intensity={0.8} />
        <Knot />
        {selected && (
          <Html transform position={[0, 0, 1.9]}>
            <div className="hud">
              <div className="hud__title">{selected.title}</div>
              <div className="hud__by">{selected.author}</div>
            </div>
          </Html>
        )}
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
