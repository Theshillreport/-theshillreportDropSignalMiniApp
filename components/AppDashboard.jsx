"use client";

import { useState } from "react";

export default function AppDashboard({ address }) {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const APY = 8.5;

  const deposit = () => {
    if (!amount || Number(amount) <= 0) return;
    setBalance((prev) => prev + Number(amount));
    setAmount("");
  };

  const withdraw = () => {
    if (!amount || Number(amount) <= 0) return;
    setBalance((prev) => Math.max(prev - Number(amount), 0));
    setAmount("");
  };

  return (
    <main style={styles.container}>
      {/* Background */}
      <div style={styles.background} />

      {/* Dashboard Card */}
      <div style={styles.card}>
        <h1 style={styles.title}>DropSignal Vault</h1>

        <p style={styles.address}>
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </p>

        {/* Balance */}
        <div style={styles.balanceBox}>
          <p style={styles.label}>Your Balance</p>
          <h2 style={styles.balance}>
            {balance.toFixed(2)} <span style={{ fontSize: 18 }}>USDC</span>
          </h2>
          <p style={styles.apy}>APY: {APY}%</p>
        </div>

        {/* Input */}
        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />

        {/* Actions */}
        <div style={styles.actions}>
          <button onClick={deposit} style={styles.deposit}>
            Deposit
          </button>
          <button onClick={withdraw} style={styles.withdraw}>
            Withdraw
          </button>
        </div>

        {/* Status */}
        <div style={styles.status}>
          <p>🟢 Vault Active</p>
          <p>🔄 Yield Accruing</p>
        </div>
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#060b18",
    overflow: "hidden",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  background: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top left, #ff8a00 0%, transparent 55%), radial-gradient(circle at bottom right, #38bdf8 0%, transparent 55%)",
    opacity: 0.45,
  },
  card: {
    position: "relative",
    zIndex: 1,
    width: 380,
    padding: "36px 32px",
    borderRadius: 22,
    background: "rgba(15, 20, 40, 0.85)",
    boxShadow: "0 0 80px rgba(255,138,0,0.25)",
    color: "white",
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 8,
  },
  address: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 28,
  },
  balanceBox: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  balance: {
    fontSize: 40,
    fontWeight: 700,
    margin: "6px 0",
  },
  apy: {
    fontSize: 14,
    color: "#7dd3fc",
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    marginBottom: 16,
    fontSize: 16,
  },
  actions: {
    display: "flex",
    gap: 12,
    marginBottom: 24,
  },
  deposit: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg,#ff8a00,#ffb703)",
    color: "#111",
    fontWeight: 700,
    cursor: "pointer",
  },
  withdraw: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
    color: "#04121f",
    fontWeight: 700,
    cursor: "pointer",
  },
  status: {
    fontSize: 13,
    opacity: 0.8,
    lineHeight: 1.6,
  },
};