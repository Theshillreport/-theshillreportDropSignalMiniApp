"use client";

import { useState } from "react";
import { ethers } from "ethers";
import AppDashboard from "../components/AppDashboard"; // ✅ FIX

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

  // ✅ WENN WALLET VERBUNDEN → DASHBOARD
  if (address) {
    return <AppDashboard address={address} />;
  }

  // 🔐 LOGIN SCREEN (wie vorher)
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #ff9f43 0%, #4facfe 100%)",
        color: "white"
      }}
    >
      <h1 style={{ fontSize: 42 }}>DropSignal</h1>
      <p>Deposit. Earn. Signal.</p>

      <button
        onClick={connectWallet}
        disabled={loading}
        style={{
          marginTop: 20,
          padding: "14px 28px",
          borderRadius: 12,
          background: "rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "white",
          fontSize: 16,
          cursor: "pointer",
          opacity: loading ? 0.6 : 1,
          backdropFilter: "blur(10px)"
        }}
      >
        {loading ? "Connecting..." : "Connect Wallet"}
      </button>
    </main>
  );
}