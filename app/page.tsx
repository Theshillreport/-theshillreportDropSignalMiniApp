"use client";

import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

export default function Page() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const apy = 7.2;

  async function connectWallet() {
    if (typeof window === "undefined") return;

    if (!(window as any).ethereum) {
      alert("No wallet detected");
      return;
    }

    const provider = new BrowserProvider((window as any).ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAddress(accounts[0]);
  }

  return (
    <main style={container}>
      <div style={card}>
        <h1 style={logo}>DropSignal</h1>
        <p style={tagline}>Deposit USDC to earn yield</p>

        {!address ? (
          <button style={connect} onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <>
            <p style={addressStyle}>
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </p>

            <div style={stats}>
              <div>
                <p style={label}>YOUR BALANCE</p>
                <h2>${balance.toFixed(2)}</h2>
              </div>

              <div>
                <p style={label}>APY</p>
                <h2>{apy}%</h2>
              </div>
            </div>

            <div style={actions}>
              <button style={deposit}>Deposit</button>
              <button style={withdraw}>Withdraw</button>
            </div>

            <div style={rewardHub}>
              <h3>Reward Hub</h3>
              <p>Referral Boost: 🔒</p>
              <p>Welcome Boost: 🔒</p>
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
  alignItems: "center"
};

const card = {
  width: 360,
  padding: 24,
  borderRadius: 20,
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.15)"
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

const addressStyle = {
  fontSize: 12,
  opacity: 0.7,
  textAlign: "center" as const,
  marginBottom: 16
};

const stats = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 16
};

const label = {
  fontSize: 12,
  opacity: 0.6
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

const rewardHub = {
  marginTop: 16,
  paddingTop: 12,
  borderTop: "1px solid rgba(255,255,255,0.1)"
};