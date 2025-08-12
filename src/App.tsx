import { useEffect, useRef, useState } from 'react';
import PortalHero from './components/PortalHero';
import PostComposer from './components/PostComposer';
import ThreeCard from './components/ThreeCard';

type Post = { id: string; author: string; time: string; text: string; image?: string; alt?: string; kind?: '3d' | 'img' | 'text' };

function makeBatch(offset: number, size = 10): Post[] {
  return Array.from({ length: size }).flatMap((_, i) => {
    const n = offset + i;
    const base: Post = {
      id: String(n),
      author: ['@proto_ai', '@neonfork', '@superNova_2177'][n % 3],
      time: new Date(Date.now() - n * 1000 * 60 * 5).toLocaleString(),
      text: n % 3 === 0
        ? 'Low-poly moment — rotating differently in each instance as you scroll.'
        : 'Prototype feed — symbolic demo copy for layout testing.'
    };
    // Mix: every 3rd item = 3D, every 2nd = image, else text
    if (n % 3 === 0) return [{ ...base, kind:'3d' }];
    if (n % 2 === 0) return [{ ...base, kind:'img', image: `https://picsum.photos/seed/sn_${n}/960/540` }];
    return [{ ...base, kind:'text' }];
  });
}

export default function App() {
  const [items, setItems] = useState<Post[]>(() => makeBatch(0, 12));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Infinite feed
  useEffect(() => {
    if (!sentinelRef.current) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (!e.isIntersecting || loading || !hasMore) return;
        setLoading(true);
        timer = setTimeout(() => {
          const next = makeBatch(page * 12, 12);
          setItems((prev) => [...prev, ...next]);
          const nextPage = page + 1;
          setPage(nextPage);
          if (nextPage >= 10) setHasMore(false);
          setLoading(false);
        }, 220);
      },
      { rootMargin: '1200px 0px 800px 0px' }
    );
    io.observe(sentinelRef.current);
    return () => { if (timer) clearTimeout(timer); io.disconnect(); };
  }, [page, loading, hasMore]);

  return (
    <>
      <header className="header">
        <div className="header__brand">GLOBALRUNWAYAI</div>
        <div className="header__spacer" />
        <a className="btn btn--primary" href="#">Launch 3D</a>
      </header>

      <div className="shell">
        {/* Left rail */}
        <aside className="left">
          <div className="card card--pad">
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ width:42, height:42, borderRadius:12, background:'#fff', border:'1px solid var(--line)' }} />
              <div>
                <div style={{ fontWeight:800 }}>taha_gungor</div>
                <div style={{ color:'var(--ink-2)' }}>artist • test_tech</div>
              </div>
            </div>
          </div>

          <div className="card card--pad nav">
            <div className="stack">
              {['Feed','Messages','Proposals','Decisions','Execution','Companies','Settings'].map(l => (
                <button key={l}>{l}</button>
              ))}
            </div>
          </div>

          <div className="card card--pad">
            <div style={{ color:'var(--ink-2)', marginBottom:8 }}>Quick stats</div>
            <div className="stack">
              <div><b>2,302</b> profile views</div>
              <div><b>1,542</b> post reach</div>
              <div><b>12</b> companies</div>
            </div>
          </div>
        </aside>

        {/* Center */}
        <section className="center" style={{ display:'grid', gap:16 }}>
          {/* Portal hero */}
          <PortalHero />

          {/* Composer */}
          <div className="card card--pad">
            <PostComposer />
          </div>

          {/* Feed */}
          <div className="feed">
            {items.map(p => (
              <article key={p.id} className="card card--pad post">
                <header>
                  <strong>{p.author}</strong>
                  <span className="muted"> • {p.time}</span>
                </header>

                {p.kind === '3d' ? (
                  <ThreeCard variant={(Number(p.id) % 3 === 0) ? 'knot' : (Number(p.id) % 3 === 1) ? 'cube' : 'ico'} />
                ) : p.kind === 'img' && p.image ? (
                  <div className="img">
                    <img src={p.image} alt={(p.alt || p.text || 'Post image').slice(0, 80)} loading="lazy" decoding="async" />
                  </div>
                ) : null}

                <p style={{ marginTop:10 }}>{p.text}</p>

                <footer style={{ display:'flex', gap:8, marginTop:10 }}>
                  <button className="btn">Like</button>
                  <button className="btn">Comment</button>
                  <button className="btn">Share</button>
                </footer>
              </article>
            ))}
            <div ref={sentinelRef} style={{ height:44, display:'grid', placeItems:'center', color:'var(--ink-2)' }}>
              {loading ? 'Loading…' : hasMore ? '' : '— End —'}
            </div>
          </div>
        </section>

        {/* Right rail */}
        <aside className="right">
          <div className="card card--pad">
            <div style={{ fontWeight:700, marginBottom:6 }}>Identity</div>
            <div style={{ color:'var(--ink-2)' }}>Switch modes and manage entities.</div>
          </div>
          <div className="card card--pad">
            <div style={{ fontWeight:700, marginBottom:6 }}>Company Control Center</div>
            <div style={{ color:'var(--ink-2)', marginBottom:10 }}>Spin up spaces, manage proposals, ship pipelines.</div>
            <div className="stack">
              <button className="btn btn--primary">Create Company</button>
              <button className="btn">Open Dashboard</button>
            </div>
          </div>
          <div className="card card--pad">
            <div style={{ fontWeight:700, marginBottom:6 }}>Shortcuts</div>
            <div className="stack">
              <button className="btn">New Proposal</button>
              <button className="btn">Start Vote</button>
              <button className="btn">Invite Member</button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
