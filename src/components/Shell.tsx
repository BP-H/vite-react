import { useMemo } from "react";
import Sidebar from "./Sidebar";
import AssistantOrb from "./AssistantOrb";
import Feed from "./feed/Feed";
import { Post } from "../types";

export default function Shell({
  onPortal,
  hideOrb = false,
}: {
  onPortal: (post: Post, at?: { x: number; y: number }) => void;
  hideOrb?: boolean;
}) {
  // demo posts (replace with your real data if you have it)
  const posts = useMemo<Post[]>(
    () => [
      {
        id: 1,
        author: "@superNova_2177",
        title: "Prototype moment. Enter the void.",
        image:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop",
      },
      {
        id: 2,
        author: "@proto_ai",
        title: "Ocean study",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
      },
      {
        id: 3,
        author: "@test_tech",
        title: "City textures",
        image:
          "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    []
  );

  return (
    <>
      {/* overlay morphing sidebar (fixed) */}
      <Sidebar />

      {/* center feed */}
      <div className="feed-frame">
        <div className="feed-col">
          <Feed posts={posts} onPortal={onPortal} />
        </div>
      </div>

      {!hideOrb && <AssistantOrb onPortal={(p, at) => onPortal(p, at)} hidden={false} />}
    </>
  );
}