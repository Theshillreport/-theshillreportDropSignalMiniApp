"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import BackgroundMatrix from "./components/BackgroundMatrix";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  // UI States
  const [ready, setReady] = useState(false);
  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [apy] = useState(12);

  // 🧠 Fix: WalletConnect Auto Reconnect verhindern
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("wc@2:client:session");
        localStorage.removeItem("wc@2:core:pairing");
      } catch (_) {}
    }
    setReady(true);
  }, []);

  // 🔥 Fake earning counter (bis echte Blockchain live ist)
  useEffect(() => {
    if (!address) return;
    const interval = setInterval(() => {
      setEarnings((e) => e + 0.00001);
    }, 1000);
    return () => clearInterval(interval);
  }, [address]);

  const connectWallet = async () => {
    if (typeof window === "undefined") return;

    try {
      setLoading(true);

      const { EthereumProvider } = await import(
        "@walletconnect/ethereum-provider"
      );

      const wcProvider = await EthereumProvider.init({
        projectId: "6a6f915ce160625cbc11e74f7bc284e0",
        chains: [8453],   // BASE chain ID
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

  // ⛔️ Render nicht bevor Fix aktiv
  if (!ready) return null;

  return (
    <main style={styles.page}>
      <BackgroundMatrix />

      {/* ================= NOT CONNECTED ================= */}
      {!address ? (
        <div style={styles.centerBox}>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: 95, height: 95, borderRadius: "50%", marginBottom: 10 }}
          />

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
        /* ================= DASHBOARD ================= */
        <div style={styles.dashboardWrap}>
          {/* Header */}
          <div style={styles.topBar}>
            <div style={styles.leftHead}>
              <img
                src="/logo.png"
                style={{ width: 45, height: 45, borderRadius: "50%" }}
              />
              <span style={{ marginLeft: 10, fontWeight: 900 }}>DropSignal</span>
            </div>

            <div style={styles.profile}>
              {address.slice(0, 4)}...{address.slice(-4)}
            </div>
          </div>

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
            <button style={styles.depositBtn}>
              Deposit USDC
            </button>

            <button style={styles.withdrawBtn}>
              Withdraw
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// ===================== STYLES =====================
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
    background: "linear-gradient(135deg,#ffa200,#ff6a00)",
    opacity: loading ? 0.6 : 1
  }),

  dashboardWrap: {
    position: "relative",
    zIndex: 5,
    minHeight: "100vh",
    paddingTop: 20,
    textAlign: "center"
  },

  topBar: {
    width: "90%",
    margin: "0 auto 20px auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  leftHead: {
    display: "flex",
    alignItems: "center",
  },

  profile: {
    padding: "8px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.6)"
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
    border: "none",
    background: "#ff3b3b",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer"
  }
};