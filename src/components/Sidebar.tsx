// src/components/Sidebar.tsx
import { useEffect, useMemo, useState } from "react";
import bus from "../lib/bus";
import "./Sidebar.css";

type Species = "human" | "company" | "ai";
type DecisionKind = "standard" | "important";

function useLocal<T>(key: string, init: T) {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal] as const;
}

export default function Sidebar() {
  // profile demo stats
  const viewers = useMemo(() => 2862, []);
  const impressions = useMemo(() => 1442, []);

  // identity
  const [species, setSpecies] = useLocal<Species>("sn.species", "human");
  const [decisionKind, setDecisionKind] = useLocal<DecisionKind>("sn.decisionKind", "standard");

  // search
  const [query, setQuery] = useLocal<string>("sn.search", "");

  // backend config
  const [useReal, setUseReal] = useLocal<boolean>("sn.useRealBackend", false);
  const [backendUrl, setBackendUrl] = useLocal<string>("sn.backendUrl", "http://127.0.0.1:8000");

  // UI
  const [heroOpen, setHeroOpen] = useState(false);

  // emit bus updates
  useEffect(() => { bus.emit("identity:update", { species, decisionKind }); }, [species, decisionKind]);
  useEffect(() => { bus.emit("search:update", { query }); }, [query]);
  useEffect(() => { bus.emit("backend:update", { useReal, backendUrl }); }, [useReal, backendUrl]);

  const goto = (label: string) => bus.emit("nav:goto", { label });

  return (
    <aside className={`snv-sidebar ${heroOpen ? "open" : ""}`}>
      {/* top brand button */}
      <button className="snv-brand" onClick={() => goto("Feed")} aria-label="superNova home">
        <span className="snv-brand-orb" />
        <span className="snv-brand-text">superNova_2177</span>
      </button>

      {/* avatar → expands to hero */}
      <div className="snv-hero">
        <button
          className="snv-avatar"
          onClick={() => setHeroOpen(v => !v)}
          aria-expanded={heroOpen}
          title="Open profile"
        >
          <img src="/avatar.jpg" alt="avatar" onError={(e)=>{(e.currentTarget as HTMLImageElement).src="https://i.pravatar.cc/128?img=32"}}/>
        </button>

        <div className="snv-hero-card">
          <div className="snv-hero-name">taha_gungor</div>
          <div className="snv-hero-sub">ceo / test_tech • artist</div>
          <div className="snv-hero-metrics">
            <div><strong>{viewers.toLocaleString()}</strong><span>Profile viewers</span></div>
            <div><strong>{impressions.toLocaleString()}</strong><span>Post impressions</span></div>
          </div>
        </div>
      </div>

      {/* identity */}
      <div className="snv-section">Identity</div>
      <label className="snv-label">I am a…</label>
      <select className="snv-input" value={species} onChange={e => setSpecies(e.target.value as Species)}>
        <option value="human">human</option>
        <option value="company">company</option>
        <option value="ai">ai</option>
      </select>

      <label className="snv-label">Decision kind</label>
      <select className="snv-input" value={decisionKind} onChange={e => setDecisionKind(e.target.value as DecisionKind)}>
        <option value="standard">standard (60% yes)</option>
        <option value="important">important (90% yes)</option>
      </select>

      {/* search */}
      <div className="snv-section">Search</div>
      <input
        className="snv-input"
        placeholder="🔍 Search posts, people…"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {/* backend */}
      <div className="snv-section">Backend</div>
      <label className="snv-toggle">
        <input type="checkbox" checked={useReal} onChange={e => setUseReal(e.target.checked)} />
        <span>Use real backend</span>
      </label>
      <input
        className="snv-input"
        placeholder="http://127.0.0.1:8000"
        value={backendUrl}
        onChange={e => setBackendUrl(e.target.value)}
      />

      {/* workspaces */}
      <div className="snv-section">Workspaces</div>
      <button className="snv-btn" onClick={() => goto("Test Tech")}>🏠 Test Tech</button>
      <button className="snv-btn" onClick={() => goto("superNova_2177")}>✨ superNova_2177</button>
      <button className="snv-btn" onClick={() => goto("GLOBALRUNWAY")}>🌍 GLOBALRUNWAY</button>

      <div className="snv-divider" />

      {/* navigate */}
      <div className="snv-section">Navigate</div>
      <button className="snv-btn" onClick={() => goto("Feed")}>📰 Feed</button>
      <button className="snv-btn" onClick={() => goto("Chat")}>💬 Chat</button>
      <button className="snv-btn" onClick={() => goto("Messages")}>📬 Messages</button>
      <button className="snv-btn" onClick={() => goto("Profile")}>👤 Profile</button>
      <button className="snv-btn" onClick={() => goto("Proposals")}>📑 Proposals</button>
      <button className="snv-btn" onClick={() => goto("Decisions")}>✅ Decisions</button>
      <button className="snv-btn" onClick={() => goto("Execution")}>⚙️ Execution</button>

      {/* optional */}
      <button className="snv-btn ghost" onClick={() => goto("Coin")}>🪙 Coin</button>
      <button className="snv-btn ghost" onClick={() => goto("Forks")}>🍴 Forks</button>
      <button className="snv-btn ghost" onClick={() => goto("Remixes")}>🎛️ Remixes</button>

      <div className="snv-divider" />

      {/* premium */}
      <div className="snv-subheader">Premium</div>
      <button className="snv-btn" onClick={() => goto("Music")}>🎶 Music</button>
      <button className="snv-btn" onClick={() => goto("Agents")}>🚀 Agents</button>
      <button className="snv-btn" onClick={() => goto("Enter Metaverse")}>🌌 Enter Metaverse</button>

      <div className="snv-caption small">
        Mathematically sucked into a superNova_2177 void — stay tuned for 3D immersion
      </div>

      <div className="snv-divider" />
      <button className="snv-btn" onClick={() => goto("Settings")}>⚙️ Settings</button>
    </aside>
  );
}
