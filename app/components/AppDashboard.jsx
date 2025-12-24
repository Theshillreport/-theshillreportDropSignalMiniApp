"use client";
import { useEffect, useState } from "react";

export default function AppDashboard({ address }) {
  const [deposited, setDeposited] = useState(0);
  const [yieldRate] = useState(12); // 12% APY Beispiel
  const [earnings, setEarnings] = useState(0);

  // Simulierter Live Counter
  useEffect(() => {
    if (!deposited) return;

    const interval = setInterval(() => {
      setEarnings(e => e + deposited * (yieldRate / 100 / 365 / 24 / 60));
    }, 1000);

    return () => clearInterval(interval);
  }, [deposited, yieldRate]);

  return (
    <div style={styles.box}>
      <h2>Dashboard</h2>

      <p style={styles.addr}>
        Connected: {address.slice(0, 6)}...{address.slice(-4)}
      </p>

      <div style={styles.card}>
        <p>Total Deposited:</p>
        <h3>{deposited.toFixed(2)} USDC</h3>
      </div>

      <div style={styles.card}>
        <p>Live Earnings:</p>
        <h3>+{earnings.toFixed(6)} USDC</h3>
      </div>

      <div style={styles.card}>
        <p>APY:</p>
        <h3>{yieldRate}%</h3>
      </div>

      <button style={styles.deposit} onClick={() => setDeposited(d => d + 100)}>
        Deposit 100 USDC
      </button>

      <button
        style={styles.withdraw}
        onClick={() => {
          setDeposited(0);
          setEarnings(0);
        }}
      >
        Withdraw All
      </button>

      <div style={styles.footerBox}>
        Deposit USDC • Supercharge Your Yield • Powered by Base
      </div>
    </div>
  );
}

const styles = {
  box: {
    marginTop: 40,
    padding: 20,
    borderRadius: 14,
    background: "rgba(0,0,0,.6)",
    border: "1px solid rgba(255,255,255,.2)",
    textAlign: "center",
    zIndex: 10
  },
  addr: { opacity: 0.7, fontSize: 12 },
  card: {
    background: "rgba(255,255,255,.08)",
    borderRadius: 12,
    padding: 12,
    marginTop: 10
  },
  deposit: {
    marginTop: 20,
    padding: "12px 22px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg,#19c37d,#00ffaa)",
    color: "#000",
    cursor: "pointer",
    fontWeight: 700
  },
  withdraw: {
    marginTop: 10,
    padding: "12px 22px",
    borderRadius: 10,
    border: "1px solid white",
    background: "transparent",
    color: "white",
    cursor: "pointer"
  },
  footerBox: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    background: "rgba(255,255,255,.12)"
  }
};