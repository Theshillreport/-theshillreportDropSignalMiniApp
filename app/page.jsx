"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import BackgroundMatrix from "./components/BackgroundMatrix";

// ✅ USDC auf BASE
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54Bda02913";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [apy] = useState(12);

  // ⭐ Fake Earnings Counter (bis später echter Yield)
  useEffect(() => {
    if (!address) return;
    const i = setInterval(() => {
      setEarnings((e) => e + 0.00001);
    }, 1000);
    return () => clearInterval(i);
  }, [address]);

  // ================= CONNECT =================
  const connectWallet = async () => {
    try {
      setLoading(true);

      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("wc@2:client:session");
        localStorage.removeItem("wc@2:core:pairing");
      }

      const { EthereumProvider } = await import(
        "@walletconnect/ethereum-provider"
      );

      const wcProvider = await EthereumProvider.init({
        projectId: "6a6f915ce160625cbc11e74f7bc284e0",
        chains: [8453],
        showQrModal: true
      });

      await wcProvider.connect();

      const provider = new ethers.BrowserProvider(wcProvider);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      setAddress(addr);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= DEPOSIT =================
  const depositUSDC = async () => {
    try {
      if (!address) return alert("Connect wallet first");

      const amount = prompt("How many USDC to deposit?", "10");
      if (!amount) return;

      const { EthereumProvider } = await import(
        "@walletconnect/ethereum-provider"
      );

      const wcProvider = await EthereumProvider.init({
        projectId: "6a6f915ce160625cbc11e74f7bc284e0",
        chains: [8453],
        showQrModal: true
      });

      await wcProvider.connect();

      const provider = new ethers.BrowserProvider(wcProvider);
      const signer = await provider.getSigner();

      const usdc = new ethers.Contract(
        USDC_ADDRESS,
        [
          "function transfer(address to,uint256 value) public returns (bool)"
        ],
        signer
      );

      const value = ethers.parseUnits(amount, 6);

      const tx = await usdc.transfer(
        "0xfFc9Ad9B9A736544f062247Eb0D8a4F506805b69",
        value
      );

      await tx.wait();

      alert("Deposit success 🎉");
      setBalance((b) => b + Number(amount));
    } catch (err) {
      console.log(err);
      alert("Deposit failed ❌");
    }
  };

  // ================= WITHDRAW =================
  const withdrawUSDC = async () => {
    try {
      if (!address) return alert("Connect wallet first");

      const amount = prompt("Withdraw how many USDC?", "10");
      if (!amount) return;

      const { EthereumProvider } = await import(
        "@walletconnect/ethereum-provider"
      );

      const wcProvider = await EthereumProvider.init({
        projectId: "6a6f915ce160625cbc11e74f7bc284e0",
        chains: [8453],
        showQrModal: true
      });

      await wcProvider.connect();

      const provider = new ethers.BrowserProvider(wcProvider);
      const signer = await provider.getSigner();

      const usdc = new ethers.Contract(
        USDC_ADDRESS,
        [
          "function transfer(address to,uint256 value) public returns (bool)"
        ],
        signer
      );

      const value = ethers.parseUnits(amount, 6);

      const tx = await usdc.transfer(address, value);
      await tx.wait();

      alert("Withdrawal sent 🎉");

      setBalance((b) => Math.max(0, b - Number(amount)));
      setEarnings(0);
    } catch (err) {
      console.log(err);
      alert("Withdraw failed ❌");
    }
  };

  return (
    <main style={styles.page}>
      <BackgroundMatrix />

      {!address ? (
        <div style={styles.centerBox}>
          <h1 style={styles.logo}>DropSignal</h1>
          <p style={styles.sub}>Deposit • Earn • Signal</p>

          <button
            onClick={connectWallet}
            disabled={loading}
            style={styles.connectButton(loading)}
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      ) : (
        <div style={styles.dashboardWrap}>
          <h2 style={styles.title}>Dashboard</h2>

          <p style={styles.connected}>
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </p>

          <div style={styles.card}>
            <p>Total Deposited:</p>
            <h3>{balance.toFixed(2)} USDC</h3>
          </div>

          <div style={styles.card}>
            <p>Live Earnings:</p>
            <h3>+{earnings.toFixed(6)} USDC</h3>
          </div>

          <div style={styles.card}>
            <p>APY:</p>
            <h3>{apy}%</h3>
          </div>

          <div style={styles.buttonRow}>
            <button style={styles.depositBtn} onClick={depositUSDC}>
              Deposit
            </button>

            <button style={styles.withdrawBtn} onClick={withdrawUSDC}>
              Withdraw
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// ===================== UI =====================
const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    position: "relative",
    overflow: "hidden",
    color: "white",
    background: "linear-gradient(180deg,#ff8c00,#000)"
  },

  centerBox: {
    position: "relative",
    zIndex: 5,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  logo: {
    fontSize: 40,
    fontWeight: 900
  },

  sub: {
    opacity: 0.8,
    marginBottom: 20
  },

  connectButton: (loading) => ({
    padding: "14px 30px",
    borderRadius: 12,
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    background: "linear-gradient(135deg,#ffaa00,#ff5500)",
    opacity: loading ? 0.6 : 1
  }),

  dashboardWrap: {
    position: "relative",
    zIndex: 5,
    minHeight: "100vh",
    paddingTop: 50,
    textAlign: "center"
  },

  title: {
    fontSize: 32
  },

  connected: {
    opacity: 0.7,
    marginBottom: 20
  },

  card: {
    background: "rgba(0,0,0,0.6)",
    borderRadius: 16,
    padding: 18,
    margin: "12px auto",
    width: "85%",
    border: "1px solid rgba(255,255,255,0.3)",
    backdropFilter: "blur(4px)"
  },

  buttonRow: {
    marginTop: 25,
    display: "flex",
    justifyContent: "center",
    gap: 12
  },

  depositBtn: {
    padding: "14px 22px",
    borderRadius: 14,
    border: "none",
    background: "#00ff9c",
    color: "#000",
    fontWeight: 800,
    cursor: "pointer"
  },

  withdrawBtn: {
    padding: "14px 22px",
    borderRadius: 14,
    border: "none",
    background: "#ff0033",
    color: "white",
    fontWeight: 800,
    cursor: "pointer"
  }
};