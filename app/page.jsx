"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import BackgroundMatrix from "./components/BackgroundMatrix";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [apy] = useState(12);

  const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base USDC
  const VAULT_ADDRESS = "0xfFc9Ad9B9A736544f062247Eb0D8a4F506805b69";

  // 🔥 Fake earnings counter (visual)
  useEffect(() => {
    if (!address || balance <= 0) return;
    const interval = setInterval(() => {
      setEarnings((e) => e + 0.00001);
    }, 1000);
    return () => clearInterval(interval);
  }, [address, balance]);

  // ================= CONNECT BASE WALLET ==================
  const connectWallet = async () => {
    if (typeof window === "undefined") return;

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
        chains: [8453],        // BASE CHAIN
        showQrModal: true
      });

      await wcProvider.connect();

      const provider = new ethers.BrowserProvider(wcProvider);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      setAddress(addr);
    } catch (err) {
      console.error("Connect error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= REAL USDC DEPOSIT ==================
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

      const provider = new ethers.BrowserProvider(wcProvider);
      const signer = await provider.getSigner();

      const usdc = new ethers.Contract(
        USDC_ADDRESS,
        ["function transfer(address to,uint256 value) public returns (bool)"],
        signer
      );

      const value = ethers.parseUnits(amount, 6);

      const tx = await usdc.transfer(VAULT_ADDRESS, value);
      await tx.wait();

      alert("Deposit successful 🎉");

      setBalance((b) => b + Number(amount));
    } catch (err) {
      console.log(err);
      alert("Deposit failed ❌");
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
              Deposit USDC
            </button>

            <button style={styles.withdrawBtn}>
              Withdraw (coming soon)
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// ================= STYLES =================
const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    position: "relative",
    overflow: "hidden",
    color: "white",
    background: "#000"
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
    fontWeight: "900",
    letterSpacing: 1
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
    background: "linear-gradient(135deg,#ff7b00,#ffae00)",
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
    fontSize: 34,
    marginBottom: 10
  },

  connected: {
    opacity: 0.7,
    marginBottom: 25
  },

  card: {
    background: "rgba(0,0,0,0.6)",
    borderRadius: 18,
    padding: 20,
    margin: "15px auto",
    width: "85%",
    border: "1px solid rgba(255,255,255,0.2)",
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
    fontWeight: 700,
    cursor: "pointer"
  },

  withdrawBtn: {
    padding: "14px 22px",
    borderRadius: 14,
    border: "1px solid white",
    background: "transparent",
    color: "white",
    cursor: "pointer"
  }
};