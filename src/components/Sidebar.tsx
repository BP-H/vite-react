// src/components/Sidebar.tsx
import { useEffect, useMemo, useState } from "react";
import bus from "../lib/bus";

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
  // profile (static placeholders for now)
  const viewers = useMemo(() => 2100 + Math.floor(Math.random() * 350), []);
  const impressions = useMemo(() => 1400 + Math.floor(Math.random() * 250), []);

  // identity
  const [species, setSpecies] = useLocal<Species>("sn.species", "human");
  const [decisionKind, setDecisionKind] = useLocal<DecisionKind>("sn.decisionKind", "standard");

  // search
  const [query, setQuery] = useLocal<string>("sn.search", "");

  // backend
  const [useReal, setUseReal] = useLocal<boolean>("sn.useRealBackend", false);
  const [backendUrl, setBackendUrl] = useLocal<string>("sn.backendUrl", "http://127.0.0.1:8000");

  // emit changes so the rest of the app can react
  useEffect(() => { bus.emit("identity:update", { species, decisionKind }); }, [species, decisionKind]);
  useEffect(() => { bus.emit("search:update", { query }); }, [query]);
  useEffect(() => { bus.emit("backend:update", { useReal, backendUrl }); }, [useReal, backendUrl]);

  const goto = (label: string) => bus.emit("nav:goto", { label });

  return (
    <aside className="sn-sidebar">
      {/* brand / quick home */}
      <button className="sn-brandBtn" onClick={() => goto("Feed")} aria-label="superNova_2177 home">
        <span className="spark">💫</span> <strong>superNova_2177</strong>
      </button>

      {/* profile card */}
      <div className="sn-card">
        <img
          src="https://placehold.co/320x160/11131d/FFFFFF?text=superNova_2177"
          alt="cover"
          className="sn-cover"
        />
        <div className="sn-name">taha_gungor</div>
        <div className="sn-caption">ceo / test_tech</div>
        <div className="sn-caption">artist / will = …</div>
        <div className="sn-caption">New York, NY, United States</div>
        <div className="sn-caption">test_tech</div>

        <div className="sn-metrics">
          <div className="sn-metric">
            <div className="k">{viewers.toLocaleString()}</div>
            <div className="l">Profile viewers</div>
          </div>
          <div className="sn-metric">
            <div className="k">{impressions.toLocaleString()}</div>
            <div className="l">Post impressions</div>
          </div>
        </div>
      </div>

      {/* identity controls */}
      <div className="sn-section">Identity</div>
      <label className="sn-label">I am a…</label>
      <select
        value={species}
        onChange={(e) => setSpecies(e.target.value as Species)}
        className="sn-input"
      >
        <option value="human">human</option>
        <option value="company">company</option>
        <option value="ai">ai</option>
      </select>

      <label className="sn-label">Decision kind</label>
      <select
        value={decisionKind}
        onChange={(e) => setDecisionKind(e.target.value as DecisionKind)}
        className="sn-input"
      >
        <option value="standard">standard (60% yes)</option>
        <option value="important">important (90% yes)</option>
      </select>

      {/* search */}
      <div className="sn-section">Search</div>
      <input
        className="sn-input"
        placeholder="🔍 Search posts, people…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* backend */}
      <div className="sn-section">Backend</div>
      <label className="sn-toggle">
        <input
          type="checkbox"
          checked={useReal}
          onChange={(e) => setUseReal(e.target.checked)}
        />
        <span>Use real backend</span>
      </label>
      <input
        className="sn-input"
        placeholder="http://127.0.0.1:8000"
        value={backendUrl}
        onChange={(e) => setBackendUrl(e.target.value)}
      />

      {/* workspaces */}
      <div className="sn-section">Workspaces</div>
      <button className="sn-btn" onClick={() => goto("Test Tech")}>🏠 Test Tech</button>
      <button className="sn-btn" onClick={() => goto("superNova_2177")}>✨ superNova_2177</button>
      <button className="sn-btn" onClick={() => goto("GLOBALRUNWAY")}>🌍 GLOBALRUNWAY</button>

      <div className="sn-divider" />

      {/* navigate */}
      <div className="sn-section">Navigate</div>
      <button className="sn-btn" onClick={() => goto("Feed")}>📰 Feed</button>
      <button className="sn-btn" onClick={() => goto("Chat")}>💬 Chat</button>
      <button className="sn-btn" onClick={() => goto("Messages")}>📬 Messages</button>
      <button className="sn-btn" onClick={() => goto("Profile")}>👤 Profile</button>
      <button className="sn-btn" onClick={() => goto("Proposals")}>📑 Proposals</button>
      <button className="sn-btn" onClick={() => goto("Decisions")}>✅ Decisions</button>
      <button className="sn-btn" onClick={() => goto("Execution")}>⚙️ Execution</button>

      {/* optional pages if you add them later */}
      <button className="sn-btn ghost" onClick={() => goto("Coin")}>🪙 Coin</button>
      <button className="sn-btn ghost" onClick={() => goto("Forks")}>🍴 Forks</button>
      <button className="sn-btn ghost" onClick={() => goto("Remixes")}>🎛️ Remixes</button>

      <div className="sn-divider" />

      {/* premium */}
      <div className="sn-subheader">Premium</div>
      <button className="sn-btn" onClick={() => goto("Music")}>🎶 Music</button>
      <button className="sn-btn" onClick={() => goto("Agents")}>🚀 Agents</button>
      <button className="sn-btn" onClick={() => goto("Enter Metaverse")}>🌌 Enter Metaverse</button>
      <div className="sn-caption small">
        Mathematically sucked into a superNova_2177 void – stay tuned for 3D immersion
      </div>

      <div className="sn-divider" />
      <button className="sn-btn" onClick={() => goto("Settings")}>⚙️ Settings</button>
    </aside>
  );
}
