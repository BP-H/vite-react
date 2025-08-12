import { useEffect, useRef, useState } from "react";
import bus from "../lib/bus";
import { Post } from "../types";

const authors = ["@proto_ai", "@neonfork", "@superNova_2177"];
const titles = ["Prototype Moment", "Symbolic Feed", "Ocean Study"];

const makePost = (id: number): Post => ({
  id,
  author: authors[id % authors.length],
  title: titles[id % titles.length],
  image: `https://picsum.photos/seed/${id}-sn2177/1200/500`,
});

export default function Feed2D({
  onEnterWorld,
}: {
  onEnterWorld: (p: Post, at: { x: number; y: number }) => void;
}) {
  const [posts, setPosts] = useState<Post[]>(() =>
    Array.from({ length: 8 }, (_, i) => makePost(i))
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(async (entries) => {
      if (entries.some((e) => e.isIntersecting) && !loading && hasMore) {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 450)); // fake latency
        const nextId = posts.length;
        const next = Array.from({ length: 6 }, (_, i) => makePost(nextId + i));
        setPosts((p) => [...p, ...next]);
        setHasMore(posts.length + next.length < 120);
        setLoading(false);
      }
    }, { rootMargin: "1200px 0px 1200px 0px" });
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
          <Card key={p.id} post={p} onEnterWorld={onEnterWorld} />
        ))}
      </div>

      <div ref={sentinelRef} />
      {loading && <SkeletonRow />}
      {!hasMore && <div className="end">— end —</div>}
    </div>
  );
}

function Card({
  post,
  onEnterWorld,
}: {
  post: Post;
  onEnterWorld: (p: Post, at: { x: number; y: number }) => void;
}) {
  const mediaRef = useRef<HTMLDivElement | null>(null);

  const center = () => {
    const el = mediaRef.current!;
    const r = el.getBoundingClientRect();
    const x = Math.round(r.left + r.width / 2 + window.scrollX);
    const y = Math.round(r.top + r.height / 2 + window.scrollY);
    return { x, y };
  };

  const hover = () => {
    const at = center();
    bus.emit("feed:hover", { post, ...at });
  };

  const go = () => {
    const at = center();
    // ask assistant to fly and then portal
    bus.emit("orb:portal", { post, ...at });
    // NOTE: App will actually switch view once the orb calls back.
  };

  return (
    <article className="card frost" onMouseEnter={hover}>
      <header className="card-head">
        <div className="byline">
          <span className="handle">{post.author}</span>
          <span className="dot">•</span>
          <span className="muted">demo</span>
        </div>
        <h3>{post.title}</h3>
      </header>

      <div ref={mediaRef} className="media-wrap" onClick={go}>
        <img loading="lazy" src={post.image} alt={post.title} />
      </div>

      <div className="actions">
        <button onClick={go}>Enter world</button>
        <button>Like</button>
        <button>Share</button>
      </div>
    </article>
  );
}

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
