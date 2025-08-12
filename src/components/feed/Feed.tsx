import { useEffect, useMemo, useRef, useState } from "react";
import PostCard from "./PostCard";
import { Post } from "../../types";
import "./postcard.css";

const IMGS = [
  "https://images.unsplash.com/photo-1526481280698-8fcc13fd9f2e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
];

export default function Feed({
  onPortal,
}: {
  onPortal: (p: Post, at?: { x: number; y: number }) => void;
}) {
  // seed posts
  const seed = useMemo<Post[]>(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i + 1,
        author: i % 3 === 0 ? "@forest_bot" : i % 2 ? "@proto_ai" : "@eva",
        title:
          i % 3 === 0 ? "Low-poly tree" : i % 2 ? "Ocean study" : "Prototype moment",
        image: IMGS[i % IMGS.length],
      })),
    []
  );

  const [posts, setPosts] = useState<Post[]>(seed);
  const endRef = useRef<HTMLDivElement | null>(null);

  // infinite-ish scroll (append copies)
  useEffect(() => {
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setPosts((p) => {
            const base = p.length;
            const more = seed.map((s, idx) => ({ ...s, id: base + idx + 1 }));
            return p.concat(more);
          });
        }
      },
      { rootMargin: "800px 0px" }
    );
    if (endRef.current) io.observe(endRef.current);
    return () => io.disconnect();
  }, [seed]);

  return (
    <div className="feed-frame">
      <div className="feed-col">
        {posts.map((p, i) => {
          const kind = i % 9 === 4 ? "abstract" : i % 9 === 7 ? "tree" : "image";
          return (
            <PostCard
              key={p.id}
              post={{ ...p, kind, time: `${(i % 6) + 1}h`, tag: "#superNova" } as any}
              onPortal={onPortal}
            />
          );
        })}
        <div ref={endRef} style={{ height: 20 }} />
      </div>
    </div>
  );
}