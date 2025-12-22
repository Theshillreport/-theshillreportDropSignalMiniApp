"use client";

import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

export default function Page() {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function connectWallet() {
    try {
      if (!(window as any).ethereum) {
        setError("No wallet detected");
        return;
      }

      const provider = new BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
    } catch (e) {
      setError("Wallet connection failed");
    }
  }

  return (
    <main style={container}>
      <div style={card}>
        <h1 style={logo}>DropSignal</h1>
        <p style={tagline}>Deposit. Earn. Signal.</p>

        {!address ? (
          <>
            <button style={connect} onClick={connectWallet}>
              Connect
            </button>
            {error && <p style={errorStyle}>{error}</p>}
          </>
        ) : (
          <>
            <p style={addressStyle}>
              Connected: {address.slice(0, 6)}…{address.slice(-4)}
            </p>

            <div style={statBox}>
              <p>Deposited</p>
              <h2>$0.00 USDC</h2>
              <p style={{ color: "#4fd1ff" }}>+ $0.0000 earned</p>
            </div>

            <div style={actions}>
              <button style={deposit}>Deposit</button>
              <button style={withdraw}>Withdraw</button>
            </div>

            <div style={apyBox}>
              <strong>18.4% APY • live</strong>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

/* ================= STYLES ================= */

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "radial-gradient(circle at top, #3b2a7a, #0b1020)"
};

const card = {
  width: 360,
  padding: 24,
  borderRadius: 20,
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "white"
};

const logo = {
  fontSize: 32,
  fontWeight: 800,
  textAlign: "center" as const
};

const tagline = {
  textAlign: "center" as const,
  opacity: 0.7,
  marginBottom: 24
};

const connect = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  background: "linear-gradient(135deg,#7c5cff,#4fd1ff)",
  border: "none",
  fontWeight: 700,
  cursor: "pointer"
};

const errorStyle = {
  color: "#ff6b6b",
  marginTop: 12,
  textAlign: "center" as const
};

const addressStyle = {
  fontSize: 14,
  opacity: 0.7,
  marginBottom: 16
};

const statBox = {
  marginBottom: 20
};

const actions = {
  display: "flex",
  gap: 12,
  marginBottom: 16
};

const deposit = {
  flex: 1,
  padding: 12,
  borderRadius: 10,
  background: "#4fd1ff",
  border: "none",
  fontWeight: 600
};

const withdraw = {
  flex: 1,
  padding: 12,
  borderRadius: 10,
  background: "transparent",
  border: "1px solid #4fd1ff",
  color: "#4fd1ff"
};

const apyBox = {
  textAlign: "center" as const,
  opacity: 0.8
};