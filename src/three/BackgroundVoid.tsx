// src/three/BackgroundVoid.tsx
import * as THREE from "three";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, OrbitControls } from "@react-three/drei";

function Knot() {
  const mesh = useRef<THREE.Mesh | null>(null);
  useFrame((_, dt) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += dt * 0.25;
    mesh.current.rotation.y += dt * 0.15;
  });
  return (
    <mesh ref={mesh}>
      <torusKnotGeometry args={[1.25, 0.35, 120, 10]} />
      <meshStandardMaterial color="#a6a8ff" roughness={1} metalness={0} />
    </mesh>
  );
}

/** fixed, non-interactive background canvas */
export default function BackgroundVoid() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true }}
      >
        {/* light white-ish scene */}
        <color attach="background" args={["#f6f7fb"]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={0.4} />
        <Stars radius={60} depth={80} count={1200} factor={2} fade />
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.6}>
          <Knot />
        </Float>
        {/* Keep controls but disable interactions so it never eats pointer events */}
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
