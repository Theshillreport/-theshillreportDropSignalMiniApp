"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import AppDashboard from "../components/AppDashboard";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔗 Referral speichern
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("dropsignal_ref", ref);
    }
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (address) {
    return <AppDashboard address={address} />;
  }

  return (
    <main style={styles.container}>
      <div style={styles.bg} />

      <div style={styles.card}>
        <h1 style={styles.logo}>DropSignal</h1>
        <p style={styles.tagline}>
          Deposit USDC · Earn Yield · Built on Base
        </p>

        <button
          onClick={connectWallet}
          disabled={loading}
          style={styles.button}
        >
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
    background: "#050b1e",
    position: "relative",
    color: "white",
  },
  bg: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top left, #ff9f1c 0%, transparent 55%), radial-gradient(circle at bottom right, #38bdf8 0%, transparent 55%)",
    opacity: 0.45,
  },
  card: {
    zIndex: 1,
    background: "rgba(10,15,40,0.9)",
    padding: 40,
    borderRadius: 20,
    width: 360,
    textAlign: "center",
  },
  logo: { fontSize: 32, fontWeight: 700 },
  tagline: { opacity: 0.7, marginBottom: 30 },
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