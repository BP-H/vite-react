import Sidebar from "./Sidebar";
import Feed2D from "./Feed2D";
import AssistantOrb from "./AssistantOrb";
import { Post } from "../types";

type Props = {
  onPortal: (post: Post, at: { x: number; y: number }) => void;
  hideOrb?: boolean;
};

export default function Shell({ onPortal, hideOrb = false }: Props) {
  const openFromSidebar = () =>
    onPortal(
      { id: -1, author: "@proto_ai", title: "Prototype Moment", image: "" },
      { x: window.innerWidth - 56, y: window.innerHeight - 56 }
    );

  return (
    <div className="app-root">
      <Sidebar onOpen={openFromSidebar} />
      <main className="content">
        <Feed2D onEnterWorld={onPortal} />
      </main>
      <AssistantOrb hidden={hideOrb} onPortal={onPortal} />
    </div>
  );
}
