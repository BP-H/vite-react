// src/components/Sidebar.tsx
type Props = { onOpen: () => void };

export default function Sidebar({ onOpen }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="brand">Sidebar</div>
        <button className="siri-orb" onClick={onOpen}>Open Portal</button>

        <nav className="side-links">
          <div className="section">Profile</div>
          <a>My Worlds</a>
          <a>Following</a>
          <a>Discover</a>
        </nav>
      </div>
    </aside>
  );
}
