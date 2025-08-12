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

/* -------------------- WHITE background void (feed) -------------------- */
function WhiteVoid() {
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
      <color attach="background" args={["#ffffff"]} />
      <fog attach="fog" args={["#ffffff", 60, 160]} />

      {/* barely-there parallax so the frost has something to blur */}
      <FaintRing />
      <FaintPlane y={-2} />
      <FaintPlane y={+2} />
    </Canvas>
  );
}

function FaintRing() {
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.02;
  });
  return (
    <mesh ref={ref} position={[0, 0, -14]}>
      <torusGeometry args={[10, 0.06, 8, 280]} />
      <meshBasicMaterial color="#e9f0ff" transparent opacity={0.18} />
    </mesh>
  );
}
function FaintPlane({ y }: { y: number }) {
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.position.x = Math.sin(performance.now() * 0.0002 + y) * 1.2;
  });
  return (
    <mesh ref={ref} position={[0, y, -10]}>
      <planeGeometry args={[40, 10]} />
      <meshBasicMaterial color="#f3f7ff" transparent opacity={0.35} />
    </mesh>
  );
}

/* -------------------- 3D WORLD (after portal) -------------------- */
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

/* -------------------- FEED (2D over white void) -------------------- */
function Feed2D({
  posts,
  onOpenWorld,
  portalizing,
}: {
  posts: Post[];
  onOpenWorld: (p: Post) => void;
  portalizing: boolean;
}) {
  return (
    <div className={`feed-shell ${portalizing ? "to-void" : ""}`}>
      {/* faint grid hint */}
      <div className="grid-overlay" aria-hidden />

      {/* sidebar */}
      <aside className="sidebar frost">
        <strong style={{ fontSize: 18 }}>Sidebar</strong>
        <button className="btn" onClick={() => onOpenWorld(posts[0])}>
          Open Portal
        </button>
      </aside>

      {/* feed rail */}
      <main className="rail">
        <div className="stack">
          {posts.map((p, idx) => (
            <article key={p.id} className={`card frost floating-${(idx % 3) + 1}`}>
              <header className="row">
                <strong>{p.author}</strong>
                <span className="muted">• demo</span>
              </header>

              <h3 className="title">{p.title}</h3>

              {/* frost window that shows the white void behind */}
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

      {/* portal overlay on top of feed during transition */}
      <div className={`portal-overlay ${portalizing ? "show" : ""}`} aria-hidden>
        <div className="vortex" />
      </div>
    </div>
  );
}

/* -------------------- App w/ “sucked into the void” transition -------------------- */
export default function App() {
  const [mode, setMode] = useState<"feed" | "world">("feed");
  const [selected, setSelected] = useState<Post | null>(null);
  const [portalizing, setPortalizing] = useState(false);

  function startPortal(p: Post) {
    setSelected(p);
    setPortalizing(true);

    // Wait while cards “suck” into the white void, then show world
    window.setTimeout(() => {
      setMode("world");
      // fade the white overlay out after the world appears
      window.setTimeout(() => setPortalizing(false), 400);
    }, 950);
  }

  return (
    <>
      {/* layer 0: white void for feed & transition */}
      {(mode === "feed" || portalizing) && <WhiteVoid />}

      {/* layer 1: UI */}
      {mode === "feed" ? (
        <Feed2D posts={demo} onOpenWorld={startPortal} portalizing={portalizing} />
      ) : (
        <World3D posts={demo} selected={selected} onExit={() => setMode("feed")} />
      )}
    </>
  );
}
