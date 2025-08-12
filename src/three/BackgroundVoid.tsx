// src/three/BackgroundVoid.tsx
import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

/** super-light star field (no postprocessing, very mobile friendly) */
function Stars({ count = 6000, radius = 70 }) {
  const points = useRef<THREE.Points | null>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // random point on a sphere shell (uniform-ish)
      const r = THREE.MathUtils.randFloat(radius * 0.6, radius);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2)); // 0..pi
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      arr.set([x, y, z], i * 3);
    }
    return arr;
  }, [count, radius]);

  useFrame((_, dt) => {
    if (points.current) points.current.rotation.y += dt * 0.015;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} sizeAttenuation color="#8b8bff" depthWrite={false} />
    </points>
  );
}

/** a slow-spinning torus-knot as an anchor in the void */
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
      <meshStandardMaterial color="#9b8cff" roughness={1} metalness={0} flatShading />
    </mesh>
  );
}

/** fixed, non-interactive background canvas */
export default function BackgroundVoid() {
  return (
    <Canvas
      id="bg3d"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ antialias: true }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 1);
        scene.fog = new THREE.Fog(0x000000, 40, 140);
      }}
    >
      {/* lights kept super minimal so it never overdraws the UI */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 2]} intensity={1.1} />

      <Stars count={6000} radius={75} />
      <group position={[0, 0, 0]}>
        <Knot />
      </group>
    </Canvas>
  );
}
