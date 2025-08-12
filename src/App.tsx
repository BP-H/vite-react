// src/App.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css"; // keep this (we'll upgrade index.css in step 3)
import PortalHero from "./components/PortalHero"; // you'll add this in Step 2

type Post = {
  id: string;
  author: string;
  text: string;
  time: string;
  image?: string;
};

function makeBatch(offset: number, size = 10): Post[] {
  return Array.from({ length: size }).map((_, i) => {
    const n = offset + i;
    return {
      id: String(n),
      author: ["@proto_ai", "@neonfork", "@superNova_2177"][n % 3],
      time: new Date(Date.now() - n * 1000 * 60 * 5).toLocaleString(),
      text:
        n % 3 === 0
          ? "Low-poly moment — rotating differently in each instance as you scroll."
          : "Prototype feed — symbolic demo copy for layout testing.",
      image: n % 2 === 0 ? `https://picsum.photos/seed/sn_${n}/960/540` : undefined,
    };
  });
}

export default function App() {
  // feed
  const [items, setItems] = useState<Post[]>(() => makeBatch(0, 12));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    let t: number | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (!e.isIntersecting || loading || !hasMore) return;
        setLoading(true);
        t = window.setTimeout(() => {
          const next = makeBatch(page * 12, 12);
          setItems((prev) => [...prev, ...next]);
          const nextPage = page + 1;
          setPage(nextPage);
          if (nextPage >= 10) setHasMore(false); // demo cap
          setLoading(false);
        }, 200);
      },
      { rootMargin: "1200px 0px 800px 0px" }
    );
    io.observe(sentinelRef.current);
    return () => {
      if (t) window.clearTimeout(t);
      io.disconnect();
    };
  }, [page, loading, hasMore]);

  // simple tokens for spacing until we drop in index.css in step 3
  const gap = 16;

  return (
    <main
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(120% 80% at 50% -10%, rgba(111,66,193,.15), rgba(0,0,0,0) 60%), linear-gradient(180deg, #0c0f16, #0a0d14)",
        color: "rgba(238,242,248,.95)",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, "Helvetica Neue", Arial',
      }}
    >
      {/* Top bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 12px",
          background: "rgba(10,12,18,.6)",
          backdropFilter: "blur(10px) saturate(130%)",
          borderBottom: "1px solid rgba(255,255,255,.06)",
        }}
      >
        <div style={{ fontWeight: 800 }}>superNova_2177</div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <input
            placeholder="Search posts, people, companies…"
            aria-label="Search"
            style={{
              width: "min(720px, 90vw)",
              height: 36,
              padding: "0 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,.1)",
              background: "rgba(18,22,30,.75)",
              color: "white",
            }}
          />
        </div>
        <button
          style={{
            height: 36,
            padding: "0 14px",
            borderRadius: 10,
            border: "1px solid transparent",
            background:
              "linear-gradient(90deg, #ff2db8 0%, #00d1ff 100%)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Launch 3D
        </button>
      </header>

      {/* 3-column layout */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: 20,
          display: "grid",
          gridTemplateColumns: "272px 1fr 312px",
          gap,
        }}
      >
        {/* Left rail */}
        <aside style={{ display: "grid", gap }}>
          <div style={cardStyle}>
            <div style={{ padding: 12, display: "flex", gap: 10, alignItems: "center" }}>
              <div style={avatarStyle} />
              <div>
                <div style={{ fontWeight: 700 }}>taha_gungor</div>
                <div style={{ opacity: 0.7, fontSize: 12 }}>artist • test_tech</div>
              </div>
            </div>
          </div>

          <nav style={{ ...cardStyle, padding: 8, display: "grid", gap: 8 }}>
            {["Feed", "Messages", "Proposals", "Decisions", "Execution", "Companies", "Settings"].map(
              (l) => (
                <button key={l} style={ghostBtnStyle}>
                  {l}
                </button>
              )
            )}
          </nav>
        </aside>

        {/* Center column */}
        <section style={{ display: "grid", gap }}>
          {/* 3D portal hero dock */}
          <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
            <PortalHero />
          </div>

          {/* Composer */}
          <div style={{ ...cardStyle, padding: 12 }}>
            <textarea
              placeholder="Share something…"
              style={{
                width: "100%",
                minHeight: 64,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,.1)",
                background: "rgba(18,22,30,.75)",
                color: "white",
                padding: 10,
                resize: "vertical",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button style={primaryBtnStyle}>Post</button>
            </div>
          </div>

          {/* Feed */}
          {items.map((p) => (
            <article key={p.id} style={{ ...cardStyle, padding: 12 }}>
              <header style={{ marginBottom: 6 }}>
                <strong>{p.author}</strong>
                <span style={{ opacity: 0.6 }}> • {p.time}</span>
              </header>
              <p style={{ marginBottom: 10 }}>{p.text}</p>
              {p.image && (
                <div
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,.08)",
                  }}
                >
                  <img src={p.image} alt="" style={{ width: "100%", display: "block" }} loading="lazy" />
                </div>
              )}
              <footer style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button style={chipStyle}>Like</button>
                <button style={chipStyle}>Comment</button>
                <button style={chipStyle}>Share</button>
              </footer>
            </article>
          ))}

          <div
            ref={sentinelRef}
            style={{ height: 44, display: "grid", placeItems: "center", opacity: 0.7 }}
          >
            {loading ? "Loading…" : hasMore ? "" : "— End —"}
          </div>
        </section>

        {/* Right rail */}
        <aside style={{ display: "grid", gap }}>
          <div style={{ ...cardStyle, padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Identity</div>
            <div style={{ opacity: 0.7 }}>Switch modes and manage entities.</div>
          </div>
          <div style={{ ...cardStyle, padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Company Control Center</div>
            <div style={{ opacity: 0.7, marginBottom: 10 }}>
              Spin up spaces, manage proposals, and ship pipelines.
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <button style={primaryBtnStyle}>Create Company</button>
              <button style={ghostBtnStyle}>Open Dashboard</button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

// tiny style helpers (kept inline so this file works before we drop in tokens CSS)
const cardStyle: React.CSSProperties = {
  background: "rgba(16,18,27,.75)",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 16,
  boxShadow: "0 24px 60px rgba(0,0,0,.45)",
  backdropFilter: "blur(6px)",
};

const chipStyle: React.CSSProperties = {
  height: 32,
  padding: "0 12px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,.12)",
  background: "rgba(16,18,27,.6)",
  color: "inherit",
  fontWeight: 600,
  cursor: "pointer",
};

const primaryBtnStyle: React.CSSProperties = {
  height: 40,
  padding: "0 14px",
  borderRadius: 10,
  border: "1px solid transparent",
  background: "linear-gradient(90deg, #ff2db8, #00d1ff)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const ghostBtnStyle: React.CSSProperties = {
  height: 38,
  padding: "0 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,.12)",
  background: "rgba(16,18,27,.6)",
  color: "inherit",
  fontWeight: 700,
  textAlign: "left" as const,
  cursor: "pointer",
};

const avatarStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 12,
  background: "linear-gradient(90deg,#ffffff,#f4f6fb)",
  boxShadow: "0 10px 30px rgba(255, 47, 146, .25)",
  border: "1px solid rgba(255,255,255,.1)",
};
