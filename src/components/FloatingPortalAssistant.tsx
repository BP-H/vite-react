import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Orb() {
  const m = useRef<THREE.Mesh>(null!);
  useFrame((_, d) => {
    if (!m.current) return;
    m.current.rotation.x += 0.45 * d;
    m.current.rotation.y += 0.35 * d;
  });
  return (
    <mesh ref={m}>
      <icosahedronGeometry args={[0.9, 0]} />
      <meshStandardMaterial color="#b8a6ff" metalness={0.6} roughness={0.25} />
    </mesh>
  );
}

export default function FloatingPortalAssistant() {
  return (
    <div
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        width: 280,
        height: 180,
        zIndex: 40,
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid var(--line)',
        boxShadow: '0 18px 40px rgba(18,24,40,.18)',
        background: '#0a0b10',
      }}
    >
      <Canvas camera={{ position: [0, 0, 3.2], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
        <color attach="background" args={['#0a0b10']} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 3, 2]} intensity={0.9} />
        <Float speed={1} rotationIntensity={0.35} floatIntensity={0.9}>
          <Orb />
        </Float>
        <ContactShadows position={[0, -1, 0]} opacity={0.25} scale={10} blur={1.6} far={2} />
      </Canvas>
    </div>
  );
}
