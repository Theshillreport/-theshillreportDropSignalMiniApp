import { drops } from "./data/drops";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>🚀 DropSignal</h1>
      <p>Daily onchain drops. Signal &gt; Noise.</p>

      {drops.map((drop) => (
        <div
          key={drop.id}
          style={{
            border: "1px solid rgba(255,140,0,0.4)",
            borderRadius: 16,
            padding: 16,
            marginTop: 16,
            background: "rgba(20,20,30,0.6)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h3>{drop.title}</h3>
          <p>{drop.description}</p>
          <small>
            {drop.chain} • {drop.date}
          </small>
          <br />
          <button
            style={{
              marginTop: 10,
              background: "linear-gradient(90deg, #ff8c00, #ffb347)",
              border: "none",
              padding: "8px 16px",
              borderRadius: 999,
              fontWeight: 600,
            }}
          >
            View
          </button>
        </div>
      ))}
    </main>
  );
}