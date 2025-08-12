// src/components/AssistantOrb.tsx
import { MouseEvent } from 'react';

type Props = {
  onOpen: (x: number, y: number) => void;
  hidden?: boolean;
};

export default function AssistantOrb({ onOpen, hidden }: Props) {
  if (hidden) return null;
  const handle = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    onOpen(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  return (
    <button aria-label="Open Portal"
      className="assistant-orb"
      onClick={handle}
    >
      <span className="orb-core" />
      <span className="orb-glow" />
    </button>
  );
}
