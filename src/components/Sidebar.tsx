// src/components/Sidebar.tsx
export default function Sidebar() {
  const items = ["Feed", "Messages", "Proposals", "Decisions", "Execution", "Companies", "Settings"];
  return (
    <div style={{ position: "sticky", top: "calc(var(--topbar-h) + 12px)", display: "grid", gap: 12 }}>
      <div className="card" style={{ padding: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: 12, overflow: "hidden",
              border: "1px solid var(--line)", background: "#fff",
              display:"grid", placeItems:"center", fontWeight:900
            }}
          >
            SN
          </div>
          <div>
            <div style={{ fontWeight: 800 }}>taha_gungor</div>
            <div className="muted">artist • test_tech</div>
          </div>
        </div>
      </div>

      <nav className="card" style={{ padding: 8, display: "grid", gap: 8 }}>
        {items.map((label) => (
          <button key={label} className="btn" style={{ width: "100%", justifyContent: "flex-start" }}>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
