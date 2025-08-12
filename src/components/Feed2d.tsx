import React from "react";

type Feed2DProps = {
  sucking: boolean;
  onEnterPortal: (worldId: string) => void;
};

const POSTS = [
  { id: "prototype", user: "@proto_ai", title: "Prototype Moment" },
  { id: "symbolic", user: "@neonfork", title: "Symbolic Feed" },
  { id: "ocean", user: "@superNova_2177", title: "Ocean Study" },
];

export default function Feed2D({ sucking, onEnterPortal }: Feed2DProps) {
  return (
    <div className={`feed-layout ${sucking ? "is-sucking" : ""}`}>
      <aside className="feed-sidebar">
        <div className="sb-title">Sidebar</div>
        <button
          className="portal-chip"
          aria-label="Open Portal"
          onClick={() => onEnterPortal("portal")}
        >
          Open Portal
        </button>
        <div className="sb-line" />
        <div className="sb-caption">
          Seamless 2D/3D feed. Cards feel 2D on rails with frosted glass between
          them. Tap the portal to dissolve into the bright white void.
        </div>
      </aside>

      <main className="feed-stream">
        {POSTS.map((p, i) => (
          <article
            key={p.id}
            className={`card ${sucking ? "suck-to-void" : ""}`}
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <header className="card-h">
              <div className="card-user">{p.user}</div>
              <div className="card-dot">•</div>
              <div className="card-demo">demo</div>
            </header>

            <h3 className="card-title">{p.title}</h3>

            <div className="card-media">
              {/* Low-poly / world preview placeholder */}
              <div className="media-sheen" />
              <div className="grid-frost" />
            </div>

            <footer className="card-f">
              <button
                className="pill"
                onClick={() => onEnterPortal(p.id)}
                aria-label={`Enter ${p.title}`}
              >
                Enter world
              </button>
              <button className="pill">Like</button>
              <button className="pill">Share</button>
            </footer>
          </article>
        ))}
      </main>

      {/* White wash that blooms the UI as everything gets sucked into the void */}
      {sucking && <div className="void-wash" aria-hidden />}
    </div>
  );
}
