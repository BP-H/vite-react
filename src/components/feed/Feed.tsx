import { useEffect, useRef, useState } from "react";
import PostCard from "./PostCard";
import { Post } from "../../types";

/**
 * Feed renders a centered, full-bleed column of posts with infinite load.
 * NOTE: PostCard now handles world entry internally via the bus; we do NOT
 * pass onPortal down anymore (that caused the TS error).
 */
export default function Feed({
  onPortal: _onPortal, // kept for compatibility with callers (unused here)
}: {
  onPortal: (p: Post, at?: { x: number; y: number }) => void;
}) {
  const [posts, setPosts] = useState<Post[]>(() => seed(12));
  const pageRef = useRef(1);

  useEffect(() => {
    const sentinel = document.getElementById("feed-sentinel");
    if (!sentinel) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          // load more
          pageRef.current += 1;
          setPosts((prev) => [...prev, ...seed(10, prev.length)]);
        }
      },
      { rootMargin: "800px 0px" }
    );

    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <div className="feed-frame">
      <div className="feed-col">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
        <div id="feed-sentinel" style={{ height: 1 }} />
        <div className="end">— loading more —</div>
      </div>
    </div>
  );
}

/** simple seeded content generator (images via picsum) */
function seed(n: number, startId = 0): Post[] {
  const out: Post[] = [];
  for (let i = 0; i < n; i++) {
    const id = startId + i + 1;
    const imgId = 100 + ((startId + i) % 48);
    out.push({
      id,
      author: ["@eva", "@noah", "@aria", "@kai", "@proto_ai"][id % 5],
      title: ["Prototype moment", "Neon dune", "Pink nebula", "Glass valley"][id % 4],
      image: `https://picsum.photos/id/${imgId}/1600/1200`,
    });
  }
  return out;
}