import { useMemo } from "react";
import PostCard from "./PostCard";
import "./postcard.css";
import { Post } from "../../types";

function demo(i: number): Post {
  const pics = [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1400&auto=format&fit=crop",
  ];
  return {
    id: i,
    author: i % 3 === 0 ? "@forest_bot" : i % 2 === 0 ? "@proto_ai" : "@eva",
    title: i % 3 === 0 ? "Low‑poly tree" : i % 2 === 0 ? "Ocean study" : "Abstract study",
    image: pics[i % pics.length],
    space: "superNova_2177",
    avatar: undefined as any,
  } as Post;
}

export default function Feed({ onPortal }: { onPortal?: (p: Post, at?: { x: number; y: number }) => void }) {
  const posts = useMemo(() => Array.from({ length: 24 }, (_, i) => demo(i + 1)), []);
  return (
    <div>
      {posts.map((p) => (
        <PostCard key={p.id} post={p} onPortal={onPortal} />
      ))}
    </div>
  );
}
