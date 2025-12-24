"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import BackgroundMatrix from "./components/BackgroundMatrix";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("deposit");

  // Fake Data – später ersetzen mit echten Smart Contracts
  const balance = "0.00";
  const apy = "5.24";
  const available = "0.02";

  // 🔗 Referral speichern
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("dropsignal_ref", ref);
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window === "undefined") return;

    try {
      setLoading(true);

      const { EthereumProvider } = await import(
        "@walletconnect/ethereum-provider"
      );

      const wcProvider = await EthereumProvider.init({
        projectId: "6a6f915ce160625cbc11e74f7bc284e0",
        chains: [8453], 
        showQrModal: true,
      });

      await wcProvider.connect();

      const provider = new ethers.BrowserProvider(wcProvider);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      setAddress(addr);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ========= CONNECTED DASHBOARD =========
  if (address) {
    return (
      <main style={styles.connected}>
        <BackgroundMatrix />

        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.logoWrap}>
            <img src="/logo.png" style={{ width: 34, borderRadius: 8 }} />
            <span style={styles.title}>DropSignal</span>
          </div>

          <div style={styles.walletBubble}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>

        {/* MAIN */}
        <div style={styles.box}>
          <h1 style={{ textAlign: "center" }}>DEPOSIT USDC TO EARN YIELD</h1>

          <div style={styles.balanceBox}>
            <p style={styles.sub}>YOUR BALANCE</p>
            <h1>${balance}</h1>
            <p style={styles.apy}>~ {apy}% APY</p>
          </div>

          {/* Boost Badges */}
          <div style={styles.boostRow}>
            <div style={styles.boost}>
              🔒 Welcome Boost — 0.00%
            </div>
            <div style={styles.boost}>
              🔒 Referral Boost — 0.00%
            </div>
          </div>

          {/* TABS */}
          <div style={styles.tabs}>
            <button
              onClick={() => setTab("deposit")}
              style={tab === "deposit" ? styles.tabActive : styles.tab}
            >
              Deposit
            </button>

            <button
              onClick={() => setTab("withdraw")}
              style={tab === "withdraw" ? styles.tabActive : styles.tab}
            >
              Withdraw
            </button>
          </div>

          {/* INPUT */}
          <p style={{ marginTop: 10 }}>
            Available: {available} USDC
          </p>

          <div style={styles.inputWrap}>
            <input placeholder="0.00" style={styles.input} />
            <span style={styles.token}>USDC</span>
          </div>

          <button style={styles.actionButton}>
            {tab === "deposit" ? "Deposit" : "Withdraw"}
          </button>

        </div>
      </main>
    );
  }

  // ========= LOGIN SCREEN =========
  return (
    <main style={styles.loginPage}>
      <BackgroundMatrix />

      <div style={styles.loginCard}>
        <img
          src="/logo.png"
          style={{ width: 120, marginBottom: 10, borderRadius: 10 }}
          alt="logo"
        />

        <h1 style={styles.logoText}>DropSignal</h1>

        <p style={styles.tagline}>
          Deposit USDC • Supercharge Your Yield • Powered by Base
        </p>

        <button
          onClick={connectWallet}
          disabled={loading}
          style={styles.connectButton}
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      </div>
    </main>
  );
}

// ======================== STYLES ========================
const styles = {
  loginPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#050b1e",
    position: "relative",
    color: "white",
  },

  loginCard: {
    zIndex: 2,
    background: "rgba(10,15,40,0.9)",
    padding: 40,
    borderRadius: 20,
    width: 360,
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.2)",
  },

  logoText: { fontSize: 32, fontWeight: 700 },
  tagline: { opacity: 0.9, marginBottom: 30, fontSize: 14 },

  connectButton: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#ff9f1c,#38bdf8)",
    color: "white",
    fontSize: 16,
    cursor: "pointer",
  },

  connected: {
    background: "#000",
    minHeight: "100vh",
    color: "white",
    position: "relative",
  },

  header: {
    padding: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoWrap: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    fontSize: 22,
    fontWeight: 700,
  },

  walletBubble: {
    background: "rgba(255,255,255,0.15)",
    padding: "10px 16px",
    borderRadius: 16,
  },

  title: { fontWeight: 700, fontSize: 24 },

  box: {
    background: "rgba(0,0,0,0.6)",
    padding: 20,
    margin: 20,
    borderRadius: 20,
  },

  sub: { opacity: 0.7 },
  apy: { opacity: 0.8 },

  balanceBox: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  boostRow: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },

  boost: {
    flex: 1,
    background: "rgba(255,255,255,0.1)",
    padding: 10,
    borderRadius: 12,
    textAlign: "center",
  },

  tabs: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },

  tab: {
    flex: 1,
    padding: 12,
    background: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    border: "none",
    color: "white",
  },

  tabActive: {
    flex: 1,
    padding: 12,
    background: "white",
    color: "black",
    borderRadius: 12,
    border: "none",
  },

  inputWrap: {
    marginTop: 10,
    background: "black",
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    padding: 10,
  },

  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: 22,
    outline: "none",
  },

  token: { opacity: 0.6 },

  actionButton: {
    width: "100%",
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    border: "none",
    fontSize: 16,
    background: "linear-gradient(135deg,#ff9f1c,#38bdf8)",
  },
};