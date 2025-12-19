import { drops } from "./data/drops";

export default function Home() {
  return (
    <main style={{
      padding: 24,
      maxWidth: 420,
      margin: "0 auto"
    }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>
        🚀 DropSignal
      </h1>

      <p style={{ opacity: 0.7, marginBottom: 24 }}>
        Daily onchain drops. Signal &gt; Noise.
      </p>

      {drops.map(drop => (
        <div
          key={drop.id}
          style={{
            background: "linear-gradient(180deg, #0e1324, #070a14)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            boxShadow: "0 0 30px rgba(0,255,200,0.05)"
          }}
        >
          <h3 style={{ margin: 0, fontSize: 20 }}>
            {drop.title}
          </h3>

          <p style={{ opacity: 0.8 }}>
            {drop.description}
          </p>

          <small style={{ opacity: 0.5 }}>
            {drop.chain} • {drop.date}
          </small>

          <br />

          <a href={drop.actionUrl} target="_blank">
            <button style={{
              marginTop: 14,
              padding: "10px 18px",
              borderRadius: 999,
              border: "none",
              background: "linear-gradient(90deg, #00ffc6, #00c2ff)",
              color: "#000",
              fontWeight: 600
            }}>
              {drop.actionLabel}
            </button>
          </a>
        </div>
      ))}
    </main>
  );
}