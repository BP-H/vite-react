// src/components/Feed2D.tsx
import React, { useEffect, useRef, useState, memo, MouseEvent } from "react";

export type Post = {
  id: number;
  author: string;
  title: string;
  image: string;
};

const makePost = (id: number): Post => ({
  id,
  author: ["@proto_ai", "@neonfork", "@superNova_2177"][id % 3],
  title: ["Prototype Moment", "Symbolic Feed", "Ocean Study"][id % 3],
  image: `https://picsum.photos/seed/${id}-sn2177/1200/700`,
});

type Props = {
  onEnterWorld: (p: Post, at?: { x: number; y: number }) => void;
};

function Card({ p, onEnterWorld }: { p: Post; onEnterWorld: Props["onEnterWorld"] }) {
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onEnterWorld(p, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };
  return (
    <article className="card frosted">
      <header className="card-head">
        <div className="byline">
          <span className="handle">{p.author}</span>
          <span className="dot">•</span>
          <span>demo</span>
        </div>
        <h2>{p.title}</h2>
      </header>

      <div className="card-canvas">
        <img className="mini-canvas" loading="lazy" src={p.image} alt={p.title} />
      </div>

      <div className="card-actions">
        <button className="pill" onClick={onClick}>Enter world</button>
        <button className="pill ghost">Like</button>
        <button className="pill ghost">Share</button>
      </div>
    </article>
  );
}

function Feed2D({ onEnterWorld }: Props) {
  const [posts, setPosts] = useState<Post[]>(() =>
    Array.from({ length: 8 }, (_, i) => makePost(i))
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      async (entries) => {
        if (entries.some((e) => e.isIntersecting) && !loading && hasMore) {
          setLoading(true);
          await new Promise((r) => setTimeout(r, 500));
          const start = posts.length;
          const next = Array.from({ length: 6 }, (_, i) => makePost(start + i));
          setPosts((p) => [...p, ...next]);
          setHasMore(start + next.length < 120);
          setLoading(false);
        }
      },
      { rootMargin: "1200px 0px 1200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [posts.length, loading, hasMore]);

  return (
    <div className="feed-wrap">
      <div className="feed-header">
        <h1>Feed</h1>
        <div className="sweep" />
      </div>

      <div className="cards">
        {posts.map((p) => (
          <Card key={p.id} p={p} onEnterWorld={onEnterWorld} />
        ))}
      </div>

      <div ref={sentinelRef} />
      {loading && <Skeleton />}
      {!hasMore && <div className="end">— end —</div>}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="card frosted skeleton">
      <div className="s-line w40" />
      <div className="s-line w70" />
      <div className="s-img" />
      <div className="s-actions" />
    </div>
  );
}

export default memo(Feed2D);
