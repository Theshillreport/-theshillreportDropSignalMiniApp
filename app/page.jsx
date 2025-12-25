"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import BackgroundMatrix from "./components/BackgroundMatrix";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dashboard States
  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [apy, setAPY] = useState(0);

  // ⛓️ Base Chain ID
  const BASE_CHAIN_ID = 8453;

  // 🟢 Wallet Connect
  const connectWallet = async () => {
    try {
      setLoading(true);

      if (typeof window === "undefined") return;

      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("wc@2:client:session");
        localStorage.removeItem("wc@2:core:pairing");
      }

      const { EthereumProvider } = await import(
        "@walletconnect/ethereum-provider"
      );

      const wcProvider = await EthereumProvider.init({
        projectId: "6a6f915ce160625cbc11e74f7bc284e0",
        chains: [BASE_CHAIN_ID],
        showQrModal: true
      });

      await wcProvider.connect();

      const provider = new ethers.BrowserProvider(wcProvider);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      setAddress(addr);

      // reset dashboard
      setBalance(0);
      setEarnings(0);
      setAPY(0);

    } catch (err) {
      console.log("Wallet Connect Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <BackgroundMatrix />

      {/* ================= BEFORE CONNECT ================= */}
      {!address && (
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
      )}

      {/* ================= AFTER CONNECT ================= */}
      {address && (
        <div style={styles.dashboardWrap}>

          {/* HEADER LIKE X-QUO */}
          <div style={styles.topBar}>
            <div style={styles.left}>
              <img
                src="/logo.png"
                alt="logo"
                style={styles.appLogo}
              />
              <span style={styles.appName}>DropSignal</span>
            </div>

            <div style={styles.profile}>
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          </div>

          <h2 style={styles.title}>Dashboard</h2>

          {/* CARDS */}
          <div style={styles.card}>
            <p>Total Deposited</p>
            <h3>{balance.toFixed(2)} USDC</h3>
          </div>

          <div style={styles.card}>
            <p>Live Earnings</p>
            <h3>+{earnings.toFixed(6)} USDC</h3>
          </div>

          <div style={styles.card}>
            <p>APY</p>
            <h3>{apy}%</h3>
          </div>

          {/* BUTTONS */}
          <div style={styles.buttonRow}>
            <button style={styles.depositBtn}>Deposit USDC</button>
            <button style={styles.withdrawBtn}>Withdraw</button>
          </div>
        </div>
      )}
    </main>
  );
}


/* ===================== STYLES ===================== */

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
    background: "linear-gradient(135deg,#00ffa6,#00b4ff)",
    opacity: loading ? 0.6 : 1
  }),

  dashboardWrap: {
    position: "relative",
    zIndex: 5,
    minHeight: "100vh",
    paddingTop: 30
  },

  topBar: {
    width: "90%",
    margin: "0 auto 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },

  appLogo: {
    width: 38,
    height: 38,
    borderRadius: "50%"
  },

  appName: {
    fontSize: 18,
    fontWeight: 800
  },

  profile: {
    padding: "8px 14px",
    borderRadius: 12,
    border: "1px solid white",
    fontSize: 14
  },

  title: {
    textAlign: "center",
    fontSize: 32,
    marginBottom: 10
  },

  card: {
    background: "rgba(0,0,0,0.6)",
    borderRadius: 18,
    padding: 20,
    margin: "15px auto",
    width: "85%",
    border: "1px solid rgba(255,255,255,0.2)",
    backdropFilter: "blur(6px)",
    textAlign: "center"
  },

  buttonRow: {
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    gap: 10
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