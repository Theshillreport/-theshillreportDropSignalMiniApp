"use client";

import { useState } from "react";
import { ethers } from "ethers";
import BackgroundMatrix from "./components/BackgroundMatrix";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setLoading(true);

      // Session reset -> VERHINDERT AUTO CONNECT
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("wc@2:core:pairing");
        localStorage.removeItem("wc@2:client:session");
      }

      const { EthereumProvider } = await import(
        "@walletconnect/ethereum-provider"
      );

      const wcProvider = await EthereumProvider.init({
        projectId: "6a6f915ce160625cbc11e74f7bc284e0",
        chains: [8453],
        showQrModal: true
      });

      await wcProvider.connect();

      const browserProvider = new ethers.BrowserProvider(wcProvider);
      const signer = await browserProvider.getSigner();
      const addr = await signer.getAddress();

      setProvider(wcProvider);
      setAddress(addr);

      wcProvider.on("disconnect", () => setAddress(null));
    } catch (err) {
      console.log("Wallet error:", err);
    }

    setLoading(false);
  };

  const disconnectWallet = async () => {
    try {
      if (provider) await provider.disconnect();
    } catch {}
    setAddress(null);

    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("wc@2:client:session");
    }
  };

  return (
    <main style={styles.container}>
      <BackgroundMatrix />

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logoWrap}>
          <img src="/logo.png" style={styles.logo} alt="logo" />
          <span style={styles.brand}>DropSignal</span>
        </div>

        {address && (
          <div style={styles.walletBox}>
            {address.slice(0, 6)}...{address.slice(-4)}
            <button style={styles.disconnect} onClick={disconnectWallet}>
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* MAIN CARD */}
      <div style={styles.card}>
        <h1 style={styles.title}>DropSignal</h1>
        <p style={styles.sub}>Deposit • Earn • Base Network</p>

        {!address && (
          <button style={styles.btn} onClick={connectWallet} disabled={loading}>
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}

        {address && (
          <div style={styles.connectedBox}>
            <h3>Wallet Connected</h3>
            <p>{address}</p>
            <p style={{ opacity: 0.7 }}>
              Dashboard wird gleich eingebaut – aber App bleibt jetzt stabil 😎
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: { width: "100%", minHeight: "100vh", position: "relative", color: "white" },
  header: {
    position: "absolute", top: 20, left: 20, right: 20,
    display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 3,
  },
  logoWrap: { display: "flex", alignItems: "center", gap: 12 },
  logo: { width: 42, height: 42, borderRadius: 10, objectFit: "cover" },
  brand: { fontSize: 26, fontWeight: 900 },

  walletBox: {
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.2)",
    border: "1px solid rgba(255,255,255,0.4)",
  },

  disconnect: {
    marginLeft: 10,
    background: "transparent",
    border: "1px solid white",
    borderRadius: 8,
    padding: "4px 8px",
    color: "white",
  },

  card: {
    zIndex: 3,
    width: 380,
    margin: "28vh auto 0",
    padding: 30,
    textAlign: "center",
    borderRadius: 18,
    background: "rgba(0,0,0,0.7)",
    border: "1px solid rgba(255,255,255,0.25)",
  },

  title: { fontSize: 32, fontWeight: 900 },
  sub: { marginBottom: 20, opacity: 0.9 },

  btn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#ff9f1c,#38bdf8)",
    color: "white",
    fontSize: 17,
    cursor: "pointer",
  },

  connectedBox: {
    marginTop: 18,
    padding: 16,
    borderRadius: 16,
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.3)",
  },
};