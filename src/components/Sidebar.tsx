import { useEffect, useState } from "react";

export default function Sidebar({ onOpen }: { onOpen: () => void }) {
  const [apiKey, setApiKey] = useState("");
  useEffect(() => {
    const k = localStorage.getItem("sn2177.apiKey") || "";
    setApiKey(k);
  }, []);
  useEffect(() => {
    localStorage.setItem("sn2177.apiKey", apiKey || "");
  }, [apiKey]);

  return (
    <aside className="sidebar glass">
      <div className="sidebar__head">Sidebar</div>

      <div className="sidebar__body">
        <button className="primary" onClick={onOpen}>Open Portal</button>

        <nav className="nav">
          <div className="nav__label">PROFILE</div>
          <a className="nav__item">My Worlds</a>
          <a className="nav__item">Following</a>
          <a className="nav__item">Discover</a>
        </nav>

        <div className="panel">
          <div className="panel__title">Assistant</div>
          <label className="label">Provider</label>
          <select className="input" defaultValue="openai" disabled>
            <option value="openai">OpenAI</option>
          </select>

          <label className="label">API Key</label>
          <input
            className="input"
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <div className="hint">Stored locally (for dev). Put this behind a server later.</div>
        </div>
      </div>
    </aside>
  );
}
