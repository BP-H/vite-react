import { Post } from "../../types";
import PostCard from "./PostCard";

export default function Feed({
  posts,
  onPortal,
}: {
  posts: Post[];
  onPortal: (p: Post, at?: { x: number; y: number }) => void;
}) {
  return (
    <>
      {posts.map((p) => (
        <PostCard key={p.id} post={p} onPortal={onPortal} />
      ))}
      <div className="end">— end —</div>
    </>
  );
}