import type { ReactNode } from "react";

type Props = { children: ReactNode };

export default function Shell({ children }: Props) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">Portal</div>
        <nav>
          <a className="nav-item" href="#">Home</a>
          <a className="nav-item" href="#">Explore</a>
          <a className="nav-item" href="#">Bookmarks</a>
          <a className="nav-item" href="#">Profile</a>
        </nav>
      </aside>

      <header className="header">
        <div className="header-title">Feed</div>
        <input className="search" placeholder="Search…" aria-label="Search" />
      </header>

      <main className="main">{children}</main>
    </div>
  );
}