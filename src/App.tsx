// src/App.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Float, ContactShadows, OrbitControls, Html } from "@react-three/drei";

type Post = {
  id: string;
  author: string;
  time: string;
  text: string;
  image?: string;
};

// ------------------------------ demo feed -----------------------------------
function makeBatch(offset: number, size = 8): Post[] {
  return Array.from({ length: size }).map((_, i) => {
    const n = offset + i;
    return {
      id: String(n),
      author: ["@proto_ai", "@neonfork", "@superNova_2177"][n % 3],
      time: new Date(Date.now() - n * 1000 * 60 * 7).toLocaleString(),
      text:
        n % 3 === 0
          ? "Low-poly moment — rotating differently in each instance as you scroll."
          : "Prototype feed — symbolic demo copy for layout testing.",
      image: n % 2 === 0 ? `https://picsum.photos/seed/sn_${n}/960/540` : undefined,
    };
  });
}

// ----------------------------- 3D background --------------------------------
function Starfield({ count = 3000 }) {
  const positions = useMemo(() => {
    const r = 60;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * r * 2;
      arr[i * 3 + 1] = (Math.random() - 0.5) * r * 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * r * 2;
    }
    return arr;
  }, [count]);

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      {/* @ts-ignore */}
      <pointsMaterial color="#9b8cff" size={0.06} sizeAttenuation transparent opacity={0.65} depthWrite={false} />
    </points>
  );
}

function PortalKnot() {
  return (
    <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.9}>
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[0.9, 0.28, 160, 24]} />
        <meshStandardMaterial color="#b9b5ff" metalness={0.55} roughness={0.18} />
      </mesh>
    </Float>
  );
}

