"use client";

import { useState } from "react";
import { ethers } from "ethers";

import AppDashboard from "./components/AppDashboard";
import BackgroundMatrix from "./components/BackgroundMatrix";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (typeof window === "undefined") return;

    try {
      setLoading(true);

      // verhindert Auto-Reconnect
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("wc@2:client:session");
        localStorage.removeItem("wc@2:core:pairing");
      }

      const { EthereumProvider } = await import(
        "@walletconnect/ethereum-provider"
      );

      const wcProvider = await EthereumProvider.init({
        projectId: "6a6f915ce160625cbc11e74f7bc284e0",
        chains: [1],
        showQrModal: true
      });

      await wcProvider.connect();

      const ethersProvider = new ethers.BrowserProvider(wcProvider);
      const signer = await ethersProvider.getSigner();
      const addr = await signer.getAddress();

      setAddress(addr);
    } catch (err) {
      console.error("Connect error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      {/* MATRIX BACKGROUND */}
      <BackgroundMatrix />

      {/* CONTENT */}
      <div style={styles.centerBox}>
        <h1 style={styles.title}>DropSignal</h1>
        <p style={styles.sub}>Deposit • Earn • Signal</p>

        {!address ? (
          <button
            onClick={connectWallet}
            disabled={loading}
            style={styles.button(loading)}
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <AppDashboard address={address} />
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    position: "relative",
    color: "white",
    overflow: "hidden",
    background: "#000"
  },

  centerBox: {
    position: "relative",
    zIndex: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh"
  },

  title: {
    fontSize: 42,
    fontWeight: 900
  },

  sub: {
    opacity: 0.8,
    marginBottom: 15
  },

  button: (loading) => ({
    marginTop: 20,
    padding: "14px 28px",
    borderRadius: 12,
    background: "linear-gradient(135deg,#7c5cff,#00d4ff)",
    border: "none",
    color: "white",
    fontSize: 16,
    cursor: "pointer",
    opacity: loading ? 0.6 : 1
  })
};