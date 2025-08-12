// src/components/Feed2D.tsx
import React, { memo, useEffect, useRef, useState } from "react";

/** ------------ types ------------------ */
export type Post = {
  id: string;
  author: string;
  title: string;
  image?: string;
};

type Props = {
  /** optional seed list; otherwise we generate placeholders */
  initial?: Post[];
  /** parent can hook the portal transition */
  onEnterWorld?: (p: Post) => void;
};

/** ------------ helpers ---------------- */
const AUTHORS = ["@proto_ai", "@neonfork", "@superNova_2177"];
const TITLES = ["Prototype Moment", "Symbolic Feed", "Ocean Study"];

const makePost = (n: number): Post => ({
  id: String(n),
  author: AUTHORS[n % AUTHORS.length],
  title: TITLES[n % TITLES.length],
  image: `https://picsum.photos/seed/${n}-sn2177/1200/700`,
});

/** ------------ sidebar ---------------- */
function Sidebar({ onOpen, hasPost }: { onOpen: () => void; hasPost: boolean }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__head">Sidebar</div>
      <div className="sidebar__body">
        <button className="primary" onClick={onOpen} disabled={!hasPost}>
          Open Portal
        </button>

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

/** ------------- card ------------------ */
function Card({ post, onEnterWorld }: { post: Post; onEnterWorld?: (p: Post) => void }) {
  const enter = () => onEnterWorld?.(post);

  return (
    <article className="card frost">
      <header className="card__head">
        <strong>{post.author}</strong>
        <span className="dot">•</span>
        <span className="muted">demo</span>
      </header>

      <h3 className="card__title">{post.title}</h3>

      <div className="media-wrap">
        {post.image ? (
          <img loading="lazy" src={post.image} alt={post.title} />
        ) : (
          <div className="placeholder">
            <div className="placeholder__shimmer" />
          </div>
        )}
      </div>

      <footer className="card__foot">
        <button className="chip" onClick={enter}>Enter world</button>
        <button className="chip">Like</button>
        <button className="chip">Share</button>
      </footer>
    </article>
  );
}

/** ------------- skeleton --------------- */
function SkeletonRow() {
  return (
    <div className="card frost skeleton">
      <div className="s-line w40" />
      <div className="s-line w70" />
      <div className="s-img" />
      <div className="s-actions" />
    </div>
  );
}

/** ------------- main feed -------------- */
function Feed2D({ initial, onEnterWorld }: Props) {
  const [posts, setPosts] = useState<Post[]>(
    () => initial ?? Array.from({ length: 8 }, (_, i) => makePost(i))
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      async (entries) => {
        const seen = entries.some((e) => e.isIntersecting);
        if (!seen || loading || !hasMore) return;

        setLoading(true);
        // simulate latency
        await new Promise((r) => setTimeout(r, 600));

        const start = posts.length;
        const next = Array.from({ length: 6 }, (_, i) => makePost(start + i));
        setPosts((p) => [...p, ...next]);

        const total = start + next.length;
        if (total >= 120) setHasMore(false); // cap demo length
        setLoading(false);
      },
      { rootMargin: "1200px 0px 1200px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [posts.length, loading, hasMore]);

  const openPortal = () => {
    const p = posts[0];
    if (p) onEnterWorld?.(p);
  };

  return (
    <div className="layout">
      <Sidebar onOpen={openPortal} hasPost={posts.length > 0} />
      <main className="feed">
        {posts.map((p) => (
          <Card key={p.id} post={p} onEnterWorld={onEnterWorld} />
        ))}

        <div ref={sentinelRef} />
        {loading && <SkeletonRow />}
        {!hasMore && <div className="end">— end —</div>}
      </main>
    </div>
  );
}

export default memo(Feed2D);
