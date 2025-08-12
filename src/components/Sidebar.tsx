// src/components/Sidebar.tsx
export default function Sidebar({ onOpen }: { onOpen: () => void }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="brand">Sidebar</div>
        <button className="siri-orb" onClick={onOpen}>Open Portal</button>

        <div className="side-links">
          <div className="section">Profile</div>
          <a>My Worlds</a>
          <a>Following</a>
          <a>Discover</a>
        </div>
      </div>
    </aside>
  );
}
