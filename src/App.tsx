// src/App.tsx
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Feed from "./components/Feed";
import FloatingPortalAssistant from "./components/FloatingPortalAssistant";

export default function App() {
  return (
    <div className="page">
      <Topbar />
      <main className="app-shell">
        <aside className="app-left">
          <Sidebar />
        </aside>

        <section className="app-center">
          <Feed />
        </section>

        <aside className="app-right">
          <div className="card" style={{ padding: 12 }}>
            <div className="muted">Right rail</div>
            <div style={{ height: 16 }} />
            <button className="btn btn--primary" style={{ width: "100%" }}>
              Create Company
            </button>
            <div style={{ height: 8 }} />
            <button className="btn" style={{ width: "100%" }}>
              Open Dashboard
            </button>
          </div>
        </aside>
      </main>

      <FloatingPortalAssistant />
    </div>
  );
}
