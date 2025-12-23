export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    } catch (e) {
      console.error(e);
    }
  };

  if (!mounted) return null;

  return (
    <main style={styles.container}>
      <div style={styles.background} />

      <div style={styles.card}>
        <h1 style={styles.logo}>DropSignal</h1>
        <p style={styles.tagline}>Deposit. Earn. Signal.</p>

        {!account ? (
          <button onClick={connectWallet} style={styles.connectBtn}>
            Connect
          </button>
        ) : (
          <>
            <div style={styles.connected}>Connected</div>
            <div style={styles.address}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
            <div style={styles.ready}>Wallet connected. App unlocked.</div>
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
    background: "#050B1E",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  background: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top, #4f46e5 0%, transparent 60%), radial-gradient(circle at bottom, #9333ea 0%, transparent 60%)",
    opacity: 0.35,
  },
  card: {
    zIndex: 1,
    background: "rgba(10,15,40,0.85)",
    borderRadius: 20,
    padding: 40,
    width: 360,
    textAlign: "center",
  },
  logo: { color: "#fff", fontSize: 28, fontWeight: 700 },
  tagline: { color: "#a5b4fc", marginBottom: 30 },
  connectBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    fontWeight: 600,
    color: "#fff",
    background: "linear-gradient(135deg,#6366f1,#9333ea)",
  },
  connected: { color: "#22c55e", marginBottom: 8 },
  address: { color: "#c7d2fe", marginBottom: 12 },
  ready: { color: "#94a3b8", fontSize: 13 },
};