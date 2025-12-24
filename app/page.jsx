"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import BackgroundMatrix from "./components/BackgroundMatrix";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  // Save referral
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) localStorage.setItem("dropsignal_ref", ref);
  }, []);

  const connectWallet = async () => {
    if (typeof window === "undefined") return;

    try {
      setLoading(true);

      const { EthereumProvider } = await import(
        "@walletconnect/ethereum-provider"
      );

      const wcProvider = await EthereumProvider.init({
        projectId: "6a6f915ce160625cbc11e74f7bc284e0",
        chains: [8453],
        showQrModal: true,
      });

      await wcProvider.connect();

      const provider = new ethers.BrowserProvider(wcProvider);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      setAddress(addr);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ========= CONNECTED UI =========
  const walletUI = address ? (
    <div style={styles.connectedBox}>
      <h3 style={{ marginBottom: 6 }}>Connected Wallet</h3>
      <p style={{ opacity: 0.9 }}>
        {address}
      </p>
    </div>
  ) : null;

  return (
    <main style={styles.container}>
      <BackgroundMatrix />

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logoWrap}>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: 40, height: 40, borderRadius: 10 }}
          />
          <span style={styles.brand}>DropSignal</span>
        </div>

        {address && (
          <div style={styles.addressBadge}>
            {address.slice(0, 6)}...
            {address.slice(-4)}
          </div>
        )}
      </div>

      {/* MAIN CARD */}
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to DropSignal</h1>

        <p style={styles.tagline}>
          Deposit USDC • Earn Yield • Powered by Base
        </p>

        {/* CONNECT BUTTON ONLY IF NOT CONNECTED */}
        {!address && (
          <button
            onClick={connectWallet}
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}

        {/* WALLET BOX WHEN CONNECTED */}
        {walletUI}
      </div>
    </main>
  );
}

// ===== STYLES =====
const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    background: "#02050f",
    overflow: "hidden",
    position: "relative",
    color: "white",
  },

  header: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 3,
  },

  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  brand: {
    fontSize: 24,
    fontWeight: 700,
  },

  addressBadge: {
    padding: "10px 16px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
  },

  card: {
    zIndex: 3,
    marginTop: "25vh",
    marginLeft: "auto",
    marginRight: "auto",
    width: 380,
    background: "rgba(0,0,0,0.7)",
    borderRadius: 20,
    padding: 30,
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.2)",
  },

  title: {
    fontSize: 28,
    fontWeight: 800,
  },

  tagline: {
    marginTop: 10,
    opacity: 0.9,
    fontSize: 14,
    marginBottom: 25,
  },

  button: {
    width: "100%",
    padding: 14,
    fontSize: 16,
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg,#ff9f1c,#38bdf8)",
    color: "white",
  },

  connectedBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.3)",
  },
};