"use client";

export default function AppDashboard({ address }) {
  return (
    <div
      style={{
        marginTop: 40,
        width: "100%",
        maxWidth: 420,
        background: "#121a33",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 10px 40px rgba(0,0,0,0.4)"
      }}
    >
      <h2 style={{ fontSize: 22, marginBottom: 12 }}>
        🚀 DropSignal Vault
      </h2>

      <p
        style={{
          fontSize: 14,
          opacity: 0.7,
          marginBottom: 20,
          wordBreak: "break-all"
        }}
      >
        Connected Wallet:<br />
        <strong>{address}</strong>
      </p>

      {/* BALANCE */}
      <div
        style={{
          background: "#0b1020",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16
        }}
      >
        <p style={{ fontSize: 13, opacity: 0.7 }}>USDC Balance</p>
        <p style={{ fontSize: 28, fontWeight: "bold" }}>
          0.00 USDC
        </p>
      </div>

      {/* ACTIONS */}
      <button
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 12,
          background: "linear-gradient(135deg,#00ffa3,#00d4ff)",
          border: "none",
          color: "#000",
          fontSize: 16,
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: 12
        }}
      >
        Deposit USDC
      </button>

      <button
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 12,
          background: "#1f2a52",
          border: "none",
          color: "white",
          fontSize: 16,
          cursor: "pointer"
        }}
      >
        Withdraw
      </button>

      <p
        style={{
          marginTop: 20,
          fontSize: 13,
          opacity: 0.6,
          textAlign: "center"
        }}
      >
        Yield auto-compounds 🔁
      </p>
    </div>
  );
}
