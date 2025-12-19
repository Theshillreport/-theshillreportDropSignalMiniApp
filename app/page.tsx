export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 420, margin: "0 auto" }}>

      <h1 style={{ fontSize: 32 }}>
        🚀 <span style={{ color: "#FF8A00" }}>Drop</span>
        <span style={{ color: "#4FD1FF" }}>Signal</span>
      </h1>

      <p style={{ opacity: 0.7 }}>
        Deposit USDC. Earn daily yield.
      </p>

      {/* BALANCE CARD */}
      <div style={card}>
        <p style={{ opacity: 0.6 }}>Your Balance</p>
        <h2>$0 USDC</h2>
        <p style={{ color: "#4FD1FF" }}>+ $2.34 today</p>
      </div>

      {/* YIELD CARD */}
      <div style={card}>
        <p style={{ opacity: 0.6 }}>Current APY</p>
        <h2 style={{ color: "#FF8A00" }}>18.4%</h2>
        <p style={{ opacity: 0.6 }}>Compounded daily</p>
      </div>

      {/* ACTIONS */}
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button style={deposit}>Deposit USDC</button>
        <button style={withdraw}>Withdraw</button>
      </div>

      {/* DAILY REWARD */}
      <div style={{ ...card, marginTop: 24 }}>
        <p style={{ opacity: 0.6 }}>Daily Reward</p>
        <h3>+ $0</h3>
        <button style={claim}>Claim</button>
      </div>

    </main>
  );
}

const card = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(79,209,255,0.35)",
  borderRadius: 16,
  padding: 16,
  marginTop: 16,
  boxShadow: "0 0 40px rgba(79,209,255,0.08)"
};

const deposit = {
  flex: 1,
  padding: 14,
  borderRadius: 12,
  background: "linear-gradient(135deg,#FF8A00,#FFB347)",
  color: "black",
  fontWeight: 700,
  border: "none"
};

const withdraw = {
  flex: 1,
  padding: 14,
  borderRadius: 12,
  background: "transparent",
  color: "#4FD1FF",
  border: "1px solid #4FD1FF"
};

const claim = {
  marginTop: 12,
  width: "100%",
  padding: 12,
  borderRadius: 10,
  background: "#4FD1FF",
  color: "#000",
  border: "none",
  fontWeight: 600
};