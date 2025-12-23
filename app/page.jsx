"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { provider, modal } from "../lib/wallet";

export default function Home() {
  const [address, setAddress] = useState(null);

  const connectWallet = async () => {
    try {
      await modal.openModal();
      await provider.connect();

      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const addr = await signer.getAddress();

      setAddress(addr);
      modal.closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <h1 style={{ fontSize: 42 }}>DropSignal</h1>
      <p>Deposit. Earn. Signal.</p>

      {!address ? (
        <button
          onClick={connectWallet}
          style={{
            marginTop: 20,
            padding: "14px 28px",
            borderRadius: 12,
            background: "linear-gradient(135deg,#7c5cff,#00d4ff)",
            border: "none",
            color: "white",
            fontSize: 16,
            cursor: "pointer"
          }}
        >
          Connect
        </button>
      ) : (
        <p style={{ marginTop: 20 }}>
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      )}
    </main>
  );
}