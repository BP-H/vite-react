import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';

type Variant = 'knot' | 'cube' | 'ico';

function Knot() {
  const m = useRef<THREE.Mesh>(null!);
  useFrame((_, d) => { m.current.rotation.y += 0.6 * d; });
  return (
    <mesh ref={m}>
      <torusKnotGeometry args={[0.6, 0.18, 120, 16]} />
      <meshStandardMaterial color="#b8a6ff" metalness={0.6} roughness={0.25} />
    </mesh>
  );
}
function Cube() {
  const m = useRef<THREE.Mesh>(null!);
  useFrame((_, d) => { m.current.rotation.x += 0.5 * d; m.current.rotation.y += 0.35 * d; });
  return (
    <mesh ref={m}>
      <boxGeometry args={[1,1,1]} />
      <meshStandardMaterial color="#7dd3fc" metalness={0.2} roughness={0.4} />
    </mesh>
  );
}
function Ico() {
  const m = useRef<THREE.Mesh>(null!);
  useFrame((_, d) => { m.current.rotation.z -= 0.45 * d; });
  return (
    <mesh ref={m}>
      <icosahedronGeometry args={[0.9, 0]} />
      <meshStandardMaterial color="#f0abfc" metalness={0.1} roughness={0.7} />
    </mesh>
  );
}

export default function ThreeCard({ variant = 'knot' as Variant }) {
  return (
    <div className="canvasWrap">
      <Canvas camera={{ position:[0,0,3.2], fov:50 }} dpr={[1, 1.5]} gl={{ antialias:false }}>
        <color attach="background" args={['#0a0b10']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[2,3,2]} intensity={0.8} />
        <Float speed={1} rotationIntensity={0.35} floatIntensity={0.9}>
          {variant === 'knot' ? <Knot/> : variant === 'cube' ? <Cube/> : <Ico/>}
        </Float>
        <ContactShadows position={[0,-1,0]} opacity={0.25} scale={10} blur={1.6} far={2} />
      </Canvas>
    </div>
  );
}
