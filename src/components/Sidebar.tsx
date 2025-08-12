// src/components/Sidebar.tsx
import { useEffect, useState } from "react";
import { pingOpenAI, quickChat } from "../lib/api";

export default function Sidebar({ onOpen }: { onOpen: () => void }) {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => setApiKey(localStorage.getItem("sn2177.apiKey") || ""), []);
  useEffect(() => { localStorage.setItem("sn2177.apiKey", apiKey || ""); }, [apiKey]);

  const verify = async () => {
    setStatus("Verifying…");
    const r = await pingOpenAI(apiKey);
    setStatus(r.ok ? `✅ API OK (sample: ${r.sampleModel || "ok"})` : `❌ ${r.error || "Failed"}`);
  };

  const testReply = async () => {
    setStatus("Calling chat…");
    const r = await quickChat(apiKey);
    setStatus(r.ok ? `🗣️ ${r.text}` : `❌ ${r.error || "Failed"}`);
  };

  return (
    <aside className="sidebar glass">
      <div className="sidebar__head">Sidebar</div>

      <div className="sidebar__body">
        <button className="primary" onClick={onOpen}>Open Portal</button>

        <div className="panel">
          <div className="panel__title">Assistant</div>
          <label className="label">API Key</label>
          <input
            className="input"
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="primary" onClick={verify}>Verify API</button>
            <button className="primary" onClick={testReply}>Test reply</button>
          </div>
          {status && <div className="hint" style={{ marginTop: 8 }}>{status}</div>}
          <div className="hint">Stored locally for dev. For prod, proxy via a server key.</div>
        </div>

        <nav className="nav">
          <div className="nav__label">PROFILE</div>
          <a className="nav__item">My Worlds</a>
          <a className="nav__item">Following</a>
          <a className="nav__item">Discover</a>
        </nav>
      </div>
    </aside>
  );
}
