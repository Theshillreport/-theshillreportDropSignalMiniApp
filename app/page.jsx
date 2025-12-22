"use client";

import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [address, setAddress] = useState(null);

  async function connectWallet() {
    if (typeof window === "undefined") return;

    if (!window.ethereum) {
      alert("Please install a wallet like MetaMask / Coinbase Wallet");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAddress(accounts[0]);
  }

  return (
    <main style={{ padding: 24, maxWidth: 420, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32 }}>
        🚀 <span style={{ color: "#a855f7" }}>Drop</span>
        <span style={{ color: "#60a5fa" }}>Signal</span>
      </h1>

      {!address ? (
        <button
          onClick={connectWallet}
          style={{
            marginTop: 20,
            width: "100%",
            padding: 14,
            borderRadius: 12,
            background: "linear-gradient(135deg,#7c3aed,#38bdf8)",
            color: "white",
            border: "none",
            fontWeight: 700,
            fontSize: 16
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <div style={{ marginTop: 20 }}>
          <p style={{ opacity: 0.7 }}>Connected wallet</p>
          <p style={{ fontWeight: 600 }}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>
      )}
    </main>
  );
}