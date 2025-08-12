// src/App.tsx
import PortalHero from "./components/PortalHero";

export default function App() {
  return (
    <div style={pageStyle}>
      <header style={topbar}>
        <strong>superNova • vite</strong>
        <div style={{ flex: 1 }} />
        <a
          href="https://github.com/BP-H/vite-react"
          target="_blank"
          rel="noreferrer"
          style={linkBtn}
        >
          Repo
        </a>
      </header>

      <main style={mainWrap}>
        <section style={column}>
          {/* left rail placeholder */}
        </section>

        <section style={centerCol}>
          <div style={card}>
            <PortalHero />
          </div>

          <div style={card}>
            <h3 style={{ margin: 0 }}>Hello 👋</h3>
            <p style={{ marginTop: 8, color: "var(--ink-2, #667085)" }}>
              This is the Vite starter wired with a minimal 3D hero. We’ll grow
              this into your feed next.
            </p>
          </div>
        </section>

        <section style={column}>
          {/* right rail placeholder */}
        </section>
      </main>
    </div>
  );
}

/* — inline styles to keep this file self-contained — */
const pageStyle: React.CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: 16,
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Inter, Arial',
};

const topbar: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 12px",
  background: "rgba(255,255,255,.85)",
  backdropFilter: "blur(8px) saturate(140%)",
  border: "1px solid rgba(0,0,0,.06)",
  borderRadius: 12,
  marginBottom: 16,
};

const linkBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  height: 36,
  padding: "0 12px",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,.08)",
  textDecoration: "none",
  color: "#111",
  background: "#fff",
  fontWeight: 600,
};

const mainWrap: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "272px 1fr 312px",
  gap: 16,
};

const column: React.CSSProperties = {
  display: "grid",
  gap: 16,
};

const centerCol: React.CSSProperties = {
  display: "grid",
  gap: 16,
};

const card: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid #e7ebf3",
  background: "#f6f7f9",
  boxShadow: "0 6px 18px rgba(18,24,40,.06), 0 1px 0 rgba(255,255,255,.8) inset",
  padding: 12,
};
