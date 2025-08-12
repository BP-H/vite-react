// src/App.tsx
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Html, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type Post = { id: string; title: string; author: string };
const demo: Post[] = [
  { id: "1", title: "Prototype Moment", author: "@proto_ai" },
  { id: "2", title: "Symbolic Feed", author: "@neonfork" },
  { id: "3", title: "Ocean Study", author: "@superNova_2177" },
];

/* ---------- tiny 3D bits ---------- */
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

/* ---------- 3D world screen ---------- */
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
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "auto" }}
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

      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          display: "flex",
          gap: 12,
          zIndex: 1,
        }}
      >
        <div
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #2b3146",
            background: "#12182a",
            color: "#e9ecf1",
          }}
        >
          {selected ? (
            <>
              Entering: <strong>{selected.title}</strong>
            </>
          ) : (
            <>Portal</>
          )}
        </div>
        <button
          onClick={onExit}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #2b3146",
            background: "#fff",
            color: "#0e1220",
            fontWeight: 700,
          }}
        >
          Back to Feed
        </button>
      </div>
    </div>
  );
}

/* ---------- 2D feed screen ---------- */
function Feed2D({
  posts,
  onOpenWorld,
}: {
  posts: Post[];
  onOpenWorld: (p: Post) => void;
}) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#fff",
        display: "grid",
        gridTemplateColumns: "280px 1fr",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          borderRight: "1px solid #e8ecf2",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <strong style={{ fontSize: 18 }}>Sidebar</strong>
        <button
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #dde3ee",
            background: "#f7f9fc",
            fontWeight: 600,
          }}
          onClick={() => onOpenWorld(posts[0])}
        >
          Open Portal
        </button>
      </aside>

      {/* Feed rail */}
      <main
        style={{
          position: "relative",
          overflow: "auto",
          padding: "24px clamp(16px, 4vw, 40px)",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.02))",
        }}
      >
        {/* frosted grid hint */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(transparent 23px, rgba(0,0,0,0.06) 24px), linear-gradient(90deg, transparent 23px, rgba(0,0,0,0.06) 24px)",
            backgroundSize: "24px 24px",
            opacity: 0.06,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 820,
            margin: "0 auto",
            display: "grid",
            gap: 16,
          }}
        >
          {posts.map((p) => (
            <article
              key={p.id}
              style={{
                borderRadius: 14,
                border: "1px solid #e8ecf2",
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 10px 30px rgba(16,24,40,0.06)",
                padding: 14,
              }}
            >
              <header style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <strong>{p.author}</strong>
                <span style={{ color: "#73839b" }}>• demo</span>
              </header>
              <h3 style={{ margin: "8px 0 12px" }}>{p.title}</h3>
              <div
                role="img"
                aria-label={`${p.title} preview`}
                onClick={() => onOpenWorld(p)}
                title="Enter world"
                style={{
                  height: 180,
                  borderRadius: 10,
                  border: "1px solid #e8ecf2",
                  background:
                    "linear-gradient(135deg, #eef2ff, #eaf7ff 60%, #fff)",
                  cursor: "pointer",
                }}
              />
              <footer style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button
                  onClick={() => onOpenWorld(p)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid #d8e0ee",
                    background: "#f7f9fc",
                    fontWeight: 600,
                  }}
                >
                  Enter world
                </button>
                <button
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid #d8e0ee",
                    background: "#fff",
                  }}
                >
                  Like
                </button>
                <button
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid #d8e0ee",
                    background: "#fff",
                  }}
                >
                  Share
                </button>
              </footer>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [mode, setMode] = useState<"feed" | "world">("feed");
  const [selected, setSelected] = useState<Post | null>(null);

  return mode === "feed" ? (
    <Feed2D
      posts={demo}
      onOpenWorld={(p) => {
        setSelected(p);
        setMode("world");
      }}
    />
  ) : (
    <World3D posts={demo} selected={selected} onExit={() => setMode("feed")} />
  );
}
