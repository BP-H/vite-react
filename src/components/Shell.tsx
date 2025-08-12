import { useMemo } from "react";
import AssistantOrb from "./AssistantOrb";
import PostCard from "./feed/PostCard";
import { Post } from "../types";

export default function Shell({
  onPortal,
  hideOrb = false,
}: {
  onPortal: (p: Post, at?: { x: number; y: number }) => void;
  hideOrb?: boolean;
}) {
  // Long, continuous feed: images + procedural + tiny “model”
  const posts = useMemo<Post[]>(() => {
    const pics = [
      // Unsplash style sample images – safe to load
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496302662116-45b3b25222b4?q=80&w=1600&auto=format&fit=crop",
    ];
    const res: Post[] = [];
    for (let i = 0; i < 90; i++) {
      const kindIdx = i % 6;
      if (kindIdx === 2) {
        res.push({ id: i, author: "@proto_ai", title: "Abstract study", image: `proc:${i}` });
      } else if (kindIdx === 5) {
        res.push({ id: i, author: "@forest_bot", title: "Low-poly tree", image: `model:tree:${i}` });
      } else {
        res.push({
          id: i,
          author: i % 2 ? "@superNova_2177" : "@proto_ai",
          title: i % 2 ? "Prototype moment. Enter the void." : "Ocean study",
          image: pics[i % pics.length],
        });
      }
    }
    return res;
  }, []);

  return (
    <div className="feed-frame">
      <div className="feed-col">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} onPortal={onPortal} />
        ))}
      </div>

      {!hideOrb && (
        <AssistantOrb onPortal={onPortal} />
      )}
    </div>
  );
}