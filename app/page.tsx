declare global {
  interface Window {
    ethereum?: any;
  }
}

"use client";

import { useState } from "react";
import { BrowserProvider, formatUnits } from "ethers";

export default function Page() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState("0");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("No wallet detected. Please install a wallet.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      const bal = await provider.getBalance(addr);

      setAddress(addr);
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
          "radial-gradient(circle at top, #4b2b6b, #0b1020)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: 380,
          padding: 28,
          borderRadius: 18,
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 0 40px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 30, marginBottom: 6 }}>
          DropSignal
        </h1>
        <p style={{ opacity: 0.7, marginBottom: 24 }}>
          Deposit. Earn. Signal.
        </p>

        {!address ? (
          <button onClick={connectWallet} style={buttonStyle}>
            Connect Wallet
          </button>
        ) : (
          <>
            <div style={{ fontSize: 12, opacity: 0.6 }}>
              Connected
            </div>
            <div
              style={{
                fontSize: 14,
                wordBreak: "break-all",
                marginBottom: 18,
              }}
            >
              {address}
            </div>

            <div style={{ opacity: 0.7 }}>ETH Balance</div>
            <div style={{ fontSize: 24 }}>{balance}</div>
          </>
        )}
      </div>
    </main>
  );
}

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 0",
  borderRadius: 14,
  border: "none",
  background:
    "linear-gradient(135deg, #8b5cf6, #38bdf8)",
  color: "#000",
  fontWeight: 800,
  fontSize: 16,
  cursor: "pointer",
};