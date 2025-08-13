import { Post } from "../../types";
import "./Feed.css";

const POSTS: Post[] = [
  { 
    id: 1, 
    author: "@forest_bot", 
    title: "Low-poly dreams", 
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2400",
    space: "superNova_2177"
  },
  { 
    id: 2, 
    author: "@proto_ai", 
    title: "Ocean study", 
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2400",
    space: "GLOBALRUNWAY"
  },
  { 
    id: 3, 
    author: "@eva", 
    title: "Neon cascade", 
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2400",
    space: "superNova_2177"
  },
];

export default function Feed({ onPortal }: { onPortal?: (p: Post, at?: { x: number; y: number }) => void }) {
  return (
    <div className="feed-container">
      {POSTS.map((post) => (
        <article key={post.id} className="feed-card">
          <div className="feed-media">
            <img src={post.image} alt={post.title} loading="lazy" />
            
            {/* Top frosted glass bar */}
            <div className="feed-top-bar">
              <div className="feed-avatar">
                <div className="feed-avatar-glow" />
              </div>
              <div className="feed-meta">
                <div className="feed-author">{post.author}</div>
                <div className="feed-info">now · {post.space}</div>
              </div>
              <div className="feed-title">{post.title}</div>
            </div>
            
            {/* Bottom frosted action bar */}
            <div className="feed-bottom-bar">
              <button className="feed-btn" aria-label="Profile">
                <svg viewBox="0 0 24 24" className="feed-icon"><circle cx="12" cy="12" r="10"/></svg>
              </button>
              <button className="feed-btn" aria-label="Like">
                <svg viewBox="0 0 24 24" className="feed-icon"><path d="M12 21s-7-4-9-8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4-9 8-9 8z"/></svg>
              </button>
              <button 
                className="feed-btn feed-btn-primary" 
                aria-label="Enter world"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  onPortal?.(post, { x: rect.left + rect.width/2, y: rect.top + rect.height/2 });
                }}
              >
                <svg viewBox="0 0 24 24" className="feed-icon"><path d="M12 2l3 7 7 1-5 4 1 7-6-4-6 4 1-7-5-4 7-1z"/></svg>
              </button>
              <button className="feed-btn" aria-label="Comment">
                <svg viewBox="0 0 24 24" className="feed-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/></svg>
              </button>
              <button className="feed-btn" aria-label="Share">
                <svg viewBox="0 0 24 24" className="feed-icon"><path d="M4 12v8h16v-8M12 2v14M7 7l5-5 5 5"/></svg>
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
