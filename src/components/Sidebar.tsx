// src/components/Sidebar.tsx
import { useEffect, useState } from "react";
import "./Sidebar.css";
import bus from "../lib/bus";

type Species = "human" | "company" | "ai";
type DecisionKind = "standard" | "important";

function useLocal<T>(key: string, init: T) {
  const [v, setV] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV] as const;
}

const NAV = [
  { key: "Feed", icon: "🏠", label: "Feed" },
  { key: "Chat", icon: "💬", label: "Chat" },
  { key: "Messages", icon: "📬", label: "Messages" },
  { key: "Profile", icon: "👤", label: "Profile" },
  { key: "Proposals", icon: "📑", label: "Proposals" },
  { key: "Decisions", icon: "✅", label: "Decisions" },
  { key: "Execution", icon: "⚙️", label: "Execution" },
  { key: "Coin", icon: "🪙", label: "Coin" },
  { key: "Forks", icon: "🍴", label: "Forks" },
  { key: "Remixes", icon: "🎛️", label: "Remixes" },
  { key: "Music", icon: "🎶", label: "Music" },
  { key: "Agents", icon: "🚀", label: "Agents" },
  { key: "Enter Metaverse", icon: "🌌", label: "Enter Metaverse" },
  { key: "Settings", icon: "⚙️", label: "Settings" },
];

export default function Sidebar() {
  // UI state
  const [open, setOpen] = useLocal<boolean>("snv.sidebarOpen", false);

  // identity + backend (kept minimal here; full controls live in the panel)
  const [species, setSpecies] = useLocal<Species>("sn.species", "human");
  const [decisionKind, setDecisionKind] = useLocal<DecisionKind>("sn.decisionKind", "standard");
  const [apiKey, setApiKey] = useLocal<string>("sn2177.apiKey", "");
  const [backendUrl, setBackendUrl] = useLocal<string>("sn.backendUrl", "http://127.0.0.1:8000");
  const [useReal, setUseReal] = useLocal<boolean>("sn.useRealBackend", false);
  const [query, setQuery] = useLocal<string>("sn.search", "");

  useEffect(() => { bus.emit("identity:update", { species, decisionKind }); }, [species, decisionKind]);
  useEffect(() => { bus.emit("search:update", { query }); }, [query]);
  useEffect(() => { bus.emit("backend:update", { useReal, backendUrl }); }, [useReal, backendUrl]);

  const goto = (label: string) => bus.emit("nav:goto", { label });

  // Placeholder avatar if /avatar.jpg missing
  const placeholderSvg =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
        <defs>
          <radialGradient id="g" cx="30%" cy="30%" r="80%">
            <stop offset="0%" stop-color="#fff9ff"/>
            <stop offset="60%" stop-color="#ffc6ee"/>
            <stop offset="100%" stop-color="#ff74de"/>
          </radialGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="#0f1117"/>
        <circle cx="64" cy="64" r="36" fill="url(#g)"/>
      </svg>`
    );

  return (
    <>
      {/* Tiny icon rail (always visible, fixed, does NOT push the feed) */}
      <nav className="dock" aria-label="Primary">
        {/* Avatar button (opens panel) */}
        <button
          className="dock-avatar"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          title="Menu"
        >
          <img
            src="/avatar.jpg"
            alt="avatar"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = placeholderSvg; }}
          />
        </button>

        {/* Icons only */}
        <div className="dock-icons">
          {NAV.slice(0, 7).map((n) => (
            <button key={n.key} className="dock-icon" title={n.label} aria-label={n.label} onClick={() => goto(n.key)}>
              <span aria-hidden>{n.icon}</span>
            </button>
          ))}
        </div>

        <div className="dock-icons">
          {NAV.slice(7).map((n) => (
            <button key={n.key} className="dock-icon ghost" title={n.label} aria-label={n.label} onClick={() => goto(n.key)}>
              <span aria-hidden>{n.icon}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Scrim + sliding panel (overlays feed) */}
      <div className={`panel-wrap ${open ? "open" : ""}`} aria-hidden={!open} onClick={() => setOpen(false)}>
        <aside
          className="panel"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="superNova menu"
        >
          <header className="panel-header">
            <button className="panel-close" onClick={() => setOpen(false)} aria-label="Close menu">✕</button>
            <div className="brand">
              <span className="orb" />
              <span className="text">superNova_2177</span>
            </div>
          </header>

          {/* Quick search */}
          <div className="panel-block">
            <input
              className="input"
              placeholder="🔍 Search posts, people…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* API key */}
          <div className="panel-block">
            <label className="label">OpenAI API key</label>
            <div className="row">
              <input
                className="input"
                placeholder="sk-…"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoComplete="off"
              />
              <button className="btn small" onClick={() => setApiKey("")}>Clear</button>
            </div>
          </div>

          {/* Identity */}
          <div className="panel-grid">
            <div>
              <label className="label">I am a…</label>
              <select className="input" value={species} onChange={(e) => (e.target.value && setSpecies(e.target.value as Species))}>
                <option value="human">human</option>
                <option value="company">company</option>
                <option value="ai">ai</option>
              </select>
            </div>
            <div>
              <label className="label">Decision kind</label>
              <select className="input" value={decisionKind} onChange={(e) => setDecisionKind(e.target.value as DecisionKind)}>
                <option value="standard">standard (60% yes)</option>
                <option value="important">important (90% yes)</option>
              </select>
            </div>
          </div>

          {/* Backend */}
          <div className="panel-grid">
            <label className="toggle">
              <input
                type="checkbox"
                checked={useReal}
                onChange={(e) => setUseReal(e.target.checked)}
              />
              <span>Use real backend</span>
            </label>
            <input
              className="input"
              placeholder="http://127.0.0.1:8000"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
            />
          </div>

          {/* Nav list with labels */}
          <div className="panel-nav">
            {NAV.map((n) => (
              <button key={n.key} className="nav-row" onClick={() => goto(n.key)}>
                <span className="i">{n.icon}</span>
                <span className="t">{n.label}</span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}