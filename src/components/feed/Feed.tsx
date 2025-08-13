import { useEffect } from "react";
import { Post } from "../../types";

export default function Feed({ onPortal }: { onPortal?: (p: Post, at?: { x: number; y: number }) => void }) {
  // Debug: log when component mounts
  useEffect(() => {
    console.log("Feed component mounted!");
  }, []);

  const posts: Post[] = [
    { 
      id: 1, 
      author: "@proto_ai", 
      title: "Ocean Study", 
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2400"
    },
    { 
      id: 2, 
      author: "@eva", 
      title: "Neon Dreams", 
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2400"
    },
  ];

  return (
    <div style={{ 
      width: "100%", 
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0f1117, #10131a)",
      padding: "20px 0"
    }}>
      {/* Debug header to prove it's rendering */}
      <div style={{ 
        padding: "20px", 
        background: "rgba(255,75,208,0.2)", 
        margin: "0 0 20px 0",
        textAlign: "center"
      }}>
        <h1 style={{ color: "#fff", margin: 0 }}>Feed is Rendering! ✨</h1>
        <p style={{ color: "#ff74de", margin: "10px 0 0" }}>If you see this, the app works!</p>
      </div>

      {posts.map((post) => (
        <article 
          key={post.id} 
          style={{
            position: "relative",
            width: "100%",
            marginBottom: "4px",
            background: "#0f1117",
            overflow: "hidden"
          }}
        >
          {/* Image */}
          <div style={{ position: "relative", width: "100%", height: "500px" }}>
            <img 
              src={post.image} 
              alt={post.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
              onError={(e) => {
                // Fallback to gradient if image fails
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                }
              }}
            />
            
            {/* Top glass bar */}
            <div style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              right: "12px",
              padding: "12px",
              background: "rgba(18,22,35,0.7)",
              backdropFilter: "blur(20px)",
              borderRadius: "16px",
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
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>now · #superNova</div>
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

            {/* Bottom action bar */}
            <div style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              right: "12px",
              padding: "8px",
              background: "rgba(18,22,35,0.7)",
              backdropFilter: "blur(20px)",
              borderRadius: "16px",
              display: "flex",
              justifyContent: "space-around"
            }}>
              {["❤️", "💬", "✨", "🔄", "🔖"].map((icon, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    if (i === 2) { // Middle button = portal
                      console.log("Portal button clicked!");
                      const rect = e.currentTarget.getBoundingClientRect();
                      onPortal?.(post, { 
                        x: rect.left + rect.width/2, 
                        y: rect.top + rect.height/2 
                      });
                    }
                  }}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    border: i === 2 ? "1px solid #ff74de" : "1px solid rgba(255,255,255,0.2)",
                    background: i === 2 ? "rgba(255,75,208,0.3)" : "rgba(20,22,34,0.7)",
                    color: "#fff",
                    fontSize: "20px",
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center"
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
