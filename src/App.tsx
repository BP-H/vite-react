import { useState, useRef, useEffect } from "react";
import Feed2D from "./components/Feed2D";
import World3D from "./components/World3D";

export type Post = { id: string; title: string; author: string };

const demo: Post[] = [
  { id: "1", title: "Prototype Moment", author: "@proto_ai" },
  { id: "2", title: "Symbolic Feed", author: "@neonfork" },
  { id: "3", title: "Ocean Study", author: "@superNova_2177" },
];

type Mode = "feed" | "world";

export default function App() {
  const [mode, setMode] = useState<Mode>("feed");
  const [posts] = useState<Post[]>(demo);
  const [selected, setSelected] = useState<Post | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);

  // white-flash “sucked into the void” transition
  const portalTo = (post: Post) => {
    setSelected(post);
    const el = flashRef.current;
    if (el) {
      el.classList.remove("flash--run");
      // force reflow
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.offsetHeight;
      el.classList.add("flash--run");
    }
    setTimeout(() => setMode("world"), 260);
  };

  const backToFeed = () => {
    setMode("feed");
    setSelected(null);
  };

  useEffect(() => {
    document.body.style.overflow = mode === "world" ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [mode]);

  return (
    <div className="app">
      {mode === "feed" && (
        <Feed2D posts={posts} onEnterWorld={portalTo} />
      )}
      {mode === "world" && selected && (
        <World3D post={selected} onBack={backToFeed} />
      )}
      <div ref={flashRef} className="flash" />
    </div>
  );
}
