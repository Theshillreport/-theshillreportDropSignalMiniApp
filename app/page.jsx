"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import BackgroundMatrix from "./components/BackgroundMatrix";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setLoading(true);

      const { EthereumProvider } = await import(
        "@walletconnect/ethereum-provider"
      );

      const wcProvider = await EthereumProvider.init({
        projectId: "6a6f915ce160625cbc11e74f7bc284e0",
        chains: [8453],
        showQrModal: true,
        disableProviderPing: false
      });

      await wcProvider.connect();

      const browserProvider = new ethers.BrowserProvider(wcProvider);
      const signer = await browserProvider.getSigner();
      const addr = await signer.getAddress();

      setProvider(wcProvider);
      setAddress(addr);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (provider) await provider.disconnect();
    } catch {}
    setAddress(null);
  };

  return (
    <main style={styles.container}>
      <BackgroundMatrix />

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logoWrap}>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: 42, height: 42, borderRadius: 10 }}
          />
          <span style={styles.brand}>DropSignal</span>
        </div>

        {address && (
          <div style={styles.addressBadge}>
            {address.slice(0, 6)}...{address.slice(-4)}
            <button style={styles.disconnect} onClick={disconnectWallet}>
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* MAIN CARD */}
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to DropSignal</h1>

        <p style={styles.tagline}>
          Deposit USDC • Earn Yield • Powered by Base
        </p>

        {!address && (
          <button
            style={styles.button}
            onClick={connectWallet}
            disabled={loading}
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}

        {address && (
          <div style={styles.connectedBox}>
            <h3>Connected Wallet</h3>
            <p style={{ opacity: 0.9 }}>{address}</p>

            <p style={{ marginTop: 10, opacity: 0.7 }}>
              🚧 Deposit / Withdraw UI kommt gleich! (aber Design bleibt!)
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    position: "relative",
    color: "white",
  },

  header: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    display: "flex",
    justifyContent: "space-between",
    zIndex: 3,
  },

  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  brand: {
    fontSize: 26,
    fontWeight: 800,
  },

  addressBadge: {
    padding: "10px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
  },

  disconnect: {
    marginLeft: 10,
    background: "transparent",
    color: "white",
    border: "1px solid white",
    borderRadius: 8,
    padding: "5px 10px",
    cursor: "pointer",
  },

  card: {
    zIndex: 3,
    marginTop: "25vh",
    width: 380,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 30,
    borderRadius: 20,
    background: "rgba(0,0,0,0.7)",
    border: "1px solid rgba(255,255,255,0.2)",
    textAlign: "center",
  },

  title: { fontSize: 30, fontWeight: 900 },
  tagline: { opacity: 0.9, marginBottom: 22 },

  button: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    fontSize: 16,
    background: "linear-gradient(135deg,#ff9f1c,#38bdf8)",
    cursor: "pointer",
    color: "white",
  },

  connectedBox: {
    marginTop: 18,
    padding: 16,
    borderRadius: 16,
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.3)",
  },
};