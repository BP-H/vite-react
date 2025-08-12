// src/App.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, ContactShadows, Html } from "@react-three/drei";

/* ------------------------------------------------------------------ */
/*  3D background — fixed full-screen starfield (pointer-events:none) */
/* ------------------------------------------------------------------ */
function GlobalBackground3D() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 2.5], fov: 60 }}>
        <color attach="background" args={["#090a0f"]} />
        <Stars radius={120} depth={80} count={12000} factor={3} fade speed={0.8} />
      </Canvas>
    </div>
  );
}

/* ---------------------------------- */
/*  Small 3D tile used inside a post  */
/* ---------------------------------- */
function KnotTile({ seed = 0 }: { seed?: number }) {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += 0.3 * dt;
    mesh.current.rotation.y -= 0.22 * dt;
  });
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 3], fov: 50 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      style={{ width: "100%", height: 220, display: "block", borderRadius: 14 }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3, 2]} intensity={0.9} />
      <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.85}>
        <mesh ref={mesh}>
          <torusKnotGeometry args={[0.7, 0.2, 120, 16]} />
          <meshStandardMaterial color="#b9b5ff" metalness={0.55} roughness={0.25} />
        </mesh>
      </Float>
      <ContactShadows position={[0, -0.85, 0]} opacity={0.2} scale={10} blur={1.6} far={2} />
    </Canvas>
  );
}

/* ---------------------------------------- */
/*  Floating portal / mini assistant toggle  */
/* ---------------------------------------- */
function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 30,
          padding: "10px 14px",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,.12)",
          background: "linear-gradient(90deg,#ff2db8,#4f46e5)",
          color: "#fff",
          fontWeight: 700,
          boxShadow: "0 8px 24px rgba(0,0,0,.35)",
          cursor: "pointer",
        }}
      >
        Open Portal
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(5,7,12,.6)",
            backdropFilter: "blur(6px)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 520,
              maxWidth: "92vw",
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,.12)",
              background: "rgba(16,18,27,.85)",
              boxShadow: "0 20px 70px rgba(0,0,0,.45)",
              overflow: "hidden",
            }}
          >
            <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.2], fov: 55 }} style={{ height: 380 }}>
              <color attach="background" args={["#0b0d14"]} />
              <ambientLight intensity={0.85} />
              <directionalLight position={[3, 2, 2]} intensity={0.9} />
              <Float speed={1} rotationIntensity={0.25} floatIntensity={0.9}>
                <mesh>
                  <torusKnotGeometry args={[0.9, 0.25, 160, 24]} />
                  <meshStandardMaterial color="#a78bfa" metalness={0.6} roughness={0.2} />
                </mesh>
              </Float>
              <ContactShadows position={[0, -1.2, 0]} opacity={0.25} scale={14} blur={2} far={3} />
              <Html center>
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,.1)",
                    background: "rgba(0,0,0,.35)",
                    color: "#fff",
                    fontWeight: 600,
                    userSelect: "none",
                  }}
                >
                  Tap backdrop to close
                </div>
              </Html>
            </Canvas>
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------ */
/*  Feed types & fake generator   */
/* ------------------------------ */
type FeedBase = { id: string; author: string; time: string; text: string };
type Feed3D = FeedBase & { kind: "3d"; seed: number };
type FeedImg = FeedBase & { kind: "img"; image: string; alt?: string };
type FeedText = FeedBase & { kind: "text" };
type FeedItem = Feed3D | FeedImg | FeedText;

const AUTHORS = ["@proto_ai", "@neonfork", "@superNova_2177"];

function makeBatch(offset: number, size = 12): FeedItem[] {
  return Array.from({ length: size }).map((_, i) => {
    const n = offset + i;
    const base: FeedBase = {
      id: String(n),
      author: AUTHORS[n % AUTHORS.length]!,
      time: new Date(Date.now() - n * 5 * 60 * 1000).toLocaleString(),
      text:
        n % 3 === 0
          ? "Low-poly moment — rotating differently in each instance as you scroll."
          : "Prototype feed — symbolic demo copy for layout testing.",
    };
    if (n % 4 === 0) return { ...base, kind: "3d", seed: n };
    if (n % 2 === 0)
      return { ...base, kind: "img", image: `https://picsum.photos/seed/sn_${n}/960/540`, alt: "post" };
    return { ...base, kind: "text" };
  });
}

