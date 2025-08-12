// src/three/BackgroundVoid.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';

function Knot() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.2;
    ref.current.rotation.y += dt * 0.3;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={ref} position={[0, 0, -0.6]}>
        <torusKnotGeometry args={[1.2, 0.35, 220, 32]} />
        <meshStandardMaterial
          color={'#6a73ff'}
          roughness={0.2}
          metalness={0.4}
          emissive={'#1d1f3d'}
          emissiveIntensity={0.25}
        />
      </mesh>
    </Float>
  );
}

export default function BackgroundVoid() {
  return (
    <div
      className="bg-void"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
        {/* starfield + deep space color */}
        <color attach="background" args={['#06080f']} />
        <hemisphereLight intensity={0.35} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <Stars radius={60} depth={40} factor={2} fade />
        <Knot />
        {/* orbit controls for subtle drift when in background; no user input */}
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
