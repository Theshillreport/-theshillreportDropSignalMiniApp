"use client";

import { useEffect, useState } from "react";
import EthereumProvider from "@walletconnect/ethereum-provider";
import { ethers } from "ethers";

export default function Page() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState("");

  const [balance, setBalance] = useState(0);
  const [earned, setEarned] = useState(0);
  const [amount, setAmount] = useState("");
  const apy = 18.4;

  /* -------- WALLET CONNECT -------- */

  async function connectWallet() {
    const wcProvider = await EthereumProvider.init({
      projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
      chains: [84532], // Base Sepolia
      showQrModal: true
    });

    await wcProvider.enable();

    const ethersProvider = new ethers.BrowserProvider(wcProvider as any);
    const signer = await ethersProvider.getSigner();
    const addr = await signer.getAddress();

    setProvider(ethersProvider);
    setSigner(signer);
    setAddress(addr);
  }

  /* -------- AUTO YIELD -------- */

  useEffect(() => {
    if (!address) return;

    const interval = setInterval(() => {
      setBalance(b => {
        if (b <= 0) return b;
        const perSecond = apy / 100 / 31536000;
        const gain = b * perSecond;
        setEarned(e => e + gain);
        return b + gain;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [address]);

  function deposit() {
    const v = parseFloat(amount);
    if (!v || v <= 0) return;
    setBalance(b => b + v);
    setAmount("");
  }

  function withdraw() {
    const v = parseFloat(amount);
    if (!v || v <= 0 || v > balance) return;
    setBalance(b => b - v);
    setAmount("");
  }

  /* -------- UI -------- */

  return (
    <main style={container}>
      <div style={card}>
        <h1 style={logo}>DropSignal</h1>
        <p style={{ opacity: 0.7 }}>Deposit. Earn. Signal.</p>

        {!address ? (
          <button style={primary} onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <>
            <p style={addressStyle}>
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>

            <div style={box}>
              <p>Balance</p>
              <h2>${balance.toFixed(4)} USDC</h2>
              <p style={{ color: "#4FD1FF" }}>
                + ${earned.toFixed(4)} earned
              </p>
            </div>

            <div style={box}>
              <p>APY</p>
              <h2>{apy}% • live</h2>
            </div>

            <input
              style={input}
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />

            <button style={primary} onClick={deposit}>
              Deposit
            </button>
            <button style={secondary} onClick={withdraw}>
              Withdraw
            </button>
          </>
        )}
      </div>
    </main>
  );
}

/* -------- STYLES -------- */

const container = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top,#1e1b4b,#020617)",
  padding: 24
};

const card = {
  maxWidth: 420,
  margin: "0 auto",
  color: "white"
};

const logo = { fontSize: 34, fontWeight: 800 };
const addressStyle = { fontSize: 12, opacity: 0.6 };

const box = {
  background: "rgba(255,255,255,0.06)",
  borderRadius: 16,
  padding: 16,
  marginTop: 16
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  marginTop: 16
};

const primary = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  background: "#7c5cff",
  color: "white",
  border: "none",
  marginTop: 12,
  fontWeight: 700
};

const secondary = {
  ...primary,
  background: "transparent",
  border: "1px solid #7c5cff"
}; 