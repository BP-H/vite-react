import { Post } from "../../types";

export default function Feed({ onPortal }: { onPortal?: (p: Post, at?: { x: number; y: number }) => void }) {
  const posts = [
    { id: 1, author: "@proto_ai", title: "Ocean study", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600" },
    { id: 2, author: "@eva", title: "Abstract", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600" },
  ];
  
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: "white" }}>Feed is working!</h1>
      {posts.map(p => (
        <div key={p.id} style={{ margin: "20px 0", padding: 20, background: "rgba(255,255,255,0.1)", borderRadius: 10 }}>
          <img src={p.image} alt={p.title} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }} />
          <h3 style={{ color: "white" }}>{p.title}</h3>
          <p style={{ color: "#aaa" }}>by {p.author}</p>
          <button onClick={() => onPortal?.(p, { x: 100, y: 100 })} style={{ padding: "8px 16px", background: "#ff4bd0", color: "white", border: "none", borderRadius: 6 }}>
            Enter World
          </button>
        </div>
      ))}
    </div>
  );
}
