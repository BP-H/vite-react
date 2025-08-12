// src/App.tsx
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Html, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/* -------------------- demo content -------------------- */
type Post = { id: string; title: string; author: string };
const demo: Post[] = [
  { id: "1", title: "Prototype Moment", author: "@proto_ai" },
  { id: "2", title: "Symbolic Feed", author: "@neonfork" },
  { id: "3", title: "Ocean Study", author: "@superNova_2177" },
];

/* -------------------- background void (shared) -------------------- */
function BackgroundVoid() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* deep, calm space */}
      <color attach="background" args={["#0b0e14"]} />
      <fog attach="fog" args={["#0b0e14", 40, 120]} />

      {/* subtle star field */}
      <Stars
        radius={70}
        depth={60}
        count={4500}
        factor={1.6}
        saturation={0}
        fade
        speed={0.15}
      />

      {/* faint wireframe ring just to suggest depth */}
      <Float speed={0.4} rotationIntensity={0.06} floatIntensity={0.06}>
        <mesh position={[0, 0, -12]} rotation={[0.4, 0.3, 0]}>
          <torusKnotGeometry args={[8, 0.35, 100, 16]} />
          <meshBasicMaterial color="#111827" wireframe transparent opacity={0.18} />
        </mesh>
      </Float>
    </Canvas>
  );
}

/* -------------------- small 3D bits for the world -------------------- */
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

function RingPosts({ posts }: { posts: Post[] }) {
  const R = 8;
  return (
    <group>
      {posts.map((p, i) => {
        const a = (i / posts.length) * Math.PI * 2;
        const pos: [number, number, number] = [
          Math.cos(a) * R,
          Math.sin(i) * 0.2,
          Math.sin(a) * R,
        ];
        return (
          <Float key={p.id} speed={1.5} rotationIntensity={0.1} floatIntensity={0.6}>
            <mesh position={pos}>
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

/* -------------------- 3D WORLD (after portal) -------------------- */
function World3D({
  posts,
  selected,
  onExit,
}: {
  posts: Post[];
  selected: Post | null;
  onExit: () => void;
}) {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 65, position: [0, 1.2, 8] }}
        shadows={false}
        style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "auto" }}
      >
        <color attach="background" args={["#07080d"]} />
        <fog attach="fog" args={["#07080d", 8, 22]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 3]} intensity={0.6} />
        <Suspense fallback={null}>
          <Stars radius={60} depth={80} count={6000} factor={2} fade speed={1} />
          <WobblyKnot />
          <RingPosts posts={posts} />
          <OrbitControls enablePan={false} />
        </Suspense>
      </Canvas>

      {/* HUD */}
      <div className="world-hud">
        <div className="chip frost">Portal {selected ? `• ${selected.title}` : ""}</div>
        <button className="btn-strong" onClick={onExit}>
          Back to Feed
        </button>
      </div>
    </div>
  );
}

/* -------------------- 2D FEED over the void -------------------- */
function Feed2D({
  posts,
  onOpenWorld,
}: {
  posts: Post[];
  onOpenWorld: (p: Post) => void;
}) {
  return (
    <div className="feed-shell">
      {/* grid hint overlay */}
      <div className="grid-overlay" aria-hidden />
      {/* sidebar + rail */}
      <aside className="sidebar frost">
        <strong style={{ fontSize: 18 }}>Sidebar</strong>
        <button className="btn" onClick={() => onOpenWorld(posts[0])}>
          Open Portal
        </button>
      </aside>

      <main className="rail">
        <div className="stack">
          {posts.map((p, idx) => (
            <article key={p.id} className={`card frost floating-${(idx % 3) + 1}`}>
              <header className="row">
                <strong>{p.author}</strong>
                <span className="muted">• demo</span>
              </header>

              <h3 className="title">{p.title}</h3>

              {/* this block is intentionally transparent+frosted so the void shows through */}
              <div
                className="media frost hover-lift"
                role="img"
                aria-label={`${p.title} preview`}
                title="Enter world"
                onClick={() => onOpenWorld(p)}
              />

              <footer className="row gap">
                <button className="btn" onClick={() => onOpenWorld(p)}>
                  Enter world
                </button>
                <button className="chip">Like</button>
                <button className="chip">Share</button>
              </footer>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

/* -------------------- App -------------------- */
export default function App() {
  const [mode, setMode] = useState<"feed" | "world">("feed");
  const [selected, setSelected] = useState<Post | null>(null);

  return (
    <>
      {/* layer 0: ever-present void behind everything */}
      <BackgroundVoid />

      {/* layer 1: UI */}
      {mode === "feed" ? (
        <Feed2D
          posts={demo}
          onOpenWorld={(p) => {
            setSelected(p);
            setMode("world");
          }}
        />
      ) : (
        <World3D posts={demo} selected={selected} onExit={() => setMode("feed")} />
      )}
    </>
  );
}
