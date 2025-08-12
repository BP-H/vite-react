import type { Post } from "../types";
import { demoPosts } from "../types";

type Props = {
  posts?: Post[];
  onOpenWorld?: (post?: Post) => void;
};

export default function Feed2D({ posts, onOpenWorld }: Props) {
  const data = posts ?? demoPosts;

  return (
    <div className="feed-screen">
      <div className="feed-rail-bg" aria-hidden />
      <div className="feed">
        {data.map((p) => (
          <article key={p.id} className="card frosted">
            <header className="post-head">
              <strong>{p.author}</strong>
              <span className="muted"> • demo</span>
            </header>

            <h3 className="post-title">{p.title}</h3>

            <div className="media">
              <div
                className="fake-img"
                role="img"
                aria-label={`${p.title} preview`}
                onClick={() => onOpenWorld?.(p)}
                title="Enter world"
              />
            </div>

            <footer className="post-actions">
              <button className="chip" onClick={() => onOpenWorld?.(p)}>Enter world</button>
              <button className="chip">Like</button>
              <button className="chip">Share</button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
