import { Post } from "../../types";

export default function Feed({ onPortal }: { onPortal?: (p: Post, at?: { x: number; y: number }) => void }) {
  // Hardcoded posts to ensure something renders
  const posts: Post[] = [
    { 
      id: 1, 
      author: "@proto_ai", 
      title: "Test Post 1", 
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%234c1d95' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='white' font-size='30'%3EImage 1%3C/text%3E%3C/svg%3E"
    },
    { 
      id: 2, 
      author: "@eva", 
      title: "Test Post 2", 
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23dc2626' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='white' font-size='30'%3EImage 2%3C/text%3E%3C/svg%3E"
    },
  ];

  // Inline everything to avoid CSS issues
  return (
    <div style={{ 
      width: "100%", 
      minHeight: "100vh",
      background: "#0b0d12",
      color: "white",
      padding: "20px"
    }}>
      <h1 style={{ color: "white", marginBottom: "20px" }}>Feed is Working!</h1>
      
      {posts.map((post) => (
        <div 
          key={post.id} 
          style={{
            marginBottom: "20px",
            padding: "20px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)"
          }}
        >
          <img 
            src={post.image} 
            alt={post.title}
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "10px"
            }}
          />
          <h3 style={{ color: "white", margin: "10px 0" }}>{post.title}</h3>
          <p style={{ color: "#aaa", marginBottom: "10px" }}>by {post.author}</p>
          <button 
            onClick={(e) => {
              console.log("Button clicked for post:", post.id);
              const rect = e.currentTarget.getBoundingClientRect();
              onPortal?.(post, { 
                x: rect.left + rect.width/2, 
                y: rect.top + rect.height/2 
              });
            }}
            style={{
              padding: "10px 20px",
              background: "#ff4bd0",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Enter World
          </button>
        </div>
      ))}
    </div>
  );
}
