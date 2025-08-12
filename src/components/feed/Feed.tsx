import { useMemo } from "react";
import { Post } from "../../types";
import PostCard from "./PostCard";

export default function Feed() {
  // long, continuous feed (mix of photos + generated placeholders)
  const posts = useMemo<Post[]>(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        id: i + 1,
        author: i % 3 === 0 ? "@proto_ai" : i % 3 === 1 ? "@evaplaceholder" : "@forest_bot",
        title:
          i % 3 === 0 ? "Ocean study" : i % 3 === 1 ? "Abstract study" : "Low-poly tree",
        image:
          i % 3 === 2
            ? "" // will fall back to picsum
            : `https://picsum.photos/seed/snv${i}/1200/800`,
      })),
    []
  );

  return (
    <div>
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}