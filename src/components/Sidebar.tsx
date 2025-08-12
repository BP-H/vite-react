import { useEffect, useState } from "react";
import { getApiKey, setApiKey } from "../lib/storage";

export default function Sidebar({ onOpen }: { onOpen: () => void }) {
  const [api, setApi] = useState("");

  useEffect(() => setApi(getApiKey()), []);

  const save = () => {
    setApiKey(api.trim());
  };

  return (
    <aside className="sidebar glass">
      <div className="sidebar__head">Sidebar</div>

      <div className="sidebar__body">
        <button className="primary" onClick={onOpen}>Open Portal</button>

        <div className="sep" />

        <div className="form">
          <label className="label">Assistant API key</label>
          <input
            className="input"
            type="password"
            placeholder="sk-***"
            value={api}
            onChange={(e) => setApi(e.target.value)}
            onBlur={save}
          />
          <div className="hint">Stored locally. The orb will use this for voice/agent calls later.</div>
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
