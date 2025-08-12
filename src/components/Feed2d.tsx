import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { memo, useMemo, useRef } from "react";
import * as THREE from "three";

export type WorldKind = "void" | "knots" | "ocean";

export type PostCard = {
  id: string;
  handle: string;
  title: string;
  demo?: boolean;
  world: WorldKind;
  palette: [string, string, string]; // base, mid, accent
};

export default function Feed2D({
  posts,
  onEnterWorld,
}: {
  posts: PostCard[];
  onEnterWorld: (post: PostCard, start: { x: number; y: number }) => void;
}) {
  return (
    <div className="feed-wrap">
      <div className="feed-header">
        <h1>Feed</h1>
        <div className="sweep" />
      </div>

      <div className="cards">
        {posts.map((p) => (
          <article key={p.id} className="card frosted">
            <header className="card-head">
              <div className="byline">
                <span className="handle">{p.handle}</span>
                {p.demo && <span className="dot">•</span>}
                {p.demo && <span className="demo">demo</span>}
              </div>
              <h2>{p.title}</h2>
            </header>

            <div className="card-canvas">
              <MiniWorldCanvas kind={p.world} palette={p.palette} />
            </div>

            <footer className="card-actions">
              <button
                className="pill"
                onClick={(e) =>
                  onEnterWorld(p, { x: e.clientX ?? window.innerWidth / 2, y: e.clientY ?? 0 })
                }
              >
                Enter world
              </button>
              <button className="pill ghost">Like</button>
              <button className="pill ghost">Share</button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}

/** Mini worlds: true 3D, composed to read as “2D frosted tiles”. */
const MiniWorldCanvas = memo(function MiniWorldCanvas({
  kind,
  palette,
}: {
  kind: WorldKind;
  palette: [string, string, string];
}) {
  return (
    <Canvas
      orthographic
      dpr={[1, 2]}
      camera={{ position: [0, 0, 100], zoom: 70 }}
      gl={{ antialias: true }}
      className="mini-canvas"
    >
      <color attach="background" args={["transparent"]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 8]} intensity={0.6} />
      <directionalLight position={[-3, -2, 5]} intensity={0.4} />

      {/* grid hint that “peeks” through the glass */}
      <GridBackdrop tint={palette[1]} />

      {kind === "void" && <FloatingPlaceholders tint={palette[2]} />}
      {kind === "knots" && <KnotCluster color={palette[2]} />}
      {kind === "ocean" && <WavyPlane color={palette[2]} />}

      {/* Controls disabled visually, but keeps camera stable on mobile */}
      <OrbitControls enableRotate={false} enableZoom={false} enablePan={false} />
    </Canvas>
  );
});

function GridBackdrop({ tint = "#dfe6f2" }) {
  const g = useMemo(() => new THREE.TextureLoader().load(
    // a tiny data-URI-ish procedural trick would be better, but keep simple:
    // use lines via canvas; here we build once into a data texture
    (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "rgba(255,255,255,0)";
      ctx.fillRect(0, 0, 64, 64);
      ctx.strokeStyle = "rgba(0,0,0,0.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0.5, 0);
      ctx.lineTo(0.5, 64);
      ctx.moveTo(0, 0.5);
      ctx.lineTo(64, 0.5);
      ctx.stroke();
      return c.toDataURL("image/png");
    })()
  ), []);
  g.wrapS = g.wrapT = THREE.RepeatWrapping;
  g.repeat.set(8, 4);

  return (
    <mesh position={[0, 0, -0.1]}>
      <planeGeometry args={[8, 4]} />
      <meshBasicMaterial map={g} color={tint} transparent opacity={0.7} />
    </mesh>
  );
}

function FloatingPlaceholders({ tint = "#6a73ff" }) {
  // a few frosted cards hovering – suggests “posts in the void”
  return (
    <group>
      {[[-2.2, 0.6, 0], [0.1, -0.1, 0], [2.3, 0.4, 0]].map((p, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.1} floatIntensity={0.4}>
          <mesh position={[p[0], p[1], p[2]]}>
            <planeGeometry args={[2.6, 1.2, 1, 1]} />
            <meshPhysicalMaterial
              color={tint}
              roughness={0.95}
              metalness={0}
              transparent
              opacity={0.25}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function KnotCluster({ color = "#6a73ff" }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.5;
  });
  return (
    <Float speed={1} rotationIntensity={0.7} floatIntensity={0.8}>
      <mesh ref={ref} position={[0, 0, 0]}>
        <torusKnotGeometry args={[1.1, 0.26, 120, 24]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>
    </Float>
  );
}

function WavyPlane({ color = "#7bb3ff" }) {
  const ref = useRef<THREE.Mesh>(null!);
  const t = useRef(0);
  useFrame((_, dt) => {
    t.current += dt;
    const geo = ref.current.geometry as THREE.PlaneGeometry;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 2 + t.current * 1.6) * 0.12 + Math.cos(y * 1.5 + t.current) * 0.08);
    }
    pos.needsUpdate = true;
    (geo as any).computeVertexNormals?.();
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.2, 0, 0]}>
      <planeGeometry args={[8, 4, 64, 32]} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
    </mesh>
  );
}
