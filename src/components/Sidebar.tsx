// src/components/Sidebar.tsx
export default function Sidebar() {
  const items = ["Feed", "Messages", "Proposals", "Decisions", "Execution", "Companies", "Settings"];
  return (
    <div className="sidebar">
      <div className="card card--pad">
        <div className="user">
          <div className="avatar">SN</div>
          <div>
            <div className="fw-800">taha_gungor</div>
            <div className="muted">artist • test_tech</div>
          </div>
        </div>
      </div>

      <nav className="card nav">
        {items.map((label) => (
          <button key={label} className="btn btn--block">
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
