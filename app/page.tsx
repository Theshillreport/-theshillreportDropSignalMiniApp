import { drops } from "./data/drops";

export default function Home() {
  return (
    <main
  style={{
  background: "#18181f",
  border: "1px solid #2a2a35",
  borderRadius: 12,
  padding: 16,
  marginTop: 12
}}
>
      <h1>🚀 DropSignal</h1>
      <p>Daily onchain drops. Signal &gt; Noise.</p>

      {drops.map((drop) => (
        <div
          key={drop.id}
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 16,
            marginTop: 12,
          }}
        >
          <h3>{drop.title}</h3>
          <p>{drop.description}</p>
          <small>
            {drop.chain} • {drop.date}
          </small>
          <br />
          <a href={drop.mintUrl} target="_blank" rel="noreferrer">
            <button style={{ marginTop: 8 }}>Mint</button>
          </a>
        </div>
      ))}
    </main>
  );
}