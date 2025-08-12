// src/App.tsx
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Html, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type Post = { id: string; title: string; author: string };
const demo: Post[] = [
  { id: "1", title: "Prototype Moment", author: "@proto_ai" },
  { id: "2", title: "Symbolic Feed", author: "@neonfork" },
  { id: "3", title: "Ocean Study", author: "@superNova_2177" },
];

function WobblyKnot() {
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.15;
    ref.current.rotation.y += dt * 0.25;
  });
  return (
    <mesh ref={ref} position={[0, 1.5, -2]}>
      <torusKnotGeometry args={[0.8, 0.25, 128, 32]} />
      <meshLambertMaterial color="#8a7cff" flatShading />
    </mesh>
  );
}

// panel styles moved to CSS (.panel)

function RingPosts() {
  const R = 8;
  return (
    <group>
      {demo.map((p, i) => {
        const a = (i / demo.length) * Math.PI * 2;
        const pos: [number, number, number] = [
          Math.cos(a) * R,
          Math.sin(i) * 0.2,
          Math.sin(a) * R,
        ];
        return (
          <Float key={p.id} speed={1.5} rotationIntensity={0.1} floatIntensity={0.6}>
            <mesh position={pos} onClick={() => alert(`${p.title} by ${p.author}`)}>
              <planeGeometry args={[2.8, 1.6, 1, 1]} />
              <meshLambertMaterial color="#22263b" wireframe flatShading />
              <Html center transform distanceFactor={2.4}>
                <div className="panel">
                  <div style={{ fontWeight: 700 }}>{p.title}</div>
                  <div style={{ opacity: 0.7 }}>{p.author}</div>
                </div>
              </Html>
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

// button styles moved to CSS (.hud-btn)

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#07080d" }}>
      {/* 3D VOID */}
      <Canvas
        dpr={[1, 1.5]} // balances crispness + perf
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 65, position: [0, 1.2, 8] }}
        shadows={false}
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "auto" }}
      >
        <color attach="background" args={["#07080d"]} />
        <fog attach="fog" args={["#07080d", 8, 22]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 3]} intensity={0.6} />

        <Suspense fallback={null}>
          <Stars radius={60} depth={80} count={6000} factor={2} fade speed={1} />
          <WobblyKnot />
          <RingPosts />
          <OrbitControls enablePan={false} />
        </Suspense>
      </Canvas>

      {/* HUD overlay (kept minimal for now) */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ position: "absolute", top: 16, left: 16 }}>
          <button className="hud-btn" onClick={() => alert("VR mode next step 🚀")}>
            Enter Metaverse (VR soon)
          </button>
        </div>
      </div>
    </div>
  );
}
