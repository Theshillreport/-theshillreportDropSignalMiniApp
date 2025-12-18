export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>🚀 DropSignal</h1>
      <p>Your daily alpha drops on Farcaster.</p>

      <button
        style={{
          padding: "12px 20px",
          fontSize: 16,
          cursor: "pointer",
          marginTop: 20,
        }}
        onClick={() => alert("Drop claimed!")}
      >
        Claim Today’s Drop
      </button>
    </main>
  );
}
