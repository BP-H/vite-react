// src/components/Topbar.tsx
import { useLayoutEffect, useRef } from "react";

export default function Topbar() {
  const ref = useRef<HTMLDivElement>(null);

  // measure to set --topbar-h (handy if you make other sticky sections)
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () =>
      document.documentElement.style.setProperty("--topbar-h", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <header ref={ref} className="header" role="banner">
      <strong>superNova • vite</strong>
      <div className="header__spacer" />
      <input
        placeholder="Search..."
        aria-label="Search"
        className="field"
      />
      <div className="spacer" />
      <a className="btn btn--primary" href="https://github.com/BP-H/vite-react" target="_blank" rel="noreferrer">
        Repo
      </a>
    </header>
  );
}
