import { drops } from "./data/drops";

export default function Home() {
  return (
    <main
  <main
  style={{
    minHeight: "100vh",
    padding: 24,
    fontFamily: "system-ui",
    background: "linear-gradient(180deg, #0f0f14, #1a1a24)",
    color: "white"
  }}
>
      {drops.map(drop => (
        <div key={drop.id} style={{
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 16,
          marginTop: 12
        }}>
          <h3>{drop.title}</h3>
          <p>{drop.description}</p>
          <small>{drop.chain} • {drop.date}</small><br />
          <a href={drop.mintUrl} target="_blank">
            <button style={{ marginTop: 8 }}>Mint</button>
          </a>
        </div>
      ))}
    </main>
  );
}