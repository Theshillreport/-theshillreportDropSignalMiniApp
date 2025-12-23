"use client";

import { useState } from "react";

const APY = 8.5;

export default function AppDashboard({ address }) {
  const [balance, setBalance] = useState(0);
  const [depositOpen, setDepositOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const handleDeposit = () => {
    if (!amount) return;
    setBalance((b) => b + Number(amount));
    setAmount("");
    setDepositOpen(false);
  };

  return (
    <main style={styles.container}>
      {/* Background */}
      <div style={styles.bg} />

      {/* Card */}
      <div style={styles.card}>
        <h1 style={styles.title}>DropSignal Vault</h1>

        <p style={styles.address}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>

        {/* Balance */}
        <div style={styles.balanceBox}>
          <span style={styles.label}>Your Balance</span>
          <div style={styles.balance}>{balance.toFixed(2)} USDC</div>
          <span style={styles.apy}>APY {APY}%</span>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button
            style={styles.primary}
            onClick={() => setDepositOpen(true)}
          >
            Deposit
          </button>

          <button style={styles.secondary}>Withdraw</button>
        </div>

        {/* Status */}
        <div style={styles.status}>
          🟢 Vault active · Yield accruing
        </div>
      </div>

      {/* Deposit Modal */}
      {depositOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Deposit USDC</h3>

            <input
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
            />

            <button style={styles.primary} onClick={handleDeposit}>
              Confirm Deposit
            </button>

            <button
              style={styles.close}
              onClick={() => setDepositOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
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
    fontFamily: "Inter, system-ui"
  },
  bg: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top, #ff8a00, transparent 60%), radial-gradient(circle at bottom, #00d4ff, transparent 60%)",
    opacity: 0.35
  },
  card: {
    zIndex: 1,
    width: 360,
    background: "rgba(10,15,30,0.85)",
    borderRadius: 20,
    padding: 32,
    color: "white",
    boxShadow: "0 0 60px rgba(255,138,0,0.25)"
  },
  title: {
    fontSize: 26,
    marginBottom: 6
  },
  address: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 24
  },
  balanceBox: {
    textAlign: "center",
    marginBottom: 24
  },
  label: {
    fontSize: 13,
    opacity: 0.6
  },
  balance: {
    fontSize: 34,
    fontWeight: 700,
    margin: "6px 0"
  },
  apy: {
    fontSize: 13,
    color: "#7dd3fc"
  },
  actions: {
    display: "flex",
    gap: 12
  },
  primary: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#ff8a00,#00d4ff)",
    color: "white",
    fontWeight: 600,
    cursor: "pointer"
  },
  secondary: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white",
    cursor: "pointer"
  },
  status: {
    marginTop: 24,
    fontSize: 13,
    opacity: 0.7,
    textAlign: "center"
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    background: "#0b1020",
    padding: 24,
    borderRadius: 16,
    width: 300,
    color: "white"
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "none",
    margin: "16px 0"
  },
  close: {
    marginTop: 10,
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer"
  }
};