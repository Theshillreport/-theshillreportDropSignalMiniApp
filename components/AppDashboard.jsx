export default function AppDashboard({ address }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        marginTop: 40,
        padding: 24,
        borderRadius: 16,
        background: "#121a36",
        boxShadow: "0 0 40px rgba(0,0,0,0.4)"
      }}
    >
      <h2 style={{ marginBottom: 8 }}>Welcome</h2>
      <p style={{ opacity: 0.7, marginBottom: 20 }}>
        {address.slice(0, 6)}...{address.slice(-4)}
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        <button style={btn}>Deposit USDC</button>
        <button style={btn}>Withdraw</button>
        <button style={btn}>Vault Stats</button>
      </div>

      <div style={{ marginTop: 24, opacity: 0.6, fontSize: 14 }}>
        APY: 12.4% <br />
        TVL: $1,284,230
      </div>
    </div>
  );
}

const btn = {
  padding: "14px",
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg,#7c5cff,#00d4ff)",
  color: "white",
  fontSize: 15,
  cursor: "pointer"
};
