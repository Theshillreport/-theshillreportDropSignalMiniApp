"use client";

import { useState } from "react";
import { ethers } from "ethers";

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
      const { WalletConnectModal } = await import(
        "@walletconnect/modal"
      );

      const projectId = "DEIN_WALLETCONNECT_PROJECT_ID";

      const provider = await EthereumProvider.init({
        projectId,
        chains: [1],
        showQrModal: false,
        methods: [
          "eth_sendTransaction",
          "eth_sign",
          "eth_signTransaction",
          "eth_signTypedData"
        ],
        events: ["chainChanged", "accountsChanged"]
      });

      const modal = new WalletConnectModal({
        projectId,
        chains: [1]
      });

      await modal.openModal();
      await provider.connect();

      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const addr = await signer.getAddress();

      setAddress(addr);
      modal.closeModal();
    } catch (err) {
      console.error("Connect error:", err);
    } finally {
      setLoading(false);
    }
  };

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
      <p>Deposit. Earn. Signal.</p>

      {!address ? (
        <button
          onClick={connectWallet}
          disabled={loading}
          style={{
            marginTop: 20,
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
      ) : (
        <p style={{ marginTop: 20 }}>
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      )}
    </main>
  );
}