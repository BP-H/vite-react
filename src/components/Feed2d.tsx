import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";

type Props = {
  worldId: string;
  onBack: () => void;
};

function FloatingTile(props: { position: [number, number, number]; label: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, t) => {
    if (!ref.current) return;
    ref.current.position.y = props.position[1] + Math.sin(t + props.position[0]) * 0.2;
    ref.current.rotation.z = Math.sin(t * 0.3) * 0.05;
  });

  return (
    <group>
      <mesh ref={ref} position={props.position} castShadow>
        <boxGeometry args={[2.8, 1.4, 0.08]} />
        {/* Subtle gray so it reads in a white void */}
        <meshStandardMaterial color="#d0d3d8" roughness={0.7} metalness={0.05} />
      </mesh>
      <Html center position={[props.position[0], props.position[1], props.position[2] + 0.12]}>
        <div className="tile-label">{props.label}</div>
      </Html>
    </group>
  );
}

export default function World3D({ worldId, onBack }: Props) {
  return (
    <div className="world-root">
      <button className="back-pill" onClick={onBack}>
        Back to Feed
      </button>

      <div className="world-title">Portal • {worldId}</div>

      <Canvas
        className="world-canvas"
        shadows
        camera={{ position: [0, 2.2, 6], fov: 45 }}
        gl={{ antialias: true }}
      >
        {/* White void */}
        <color attach="background" args={["#ffffff"]} />
        <fog attach="fog" args={["#ffffff", 7, 26]} />

        <ambientLight intensity={0.6} />
        <directionalLight
          position={[4, 8, 6]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* A few floating "posts" in 3D */}
        <FloatingTile position={[-2.2, 0.2, 0]} label="@proto_ai • Prototype Moment" />
        <FloatingTile position={[0.5, -0.3, -0.6]} label="@neonfork • Symbolic Feed" />
        <FloatingTile position={[2.6, 0.4, 0.3]} label="@superNova_2177 • Ocean Study" />

        {/* Center piece (low-poly torus knot) */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <torusKnotGeometry args={[0.9, 0.22, 160, 12]} />
          <meshStandardMaterial color="#7c83ff" roughness={0.35} metalness={0.2} />
        </mesh>

        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
