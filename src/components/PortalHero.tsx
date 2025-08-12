import ThreeCard from './ThreeCard';

export default function PortalHero() {
  return (
    <div className="card">
      {/* thin neon sweep */}
      <div style={{
        height:6,
        borderTopLeftRadius:999, borderTopRightRadius:999,
        background:'linear-gradient(90deg, rgba(255,31,191,.27), rgba(0,209,255,.18) 60%, transparent)',
        borderBottom:'1px solid var(--line)'
      }}/>
      <div className="card--pad" style={{ padding:0 }}>
        <ThreeCard variant="knot" />
      </div>
    </div>
  );
}
