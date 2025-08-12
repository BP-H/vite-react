import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

export type Post = { id: string; title: string; author: string };
type Props = { post: Post; onBack: () => void };

function Wobbly({ color = "#6e6bff" }) {
  const m = useRef<THREE.Mesh | null>(null);
  useFrame((_, dt) => {
    if (!m.current) return;
    m.current.rotation.x += 0.2 * dt;
    m.current.rotation.y += 0.3 * dt;
  });
  return (
    <mesh ref={m}>
      <torusKnotGeometry args={[0.9, 0.26, 160, 24]} />
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.35} />
    </mesh>
  );
}

function WorldLabel({ children }: { children: string }) {
  return (
    <Html center distanceFactor={6}>
      <div className="world-label">{children}</div>
    </Html>
  );
}

export default function World3D({ post, onBack }: Props) {
  return (
    <div className="world">
      <div className="world__hud">
        <span className="badge">Portal • {post.title}</span>
        <button className="chip" onClick={onBack}>Back to Feed</button>
      </div>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.8, 5.5], fov: 60 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#f7f8fb"]} />
        <fog attach="fog" args={["#f7f8fb", 10, 40]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 2]} intensity={0.75} />
        <Suspense fallback={null}>
          <Stars radius={60} depth={20} count={800} factor={2} fade speed={0.15} />
          <Float speed={1} rotationIntensity={0.25} floatIntensity={0.6}>
            <group position={[0, 0.4, 0]}>
              <Wobbly />
            </group>
          </Float>
          <WorldLabel>{post.author}</WorldLabel>
          <OrbitControls enablePan={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
