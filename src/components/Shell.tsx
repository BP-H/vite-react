// src/components/Shell.tsx
import { PropsWithChildren } from 'react';
import BackgroundVoid from '../three/BackgroundVoid';
import AssistantOrb from './AssistantOrb';
import PortalOverlay, { usePortal, useIsWorldRoute } from './PortalOverlay';

export default function Shell({ children }: PropsWithChildren) {
  const portal = usePortal();
  const inWorld = useIsWorldRoute();

  return (
    <div className="shell">
      {/* 3D lives behind everything */}
      <BackgroundVoid />

      {/* Foreground glass layer */}
      <main className="shell-glass">
        {children}
      </main>

      {/* Floating assistant (hide on world route) */}
      <AssistantOrb
        hidden={inWorld}
        onOpen={(x, y) => portal.open(x, y, '/world')}
      />

      {/* Expanding circle transition */}
      <PortalOverlay ref={portal.ref} />
    </div>
  );
}
