"use client";

export default function AppDashboard({ address }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0b1020,#1a1f3c)",
        color: "white",
        padding: "40px",
      }}
    >
      <h1 style={{ fontSize: 36, marginBottom: 10 }}>
        DropSignal Dashboard
      </h1>

      <p style={{ opacity: 0.8, marginBottom: 30 }}>
        Connected wallet:
        <br />
        <strong>
          {address.slice(0, 6)}...{address.slice(-4)}
        </strong>
      </p>

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: 16,
          padding: 24,
          maxWidth: 420,
        }}
      >
        <h2 style={{ marginBottom: 10 }}>🚀 Coming next</h2>
        <ul style={{ lineHeight: 1.8, opacity: 0.9 }}>
          <li>USDC Balance</li>
          <li>Deposit / Withdraw</li>
          <li>Yield Counter</li>
          <li>Vault Integration</li>
        </ul>
      </div>
    </main>
  );
}
