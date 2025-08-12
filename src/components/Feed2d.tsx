import React from "react";

type Props = {
  onOpenPortal: (worldId: string | null) => void;
};

const CARDS = [
  { id: "proto", author: "@proto_ai", title: "Prototype Moment" },
  { id: "symbolic", author: "@neonfork", title: "Symbolic Feed" },
  { id: "ocean", author: "@superNova_2177", title: "Ocean Study" },
];

export default function Feed2d({ onOpenPortal }: Props) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-head">Sidebar</div>
        <button className="btn primary" onClick={() => onOpenPortal("portal")}>
          Open Portal
        </button>

        <nav className="nav">
          <div className="nav-section">Profile</div>
          <button className="nav-item">My Worlds</button>
          <button className="nav-item">Following</button>
          <button className="nav-item">Discover</button>
        </nav>
      </aside>

      <main className="feed">
        {CARDS.map((card) => (
          <div className="card" key={card.id}>
            <header className="card-header">
              <div className="meta">
                <span className="author">{card.author}</span>
                <span className="dot">•</span>
                <span className="demo">demo</span>
              </div>
              <h3 className="title">{card.title}</h3>
            </header>

            {/* Frosted glass placeholder "window" that feels 2D but hints 3D */}
            <div className="frosted-window">
              <div className="lowpoly-hint" />
            </div>

            <div className="card-actions">
              <button
                className="pill"
                onClick={() => onOpenPortal(card.id)}
                aria-label={`Enter world ${card.title}`}
              >
                Enter world
              </button>
              <button className="pill">Like</button>
              <button className="pill">Share</button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
