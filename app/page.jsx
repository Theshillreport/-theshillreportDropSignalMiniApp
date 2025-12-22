"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const connectWallet = async () => {
    if (typeof window === "undefined") return;

    if (!window.ethereum) {
      alert("Please install a wallet (Farcaster, MetaMask, Coinbase).");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!mounted) return null;

  return (
    <main style={styles.container}>
      {/* Background */}
      <div style={styles.background} />

      {/* Card */}
      <div style={styles.card}>
        <h1 style={styles.logo}>DropSignal</h1>
        <p style={styles.tagline}>Deposit. Earn. Signal.</p>

        {!account ? (
          <button onClick={connectWallet} style={styles.connectBtn}>
            Connect
          </button>
        ) : (
          <>
            <div style={styles.connected}>
              Connected
            </div>

            <div style={styles.address}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>

            <div style={styles.ready}>
              Wallet connected. App unlocked.
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    background: "#050B1E",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  background: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top, #4f46e5 0%, transparent 60%), radial-gradient(circle at bottom, #9333ea 0%, transparent 60%)",
    opacity: 0.35,
    zIndex: 0,
  },
  card: {
    zIndex: 1,
    background: "rgba(10, 15, 40, 0.85)",
    borderRadius: 20,
    padding: "40px 36px",
    width: 360,
    textAlign: "center",
    boxShadow: "0 0 60px rgba(120, 90, 255, 0.25)",
  },
  logo: {
    fontSize: 28,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 6,
  },
  tagline: {
    color: "#a5b4fc",
    fontSize: 14,
    marginBottom: 30,
  },
  connectBtn: {
    width: "100%",
    padding: "14px 0",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 600,
    color: "#fff",
    background:
      "linear-gradient(135deg, #6366f1, #9333ea)",
  },
  connected: {
    color: "#22c55e",
    fontWeight: 600,
    marginBottom: 8,
  },
  address: {
    color: "#c7d2fe",
    fontSize: 14,
    marginBottom: 16,
  },
  ready: {
    color: "#94a3b8",
    fontSize: 13,
  },
};