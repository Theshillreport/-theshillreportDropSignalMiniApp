"use client";

import { useState } from "react";
import { ethers } from "ethers";
import AppDashboard from "../components/AppDashboard";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (typeof window === "undefined") return;

    try {
      setLoading(true);

      const { EthereumProvider } = await import(
        "@walletconnect/ethereum-provider"
      );

      const projectId = "6a6f915ce160625cbc11e74f7bc284e0";

      const wcProvider = await EthereumProvider.init({
        projectId,
        chains: [1],
        showQrModal: true,
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

  // ✅ WICHTIG: Sobald Wallet verbunden → Dashboard
  if (address) {
    return <AppDashboard address={address} />;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #ff9f43 0%, #4dabf7 100%)",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: 42, fontWeight: 700 }}>DropSignal</h1>
      <p style={{ opacity: 0.9 }}>Deposit. Earn. Signal.</p>

      <button
        onClick={connectWallet}
        disabled={loading}
        style={{
          marginTop: 24,
          padding: "14px 32px",
          borderRadius: 14,
          background: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "white",
          fontSize: 16,
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Connecting..." : "Connect Wallet"}
      </button>
    </main>
  );
}