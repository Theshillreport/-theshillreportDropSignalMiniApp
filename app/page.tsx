declare global {
  interface Window {
    ethereum?: any;
  }
}
"use client";

import { useEffect, useState } from "react";
import { BrowserProvider, formatUnits } from "ethers";

export default function Page() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");

  // ✅ Connect Wallet (ALLE Wallets)
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("No wallet detected. Please install a wallet.");
      return;
    }

    try {
      const prov = new BrowserProvider(window.ethereum);
      const signer = await prov.getSigner();
      const addr = await signer.getAddress();

      setProvider(prov);
      setAddress(addr);

      const bal = await prov.getBalance(addr);
      setBalance(Number(formatUnits(bal, 18)).toFixed(4));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #3b1d5a, #0b1020)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: 360,
          padding: 24,
          borderRadius: 16,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>DropSignal</h1>
        <p style={{ opacity: 0.7, marginBottom: 24 }}>
          Deposit. Earn. Signal.
        </p>

        {!address ? (
          <button
            onClick={connectWallet}
            style={buttonStyle}
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Connected
            </div>
            <div
              style={{
                fontSize: 14,
                marginBottom: 16,
                wordBreak: "break-all",
              }}
            >
              {address}
            </div>

            <div style={{ marginBottom: 12 }}>
              ETH Balance
            </div>
            <div style={{ fontSize: 22 }}>
              {balance}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 0",
  borderRadius: 12,
  border: "none",
  background:
    "linear-gradient(135deg, #7c5cff, #4fd1ff)",
  color: "#000",
  fontWeight: 700,
  cursor: "pointer",
};