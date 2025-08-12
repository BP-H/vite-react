// src/components/Feed.tsx
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, View, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

/** --- demo data -------------------------------------------------------- */
type Post =
  | { id: string; kind: "text"; author: string; time: string; text: string }
  | { id: string; kind: "image"; author: string; time: string; text: string; image: string }
  | { id: string; kind: "portal3d"; author: string; time: string; text: string };

function makeBatch(offset: number, size = 12): Post[] {
  return Array.from({ length: size }).map((_, i) => {
    const n = offset + i;
    const base = {
      id: String(n),
      author: ["@proto_ai", "@neonfork", "@superNova_2177"][n % 3],
      time: new Date(Date.now() - n * 5 * 60 * 1000).toLocaleTimeString(),
    };
    if (n % 5 === 0) return { ...base, kind: "portal3d", text: "Portal moment—tap the universe." };
    if (n % 2 === 0)
      return {
        ...base,
        kind: "image",
        text: "Prototype feed — layout test.",
        image: `https://picsum.photos/seed/sn_${n}/960/540`,
      };
    return { ...base, kind: "text", text: "Low-poly moment — each card animates differently." };
  });
}

/** --- shared canvas context ------------------------------------------- */
type MiniScene = {
  id: number;
  ref: MutableRefObject<HTMLElement>; // NOTE: non-nullable, matches <View track> type
  element: ReactNode;
  visible: boolean;
};

const MiniSceneContext = createContext<{
  register: (ref: MutableRefObject<HTMLElement>, element: ReactNode) => number;
  unregister: (id: number) => void;
  setVisible: (id: number, v: boolean) => void;
} | null>(null);

/** --- tiny 3D card ----------------------------------------------------- */
function MiniPortal() {
  // domRef is what we put on the <div>, it can be null before mount
  const domRef = useRef<HTMLDivElement | null>(null);

  // trackRef is the one we give to <View track>, which wants MutableRefObject<HTMLElement>
  // We initialize with `null!` and set it in the callback ref below — safe because we guard usage.
  const trackRef = useRef<HTMLElement>(null!);

  const ctx = useContext(MiniSceneContext)!;
  const [id, setId] = useState<number | null>(null);

  function Rock({ seed = 0 }: { seed?: number }) {
    const mesh = useRef<THREE.Mesh>(null!);
    const color = useMemo(
      () => new THREE.Color().setHSL((seed * 0.137) % 1, 0.25, 0.6),
      [seed]
    );
    useFrame((_, d) => {
      mesh.current.rotation.x += 0.25 * d;
      mesh.current.rotation.y -= 0.18 * d;
    });
    return (
      <mesh ref={mesh} castShadow receiveShadow>
        <icosahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
      </mesh>
    );
  }
  function Torus() {
    const mesh = useRef<THREE.Mesh>(null!);
    useFrame((_, d) => (mesh.current.rotation.y -= 0.35 * d));
    return (
      <mesh ref={mesh} castShadow receiveShadow>
        <torusKnotGeometry args={[0.26, 0.08, 100, 16]} />
        <meshStandardMaterial color="#b9b5ff" roughness={0.25} metalness={0.25} />
      </mesh>
    );
  }

  // register this portal's scene with the shared canvas
  useEffect(() => {
    const element = (
      <>
        <PerspectiveCamera makeDefault position={[0, 0, 3.2]} fov={50} />
        <color attach="background" args={["#0a0b10"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 3, 2]} intensity={0.8} />
        <Float speed={1} rotationIntensity={0.3} floatIntensity={0.8}>
          <group position={[-1.2, 0.2, 0]}>
            <Rock seed={1} />
          </group>
        </Float>
        <Float speed={0.9} rotationIntensity={0.4} floatIntensity={0.9}>
          <group position={[0.2, 0.35, -0.3]}>
            <Torus />
          </group>
        </Float>
        <ContactShadows
          position={[0, -0.85, 0]}
          opacity={0.25}
          scale={10}
          blur={1.6}
          far={2}
        />
      </>
    );
    const newId = ctx.register(trackRef, element);
    setId(newId);
    return () => ctx.unregister(newId);
  }, [ctx]);

  // observe visibility to pause when off-screen
  useEffect(() => {
    if (!domRef.current || id === null) return;
    const io = new IntersectionObserver(
      ([e]) => ctx.setVisible(id, e.isIntersecting),
      { rootMargin: "200px 0px" }
    );
    io.observe(domRef.current);
    return () => io.disconnect();
  }, [ctx, id]);

  return (
    <div
      ref={(el) => {
        domRef.current = el;
        // keep trackRef in sync, guaranteeing a non-nullable HTMLElement for <View track>
        if (el) trackRef.current = el;
      }}
      style={{
        position: "relative",
        height: 220,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid var(--line)",
        background: "linear-gradient(180deg,#0c0f16,#0a0d14)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -20,
          pointerEvents: "none",
          mixBlendMode: "screen",
          background:
            "radial-gradient(60% 50% at 50% 35%, rgba(255,45,184,0.25) 0%, transparent 70%)",
          filter: "blur(16px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: -20,
          pointerEvents: "none",
          mixBlendMode: "screen",
          background:
            "radial-gradient(55% 45% at 50% 30%, rgba(155,140,255,0.20) 0%, transparent 70%)",
          filter: "blur(18px)",
        }}
      />
    </div>
  );
}

