"use client";

import { useEffect, useState } from "react";

export default function AppClient() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0.00");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install a wallet");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
  };

  return (
    <main style={styles.container}>
      <div style={styles.background} />

      <div style={styles.card}>
        <h1 style={styles.logo}>DropSignal</h1>
        <p style={styles.tagline}>Deposit USDC. Earn Yield.</p>

        {!account ? (
          <button onClick={connectWallet} style={styles.primary}>
            Connect Wallet
          </button>
        ) : (
          <>
            <div style={styles.address}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>

            <div style={styles.balance}>
              Your Balance
              <span>{balance} USDC</span>
            </div>

            <div style={styles.actions}>
              <button style={styles.secondary}>Deposit</button>
              <button style={styles.secondary}>Withdraw</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#050b1e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  background: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top, #fb923c 0%, transparent 60%), radial-gradient(circle at bottom, #38bdf8 0%, transparent 60%)",
    opacity: 0.35,
  },
  card: {
    position: "relative",
    zIndex: 1,
    width: 360,
    padding: 36,
    borderRadius: 20,
    background: "rgba(10,15,40,0.85)",
    textAlign: "center",
  },
  logo: { color: "#fff", fontSize: 28, fontWeight: 700 },
  tagline: { color: "#93c5fd", marginBottom: 24 },
  primary: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    background: "linear-gradient(135deg,#fb923c,#38bdf8)",
    border: "none",
    color: "#000",
    fontWeight: 700,
  },
  address: { color: "#a5b4fc", marginBottom: 16 },
  balance: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 20,
  },
  actions: { display: "flex", gap: 12 },
  secondary: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#020617",
    color: "#fff",
  },
};