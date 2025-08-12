// src/components/Sidebar.tsx
import { useEffect, useMemo, useState } from "react";
import bus from "../lib/bus";
import "./Sidebar.css";

type Species = "human" | "company" | "ai";
type DecisionKind = "standard" | "important";

function useLocal<T>(key: string, init: T) {
  const [val, setVal] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : init; }
    catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal] as const;
}

export default function Sidebar() {
  // visual state — default to FAB (collapsed)
  const [open, setOpen] = useLocal<boolean>("snv.sidebarOpen", false);
  const [heroOpen, setHeroOpen] = useState(false);

  // identity, search, backend, api key
  const [species, setSpecies] = useLocal<Species>("sn.species", "human");
  const [decisionKind, setDecisionKind] = useLocal<DecisionKind>("sn.decisionKind", "standard");
  const [query, setQuery] = useLocal<string>("sn.search", "");
  const [useReal, setUseReal] = useLocal<boolean>("sn.useRealBackend", false);
  const [backendUrl, setBackendUrl] = useLocal<string>("sn.backendUrl", "http://127.0.0.1:8000");
  const [apiKey, setApiKey] = useLocal<string>("sn2177.apiKey", "");
  const [showKey, setShowKey] = useState(false);

  // demo metrics
  const viewers = useMemo(() => 2862, []);
  const impressions = useMemo(() => 1442, []);

  // bus bridges
  useEffect(() => { bus.emit("identity:update", { species, decisionKind }); }, [species, decisionKind]);
  useEffect(() => { bus.emit("search:update", { query }); }, [query]);
  useEffect(() => { bus.emit("backend:update", { useReal, backendUrl }); }, [useReal, backendUrl]);

  const goto = (label: string) => bus.emit("nav:goto", { label });

  // inline placeholder avatar
  const placeholderSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'>
    <defs>
      <radialGradient id='g' cx='30%' cy='30%' r='80%'>
        <stop offset='0%' stop-color='#fff9ff'/>
        <stop offset='60%' stop-color='#ffc6ee'/>
        <stop offset='100%' stop-color='#ff74de'/>
      </radialGradient>
    </defs>
    <rect width='128' height='128' rx='28' fill='#0f1117'/>
    <circle cx='64' cy='64' r='36' fill='url(#g)'/>
  </svg>`)}'`;

  return (
    <>
      {/* optional subtle scrim while open (click to close) */}
      {open && <div className="snv2-scrim" onClick={() => setOpen(false)} />}

      <aside className={`snv2 ${open ? "open" : "fab"} ${heroOpen ? "hero" : ""}`} aria-hidden={false}>
        {/* When FAB, the entire circle is a button */}
        {!open && (
          <button className="snv2-fab" aria-label="Open menu" onClick={() => setOpen(true)}>
            <img
              src="/avatar.jpg"
              alt="me"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = placeholderSvg; }}
            />
          </button>
        )}

        {/* Panel content (slides in) */}
        {open && (
          <div className="snv2-panel">
            <div className="snv2-panel__head">
              <button className="snv2-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
              <button className="snv2-brand" onClick={() => goto("Feed")} aria-label="superNova home">
                <span className="orb" />
                <span className="text">superNova_2177</span>
              </button>
            </div>

            {/* avatar + hero */}
            <div className="snv2-hero">
              <button className="avatar" onClick={() => setHeroOpen(v => !v)} aria-expanded={heroOpen}>
                <img
                  src="/avatar.jpg"
                  alt="avatar"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = placeholderSvg; }}
                />
              </button>

              <div className={`hero-card ${heroOpen ? "on" : ""}`}>
                <div className="name">taha_gungor</div>
                <div className="sub">ceo / test_tech • artist</div>
                <div className="metrics">
                  <div><strong>{viewers.toLocaleString()}</strong><span>Profile viewers</span></div>
                  <div><strong>{impressions.toLocaleString()}</strong><span>Post impressions</span></div>
                </div>
              </div>
            </div>

            <div className="section">Identity</div>
            <label className="label">I am a…</label>
            <select className="input" value={species} onChange={(e) => setSpecies(e.target.value as Species)}>
              <option value="human">human</option>
              <option value="company">company</option>
              <option value="ai">ai</option>
            </select>

            <label className="label">Decision kind</label>
            <select className="input" value={decisionKind} onChange={(e) => setDecisionKind(e.target.value as DecisionKind)}>
              <option value="standard">standard (60% yes)</option>
              <option value="important">important (90% yes)</option>
            </select>

            <div className="section">Search</div>
            <input className="input" placeholder="🔍 Search posts, people…" value={query} onChange={(e) => setQuery(e.target.value)} />

            <div className="section">API</div>
            <div className="api">
              <input
                className="input"
                placeholder="OpenAI API key"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoComplete="off"
              />
              <button className="icon" onClick={() => setShowKey(s => !s)} aria-label="Show API key">{showKey ? "🙈" : "👁"}</button>
              <button className="icon danger" onClick={() => setApiKey("")} aria-label="Clear API key">✕</button>
            </div>

            <div className="section">Backend</div>
            <label className="toggle">
              <input type="checkbox" checked={useReal} onChange={(e) => setUseReal(e.target.checked)} />
              <span>Use real backend</span>
            </label>
            <input className="input" placeholder="http://127.0.0.1:8000" value={backendUrl} onChange={(e) => setBackendUrl(e.target.value)} />

            <div className="section">Workspaces</div>
            <button className="btn" onClick={() => goto("Test Tech")}>🏠 <span>Test Tech</span></button>
            <button className="btn" onClick={() => goto("superNova_2177")}>✨ <span>superNova_2177</span></button>
            <button className="btn" onClick={() => goto("GLOBALRUNWAY")}>🌍 <span>GLOBALRUNWAY</span></button>

            <div className="divider" />

            <div className="section">Navigate</div>
            <button className="btn">🏡 <span>Feed</span></button>
            <button className="btn">💬 <span>Chat</span></button>
            <button className="btn">📬 <span>Messages</span></button>
            <button className="btn">👤 <span>Profile</span></button>
            <button className="btn">📑 <span>Proposals</span></button>
            <button className="btn">✅ <span>Decisions</span></button>
            <button className="btn">⚙️ <span>Execution</span></button>

            <button className="btn ghost">🪙 <span>Coin</span></button>
            <button className="btn ghost">🍴 <span>Forks</span></button>
            <button className="btn ghost">🎛️ <span>Remixes</span></button>

            <div className="divider" />

            <div className="subheader">Premium</div>
            <button className="btn">🎶 <span>Music</span></button>
            <button className="btn">🚀 <span>Agents</span></button>
            <button className="btn">🌌 <span>Enter Metaverse</span></button>

            <div className="caption">Mathematically sucked into a superNova_2177 void — stay tuned for 3D immersion</div>

            <div className="divider" />
            <button className="btn">⚙️ <span>Settings</span></button>
          </div>
        )}
      </aside>
    </>
  );
}