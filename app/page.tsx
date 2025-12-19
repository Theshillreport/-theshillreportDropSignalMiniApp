import { drops } from "./data/drops";

export default function Home() {
  return (
    <main style={{
      maxWidth: 420,
      margin: "0 auto",
      padding: "32px 16px"
    }}>

      <h1 style={{
        fontSize: 36,
        fontWeight: 700,
        marginBottom: 8
      }}>
        🚀 DropSignal
      </h1>

      <p style={{
        opacity: 0.7,
        marginBottom: 32
      }}>
        Daily onchain drops. Signal &gt; Noise.
      </p>

      {drops.map(drop => (
        <div
          key={drop.id}
          style={{
            background: "linear-gradient(180deg, rgba(255,140,0,0.08), rgba(0,0,0,0.4))",
            border: "1px solid rgba(255,140,0,0.4)",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 40px rgba(255,140,0,0.15)"
          }}
        >
          <h3 style={{ marginBottom: 8 }}>{drop.title}</h3>

          <p style={{ opacity: 0.8, marginBottom: 12 }}>
            {drop.description}
          </p>

          <small style={{ opacity: 0.6 }}>
            {drop.chain} • {drop.date}
          </small>

          <br />

          <a href={drop.url} target="_blank">
            <button
              style={{
                marginTop: 14,
                padding: "10px 18px",
                borderRadius: 999,
                border: "none",
                background: "linear-gradient(90deg, #ff8c00, #ffb347)",
                color: "#000",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(255,140,0,0.6)"
              }}
            >
              View Drop →
            </button>
          </a>
        </div>
      ))}
    </main>
  );
}