// ------------------------------- App UI -------------------------------------
export default function App() {
  const [posts, setPosts] = useState<Post[]>(() => makeBatch(0, 10));
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // infinite scroll (demo)
  useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || !hasMore) return;
        const next = makeBatch(page * 10, 10);
        setPosts((p) => [...p, ...next]);
        const np = page + 1;
        setPage(np);
        if (np >= 6) setHasMore(false);
      },
      { rootMargin: "1200px 0px 800px 0px" }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [page, hasMore]);

  return (
    <div>
      {/* Fixed GPU background */}
      <Canvas
        className="bg3d"
        camera={{ position: [0, 0, 10], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#070a12"]} />
        <fog attach="fog" args={["#070a12", 20, 120]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 2]} intensity={0.8} />
        <Starfield count={4200} />
        <group position={[0, 0, -6]}>
          <PortalKnot />
          <ContactShadows position={[0, -1.4, 0]} opacity={0.2} scale={20} blur={1.8} far={3} />
        </group>
      </Canvas>

      {/* Floating assistant button (opens full 3D) */}
      <button className="assistant" onClick={() => setOpen(true)} title="Open the portal">
        ✨ Open Portal
      </button>

      {/* Glass UI shell */}
      <header className="topbar">
        <div className="brand">GLOBALRUNWAYAI</div>
        <input className="search" placeholder="Search posts, people…" />
        <a className="cta" href="/3d">Launch 3D</a>
      </header>

      <main className="shell">
        <aside className="left">
          <div className="card profile">
            <img src="/icon.png" width={48} height={48} alt="avatar" />
            <div>
              <div className="name">taha_gungor</div>
              <div className="muted">artist · test_tech</div>
            </div>
          </div>

          <nav className="card nav">
            {["Feed", "Messages", "Proposals", "Decisions", "Execution", "Companies", "Settings"].map((l) => (
              <button key={l} className="btn ghost">{l}</button>
            ))}
          </nav>

          <div className="card">
            <div className="muted">Quick stats</div>
            <div className="kpis">
              <div><div className="k">2,302</div><div className="muted small">Profile views</div></div>
              <div><div className="k">1,542</div><div className="muted small">Post reach</div></div>
              <div><div className="k">12</div><div className="muted small">Companies</div></div>
            </div>
          </div>
        </aside>

        <section className="center">
          {/* hero dock */}
          <div className="card hero">
            <p className="muted">
              Minimal UI, neon <b>superNova</b> accents. The 3D portal floats behind and the UI rides on glass.
            </p>
            <div className="row">
              <a className="btn primary" href="/3d">Open Universe</a>
              <button className="btn">Remix a Universe</button>
            </div>
          </div>

          {/* composer (demo) */}
          <div className="card">
            <label className="muted small">Share something…</label>
            <textarea className="input" placeholder="Share something cosmic…" rows={3} />
            <div className="row r">
              <button className="btn">Post</button>
            </div>
          </div>

          {/* feed */}
          {posts.map((p) => (
            <article key={p.id} className="card post">
              <header className="postHead">
                <strong>{p.author}</strong><span className="muted"> • {p.time}</span>
              </header>
              <p className="postText">{p.text}</p>
              {p.image && (
                <div className="media">
                  <img src={p.image} alt="post" loading="lazy" decoding="async" />
                </div>
              )}
              <footer className="row">
                <button className="chip">Like</button>
                <button className="chip">Comment</button>
                <button className="chip">Share</button>
              </footer>
            </article>
          ))}
          <div ref={sentinelRef} className="sentinel">{hasMore ? "" : "— End —"}</div>
        </section>

        <aside className="right">
          <div className="card">
            <div className="sectionTitle">Identity</div>
            <div className="muted">Switch modes and manage entities.</div>
          </div>
          <div className="card">
            <div className="sectionTitle">Company Control Center</div>
            <div className="muted">Spin up spaces, manage proposals, and ship pipelines.</div>
            <div className="stack">
              <button className="btn primary">Create Company</button>
              <button className="btn">Open Dashboard</button>
            </div>
          </div>
          <div className="card">
            <div className="sectionTitle">Shortcuts</div>
            <div className="stack">
              <button className="btn">New Proposal</button>
              <button className="btn">Start Vote</button>
              <button className="btn">Invite Member</button>
            </div>
          </div>
        </aside>
      </main>

      {/* fullscreen portal modal */}
      {open && (
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
            <color attach="background" args={["#070a12"]} />
            <ambientLight intensity={0.85} />
            <directionalLight position={[3, 2, 2]} intensity={0.9} />
            <PortalKnot />
            <OrbitControls enablePan={false} />
            <Html center>
              <div className="modalHint">Tap anywhere to close</div>
            </Html>
          </Canvas>
        </div>
      )}

      {/* tiny stylesheet embedded so this is a single-file drop-in */}
      <style>{`
        :root{
          --ink:#e9eef6; --muted:#a2a8b6; --line:rgba(255,255,255,.08);
          --glass: rgba(16,18,27,.66); --glass-2: rgba(16,18,27,.78);
          --pink:#ff2db8; --blue:#4f46e5;
        }
        *{box-sizing:border-box}
        html,body,#root{height:100%}
        body{margin:0; color:var(--ink); font:14px/1.45 system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial}
        /* background canvas behind everything */
        .bg3d{ position:fixed !important; inset:0; z-index:0; pointer-events:none; }
        /* floating assistant button */
        .assistant{
          position:fixed; right:18px; bottom:18px; z-index:3;
          padding:10px 14px; border-radius:12px; border:1px solid var(--line);
          background:linear-gradient(90deg, var(--pink), var(--blue)); color:#fff; font-weight:700; cursor:pointer;
          box-shadow:0 10px 30px rgba(0,0,0,.35);
        }
        .topbar{
          position:sticky; top:0; z-index:2; display:flex; align-items:center; gap:12px;
          padding:10px 14px; border-bottom:1px solid var(--line); backdrop-filter:blur(10px) saturate(140%);
          background:linear-gradient(180deg, rgba(10,12,18,.85), rgba(10,12,18,.55));
        }
        .brand{font-weight:900; letter-spacing:.3px}
        .search{
          flex:1; height:38px; border-radius:12px; border:1px solid var(--line); background:rgba(255,255,255,.04);
          color:var(--ink); padding:0 12px;
        }
        .cta{
          display:inline-flex; align-items:center; height:38px; padding:0 12px; border-radius:12px; border:1px solid var(--line);
          background:rgba(255,255,255,.06); color:var(--ink); text-decoration:none; font-weight:700;
        }

        .shell{ position:relative; z-index:1; display:grid; grid-template-columns:272px 1fr 320px; gap:16px; padding:16px; }
        @media (max-width: 1100px){ .shell{ grid-template-columns:256px 1fr; } .right{display:none;} }
        @media (max-width: 820px){ .shell{ grid-template-columns:1fr; } .left{display:none;} }

        .card{
          background:var(--glass); border:1px solid var(--line); border-radius:16px; overflow:hidden;
          box-shadow:0 6px 18px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.05);
          padding:12px;
        }
        .hero{ background:var(--glass-2) }
        .row{ display:flex; gap:8px; align-items:center; }
        .row.r{ justify-content:flex-end; }
        .btn{
          height:38px; padding:0 14px; border-radius:12px; border:1px solid var(--line); background:rgba(255,255,255,.06);
          color:var(--ink); font-weight:700; cursor:pointer;
        }
        .btn.primary{ background:linear-gradient(90deg, var(--pink), var(--blue)); color:#fff; border-color:transparent; }
        .btn.ghost{ width:100%; justify-content:flex-start; }
        .chip{ padding:6px 10px; border-radius:999px; background:rgba(255,255,255,.06); border:1px solid var(--line); color:var(--ink); }

        .profile{ display:flex; gap:10px; align-items:center; }
        .name{ font-weight:800; }
        .muted{ color:var(--muted) }
        .muted.small{ font-size:12px }
        .kpis{ display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; }
        .k{ font-weight:900; font-size:20px }

        .post{ padding:12px }
        .postHead{ margin-bottom:6px }
        .postText{ margin:8px 0 10px 0 }
        .media{ border-radius:12px; overflow:hidden; border:1px solid var(--line) }
        .media img{ display:block; width:100%; height:auto }
        .sectionTitle{ font-weight:800; margin-bottom:4px }
        .stack{ display:grid; gap:8px }

        .modal{ position:fixed; inset:0; z-index:4; background:rgba(7,10,18,.92) }
        .modalHint{
          padding:8px 12px; border-radius:12px; border:1px solid rgba(255,255,255,.12);
          background:rgba(20,22,30,.6); color:#fff; font:600 13px/1 system-ui;
        }
        .sentinel{ height:44px; display:grid; place-items:center; color:var(--muted) }
      `}</style>
    </div>
  );
}
