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

      // 🔐 WalletConnect – dynamisch, nur im Browser
      const { EthereumProvider } = await import(
        "@walletconnect/ethereum-provider"
      );
      const { WalletConnectModal } = await import(
        "@walletconnect/modal"
      );

      const projectId = "DEIN_WALLETCONNECT_PROJECT_ID"; // ❗ MUSS gültig sein

      const provider = await EthereumProvider.init({
        projectId,
        chains: [1],
        showQrModal: true, // ✅ WICHTIG: Modal anzeigen
        methods: [
          "eth_sendTransaction",
          "eth_sign",
          "eth_signTypedData",
          "personal_sign"
        ],
        events: ["accountsChanged", "chainChanged"]
      });

      // 🪟 Wallet-Auswahl Fenster
      const modal = new WalletConnectModal({
        projectId,
        chains: [1]
      });

      modal.openModal();
      await provider.connect();

      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const addr = await signer.getAddress();

      setAddress(addr);
      modal.closeModal();
    } catch (err) {
      console.error("Connect error:", err);
      alert("Wallet connection failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Nach Connect → echte App
  if (address) {
    return <AppDashboard address={address} />;
  }

  // 🟣 Landing / Connect Screen
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b1020",
        color: "white"
      }}
    >
      <h1 style={{ fontSize: 42 }}>DropSignal</h1>
      <p style={{ opacity: 0.8 }}>Deposit. Earn. Signal.</p>

      <button
        onClick={connectWallet}
        disabled={loading}
        style={{
          marginTop: 24,
          padding: "14px 28px",
          borderRadius: 12,
          background: "linear-gradient(135deg,#7c5cff,#00d4ff)",
          border: "none",
          color: "white",
          fontSize: 16,
          cursor: "pointer",
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? "Connecting..." : "Connect Wallet"}
      </button>
    </main>
  );
}