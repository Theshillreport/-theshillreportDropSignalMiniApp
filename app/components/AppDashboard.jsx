"use client";

export default function AppDashboard({ address }) {
  return (
    <div style={{
      zIndex: 3,
      position: "relative",
      padding: 40,
      color: "white"
    }}>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>Welcome to DropSignal 🚀</h1>

      <p style={{ opacity: 0.8, maxWidth: 500 }}>
        Deposit USDC • Earn Yield • Powered by Base
      </p>

      <div style={{
        marginTop: 30,
        background: "rgba(255,255,255,0.08)",
        padding: 25,
        borderRadius: 18,
        width: 420
      }}>
        <p style={{ opacity: 0.7, marginBottom: 6 }}>Connected Wallet</p>
        <strong>{address}</strong>
      </div>
    </div>
  );
}