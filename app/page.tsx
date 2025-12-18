export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#0b0b0f",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Inter, sans-serif"
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        DropSignal 🚀
      </h1>

      <p style={{ opacity: 0.7, marginBottom: "2rem" }}>
        Signal-based mint drops for Farcaster
      </p>

      <button style={{
        padding: "12px 24px",
        borderRadius: "12px",
        border: "none",
        background: "#7c3aed",
        color: "white",
        fontSize: "1rem",
        cursor: "pointer"
      }}>
        🔔 Enable Signal
      </button>
    </main>
  );
}