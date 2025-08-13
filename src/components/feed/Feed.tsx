import { Post } from "../../types";

export default function Feed({ onPortal }: { onPortal?: (p: Post, at?: { x: number; y: number }) => void }) {
  const posts: Post[] = [
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

  return (
    <div style={{ 
      width: "100%", 
      display: "flex", 
      flexDirection: "column", 
      gap: "20px",
      padding: "20px 0"
    }}>
      {posts.map((post) => (
        <article key={post.id} style={{
          position: "relative",
          width: "100%",
          height: "600px",
          overflow: "hidden",
          borderRadius: "16px",
          background: "#0f1117"
        }}>
          <img 
            src={post.image} 
            alt={post.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
          
          {/* Top bar */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "16px",
            background: "rgba(18, 20, 32, 0.6)",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #fff, #ff74de, #ff4bd0)"
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: "bold" }}>{post.author}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
                now · {post.space || "#superNova"}
              </div>
            </div>
            <div style={{
              padding: "6px 12px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "999px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "bold"
            }}>
              {post.title}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px",
            background: "rgba(18, 20, 32, 0.6)",
            backdropFilter: "blur(20px)",
            display: "flex",
            justifyContent: "space-around"
          }}>
            <button style={buttonStyle}>❤️</button>
            <button style={buttonStyle}>💬</button>
            <button 
              style={{...buttonStyle, background: "rgba(255,75,208,0.3)"}}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                onPortal?.(post, { 
                  x: rect.left + rect.width/2, 
                  y: rect.top + rect.height/2 
                });
              }}
            >
              ✨
            </button>
            <button style={buttonStyle}>📤</button>
            <button style={buttonStyle}>🔖</button>
          </div>
        </article>
      ))}
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(20,22,34,0.7)",
  color: "#fff",
  fontSize: "18px",
  cursor: "pointer"
};