/** --- main feed -------------------------------------------------------- */
export default function Feed() {
  const [items, setItems] = useState<Post[]>(() => makeBatch(0, 12));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [scenes, setScenes] = useState<MiniScene[]>([]);
  const idRef = useRef(0);

  const register = useCallback(
    (ref: MutableRefObject<HTMLElement>, element: ReactNode) => {
      const id = ++idRef.current;
      setScenes((s) => [...s, { id, ref, element, visible: false }]);
      return id;
    },
    []
  );

  const unregister = useCallback((id: number) => {
    setScenes((s) => s.filter((p) => p.id !== id));
  }, []);

  const setVisible = useCallback((id: number, v: boolean) => {
    setScenes((s) => s.map((p) => (p.id === id ? { ...p, visible: v } : p)));
  }, []);

  const ctxValue = useMemo(() => ({ register, unregister, setVisible }), [
    register,
    unregister,
    setVisible,
  ]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || loading || !hasMore) return;
        setLoading(true);
        timer = setTimeout(() => {
          const next = makeBatch(page * 12, 12);
          setItems((prev) => [...prev, ...next]);
          const nextPage = page + 1;
          setPage(nextPage);
          if (nextPage >= 8) setHasMore(false);
          setLoading(false);
        }, 180);
      },
      { rootMargin: "1000px 0px 600px 0px" }
    );
    io.observe(sentinelRef.current);
    return () => {
      if (timer) clearTimeout(timer);
      io.disconnect();
    };
  }, [page, loading, hasMore]);

  return (
    <MiniSceneContext.Provider value={ctxValue}>
      <>
        {items.map((p) => (
          <article key={p.id} className="card post">
            <header>
              <strong>{p.author}</strong>
              <span className="muted"> • {p.time}</span>
            </header>

            <p style={{ margin: "8px 0 10px" }}>{p.text}</p>

            {p.kind === "image" && (
              <div className="media">
                <img
                  src={p.image}
                  alt="post"
                  loading="lazy"
                  decoding="async"
                  style={{ display: "block", width: "100%", height: "auto" }}
                />
              </div>
            )}

            {p.kind === "portal3d" && <MiniPortal />}

            <footer>
              <button className="chip">Like</button>
              <button className="chip">Comment</button>
              <button className="chip">Share</button>
            </footer>
          </article>
        ))}

        <div
          ref={sentinelRef}
          style={{
            height: 44,
            display: "grid",
            placeItems: "center",
            color: "var(--ink-2)",
          }}
        >
          {loading ? "Loading…" : hasMore ? "" : "— End —"}
        </div>

        {/* Shared, fixed canvas rendering only visible mini-scenes */}
        <Canvas
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: "high-performance" }}
        >
          {scenes
            .filter((s) => s.visible && s.ref.current) // ensure mounted + visible
            .map((s) => (
              <View key={s.id} track={s.ref}>
                {s.element}
              </View>
            ))}
        </Canvas>
      </>
    </MiniSceneContext.Provider>
  );
}