/* ======== MAIN APP ===================================================== */
export default function App() {
  const [items, setItems] = useState<FeedItem[]>(() => makeBatch(0, 16));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e.isIntersecting || loading || !hasMore) return;
        setLoading(true);
        setTimeout(() => {
          const next = makeBatch(page * 16, 16);
          setItems((prev) => [...prev, ...next]);
          setPage((p) => p + 1);
          if (page + 1 >= 10) setHasMore(false);
          setLoading(false);
        }, 220);
      },
      { rootMargin: "900px 0px 800px 0px" }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [page, loading, hasMore]);

  /* ---- design tokens (inline so we don't touch CSS files yet) ---- */
  const glass = {
    background: "rgba(16,18,27,.75)",
    border: "1px solid rgba(255,255,255,.10)",
    boxShadow: "0 18px 50px rgba(0,0,0,.35)",
    borderRadius: 18,
    backdropFilter: "blur(8px) saturate(130%)",
  } as const;

  return (
    <>
      <GlobalBackground3D />
      <FloatingAssistant />

      {/* topbar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          margin: "0 auto",
          padding: "10px 12px",
          maxWidth: 1280,
          display: "flex",
          alignItems: "center",
          gap: 12,
          ...glass,
          background: "rgba(14,16,24,.6)",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,.08)",
          marginTop: 10,
        }}
      >
        <strong style={{ letterSpacing: 0.3 }}>GLOBALRUNWAYAI</strong>
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 8,
            alignItems: "center",
            width: 420,
            maxWidth: "52vw",
          }}
        >
          <input
            placeholder="Search posts, people, companies…"
            style={{
              height: 38,
              borderRadius: 12,
              padding: "0 12px",
              border: "1px solid rgba(255,255,255,.14)",
              background: "rgba(12,14,20,.6)",
              color: "white",
            }}
          />
          <button
            style={{
              height: 38,
              padding: "0 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.18)",
              background: "linear-gradient(90deg,#ff2db8,#4f46e5)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Launch 3D
          </button>
        </div>
      </header>

      {/* shell */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1280,
          margin: "16px auto 80px",
          padding: "0 8px",
          display: "grid",
          gap: 16,
          gridTemplateColumns: "260px 1fr 300px",
        }}
      >
        {/* left rail */}
        <aside style={{ display: "grid", gap: 12 }}>
          <div style={{ ...glass, padding: 12 }}>
            <div style={{ fontWeight: 700 }}>taha_gungor</div>
            <div style={{ opacity: 0.7, fontSize: 13 }}>artist • test_tech</div>
          </div>
          <div style={{ ...glass, padding: 10, display: "grid", gap: 8 }}>
            {["Feed", "Messages", "Proposals", "Decisions", "Execution", "Companies", "Settings"].map((l) => (
              <button
                key={l}
                style={{
                  height: 36,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,.10)",
                  background: "rgba(10,12,18,.6)",
                  color: "white",
                  textAlign: "left",
                  padding: "0 10px",
                  cursor: "pointer",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </aside>

        {/* center feed */}
        <section style={{ display: "grid", gap: 14 }}>
          {/* tiny hero portal card */}
          <div style={{ ...glass, overflow: "hidden" }}>
            <KnotTile seed={0} />
          </div>

          {items.map((p) => (
            <article key={p.id} style={{ ...glass, padding: 12 }}>
              <header style={{ marginBottom: 6 }}>
                <strong>{p.author}</strong>
                <span style={{ opacity: 0.6 }}> • {p.time}</span>
              </header>
              <p style={{ margin: "6px 0 10px" }}>{p.text}</p>

              {p.kind === "img" && (
                <div
                  style={{
                    borderRadius: 14,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,.08)",
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.alt ?? "post image"}
                    style={{ display: "block", width: "100%", height: "auto" }}
                    loading="lazy"
                  />
                </div>
              )}

              {p.kind === "3d" && <KnotTile seed={p.seed} />}

              <footer style={{ display: "flex", gap: 8, marginTop: 10 }}>
                {["Like", "Comment", "Share"].map((t) => (
                  <button
                    key={t}
                    style={{
                      height: 34,
                      padding: "0 12px",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,.12)",
                      background: "rgba(12,14,20,.6)",
                      color: "white",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </footer>
            </article>
          ))}

          <div
            ref={sentinelRef}
            style={{ height: 48, display: "grid", placeItems: "center", opacity: 0.7, color: "white" }}
          >
            {loading ? "Loading…" : hasMore ? " " : "— End —"}
          </div>
        </section>

        {/* right rail */}
        <aside style={{ display: "grid", gap: 12 }}>
          <div style={{ ...glass, padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Identity</div>
            <div style={{ opacity: 0.7 }}>Switch modes and manage entities.</div>
          </div>
          <div style={{ ...glass, padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Company Control Center</div>
            <div style={{ opacity: 0.7, marginBottom: 10 }}>
              Spin up spaces, manage proposals, and ship pipelines.
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <button
                style={{
                  height: 38,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,.14)",
                  background: "linear-gradient(90deg,#ff2db8,#4f46e5)",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Create Company
              </button>
              <button
                style={{
                  height: 38,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,.14)",
                  background: "rgba(10,12,18,.6)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Open Dashboard
              </button>
            </div>
          </div>
        </aside>
      </main>
    </>
  );
}
