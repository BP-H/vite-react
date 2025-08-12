import { memo } from "react";

export type Post = { id: string; title: string; author: string };

type Props = {
  posts: Post[];
  onEnterWorld: (p: Post) => void;
};

function Sidebar({ onOpen }: { onOpen: () => void }) {
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
      </div>
    </aside>
  );
}

function Card({ post, onEnterWorld }: { post: Post; onEnterWorld: (p: Post) => void }) {
  return (
    <article className="card glass">
      <header className="card__head">
        <strong>{post.author}</strong>
        <span className="dot">•</span>
        <span className="muted">demo</span>
      </header>

      <h3 className="card__title">{post.title}</h3>

      {/* frosted “void” placeholder that feels 2D but is portal-ready */}
      <div className="placeholder">
        <div className="placeholder__shimmer" />
      </div>

      <footer className="card__foot">
        <button className="chip" onClick={() => onEnterWorld(post)}>Enter world</button>
        <button className="chip">Like</button>
        <button className="chip">Share</button>
      </footer>
    </article>
  );
}

function Feed2D({ posts, onEnterWorld }: Props) {
  return (
    <div className="layout">
      <Sidebar onOpen={() => onEnterWorld(posts[0])} />
      <main className="feed">
        {posts.map((p) => (
          <Card key={p.id} post={p} onEnterWorld={onEnterWorld} />
        ))}
      </main>
    </div>
  );
}

export default memo(Feed2D);
