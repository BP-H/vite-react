// src/components/AssistantOrb.tsx
import { MouseEvent } from "react";

type Props = {
  hidden?: boolean;
  onOpen: (x: number, y: number) => void;
};

export default function AssistantOrb({ hidden, onOpen }: Props) {
  if (hidden) return null;

  const handle = (e: MouseEvent<HTMLButtonElement>) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    onOpen(r.left + r.width / 2, r.top + r.height / 2);
  };

  return (
    <button aria-label="Open Portal" className="assistant-orb" onClick={handle}>
      <span className="orb-core" />
      <span className="orb-glow" />
    </button>
  );
}
