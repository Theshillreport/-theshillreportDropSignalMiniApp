"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { USDC_ADDRESS, USDC_ABI } from "../lib/usdc";

const APY = 0.085;

export default function AppDashboard({ address }) {
  const [balance, setBalance] = useState(0);
  const [liveBalance, setLiveBalance] = useState(0);
  const [amount, setAmount] = useState("");

  // Fake Startwert = 0 (realistisch)
  useEffect(() => {
    setBalance(0);
    setLiveBalance(0);
  }, []);

  // Live Yield Counter (nur UI)
  useEffect(() => {
    if (balance <= 0) return;

    const yearly = balance * APY;
    const perSecond = yearly / 31_536_000;

    const i = setInterval(() => {
      setLiveBalance((v) => v + perSecond);
    }, 1000);

    return () => clearInterval(i);
  }, [balance]);

  const deposit = () => {
    const val = Number(amount);
    if (!val || val <= 0) return;

    setBalance((b) => b + val);
    setLiveBalance((b) => b + val);
    setAmount("");
  };

  const withdraw = () => {
    setBalance(0);
    setLiveBalance(0);
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>DEPOSIT USDC TO EARN YIELD</h2>

        <p style={styles.label}>Your Balance</p>
        <div style={styles.balance}>
          ${liveBalance.toFixed(2)}
        </div>

        <div style={styles.apy}>
          ● APY {(APY * 100).toFixed(2)}%
        </div>

        <div style={styles.boosts}>
          <div style={styles.boost}>🔒 Welcome Boost +0.00%</div>
          <div style={styles.boost}>🔒 Referral Boost +0.00%</div>
        </div>

        <div style={styles.actions}>
          <button style={styles.primary} onClick={deposit}>
            Deposit
          </button>
          <button style={styles.secondary} onClick={withdraw}>
            Withdraw
          </button>
        </div>

        <input
          placeholder="0.00 USDC"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />

        <p style={styles.wallet}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "radial-gradient(circle at top, #ff9f1c, transparent 60%), radial-gradient(circle at bottom, #4cc9f0, transparent 60%), #050b1e",
    color: "white",
    fontFamily: "Inter, system-ui"
  },
  card: {
    width: 360,
    padding: 28,
    borderRadius: 24,
    background: "rgba(10,15,40,0.85)",
    boxShadow: "0 0 80px rgba(255,160,60,0.25)",
    textAlign: "center"
  },
  title: { fontSize: 14, opacity: 0.8 },
  label: { marginTop: 20, opacity: 0.6 },
  balance: { fontSize: 42, fontWeight: 700 },
  apy: { marginTop: 8, color: "#4ade80" },
  boosts: { marginTop: 20, opacity: 0.6 },
  boost: { marginTop: 6 },
  actions: {
    display: "flex",
    gap: 12,
    marginTop: 24
  },
  primary: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    border: "none",
    background: "white",
    fontWeight: 600,
    cursor: "pointer"
  },
  secondary: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    border: "none",
    background: "#111",
    color: "white",
    cursor: "pointer"
  },
  input: {
    marginTop: 16,
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "#000",
    color: "white",
    textAlign: "center"
  },
  wallet: {
    marginTop: 16,
    fontSize: 12,
    opacity: 0.5
  }
};