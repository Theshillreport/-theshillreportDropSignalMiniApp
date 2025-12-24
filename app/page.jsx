"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

import BackgroundMatrix from "./components/BackgroundMatrix";
import AppHeader from "./components/AppHeader";
import AppDashboard from "./components/AppDashboard";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) localStorage.setItem("dropsignal_ref", ref);
  }, []);

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

  if (address) {
    return (
      <main style={{ minHeight: "100vh", color: "white" }}>
        <BackgroundMatrix />
        <AppHeader address={address} />
        <AppDashboard address={address} />
      </main>
    );
  }

  return (
    <main style={styles.container}>
      <BackgroundMatrix />

      <div style={styles.card}>
        <img src="/logo.png" style={{ width: 120, marginBottom: 10 }} />

        <h1 style={styles.logo}>DropSignal</h1>
        <p style={styles.tagline}>
          Deposit USDC • Supercharge Your Yield • Powered by Base
        </p>

        <button onClick={connectWallet} disabled={loading} style={styles.button}>
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    color: "white",
  },
  card: {
    zIndex: 3,
    background: "rgba(10,15,40,0.9)",
    padding: 40,
    borderRadius: 20,
    width: 360,
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  logo: { fontSize: 32, fontWeight: 700 },
  tagline: { opacity: 0.9, marginBottom: 30, fontSize: 14 },
  button: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#ff9f1c,#38bdf8)",
    color: "white",
    fontSize: 16,
    cursor: "pointer",
  },
};