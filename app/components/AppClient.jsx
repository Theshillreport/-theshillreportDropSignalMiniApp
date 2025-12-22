"use client";

import { useEffect, useState } from "react";

export default function AppClient() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0.00");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install a wallet (Farcaster / MetaMask / Coinbase)");
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
          <button style={styles.primaryBtn} onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <>
            <div style={styles.address}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>

            <div style={styles.balance}>
              Your Balance  
              <strong>{balance} USDC</strong>
            </div>

            <button style={styles.primaryBtn}>Deposit</button>
            <button style={styles.secondaryBtn}>Withdraw</button>
          </>
        )}
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
    background: "#020617",
    fontFamily: "Inter, system-ui",
    position: "relative",
  },
  background: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top, #38bdf8 0%, transparent 60%), radial-gradient(circle at bottom, #f97316 0%, transparent 60%)",
    opacity: 0.35,
  },
  card: {
    zIndex: 1,
    width: 360,
    padding: 32,
    borderRadius: 20,
    background: "rgba(15,23,42,.9)",
    boxShadow: "0 0 60px rgba(56,189,248,.3)",
    textAlign: "center",
  },
  logo: { color: "#fff", fontSize: 28, fontWeight: 700 },
  tagline: { color: "#7dd3fc", marginBottom: 24 },
  address: { color: "#94a3b8", marginBottom: 12 },
  balance: { color: "#fff", marginBottom: 20 },
  primaryBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    background: "linear-gradient(135deg,#38bdf8,#f97316)",
    color: "#000",
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    marginBottom: 12,
  },
  secondaryBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    background: "transparent",
    border: "1px solid #38bdf8",
    color: "#38bdf8",
    cursor: "pointer",
  },
};