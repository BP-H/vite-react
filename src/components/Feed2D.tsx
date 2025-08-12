// src/components/Feed2D.tsx
import { memo, useEffect, useRef, useState } from "react";

export type Post = { id: number; title: string; author: string; image: string };

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
  return (
    <article className="card frosted">
      <div className="card-head">
        <div className="byline">
          <span className="handle">{p.author}</span>
          <span className="dot">•</span>
          <span>demo</span>
        </div>
        <h3>{p.title}</h3>
      </div>

      <div className="media-wrap">
        <img loading="lazy" src={p.image} alt={p.title} />
      </div>

      <div className="card-actions">
        <button
          className="pill"
          onClick={(e) => onEnterWorld(p, { x: e.clientX, y: e.clientY })}
        >
          Enter world
        </button>
        <button className="pill ghost">Like</button>
        <button className="pill ghost">Share</button>
      </div>
    </article>
  );
}

function Skeleton() {
  return (
    <div className="card skeleton">
      <div className="s-line w40" />
      <div className="s-line w70" />
      <div className="s-img" />
      <div className="s-actions" />
    </div>
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
        const seen = entries.some((e) => e.isIntersecting);
        if (seen && !loading && hasMore) {
          setLoading(true);
          await new Promise((r) => setTimeout(r, 500)); // fake latency
          const base = posts.length;
          const next = Array.from({ length: 6 }, (_, i) => makePost(base + i));
          setPosts((p) => [...p, ...next]);
          setHasMore(base + next.length < 120);
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
        <div ref={sentinelRef} />
        {loading && <Skeleton />}
        {!hasMore && <div className="end">— end —</div>}
      </div>
    </div>
  );
}

export default memo(Feed2D);
