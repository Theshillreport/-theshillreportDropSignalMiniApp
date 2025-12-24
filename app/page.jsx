"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import BackgroundMatrix from "./components/BackgroundMatrix";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

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
        projectId: "6a6f915ce160625cbc11e74f7bc284e0", // deine Project ID
        chains: [8453], // Base Mainnet
        showQrModal: true,
      });

      await wcProvider.connect();

      const provider = new ethers.BrowserProvider(wcProvider);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      setAddress(addr);
    } catch (e) {
      console.error("Wallet connect error:", e);
      alert("Wallet connection failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // ========= Wenn Wallet verbunden =========
  if (address) {
    return (
      <main style={{ background: "#050b1e", minHeight: "100vh", color: "white" }}>
        <BackgroundMatrix />

        <div style={{ padding: 40 }}>
          <h1>Wallet Connected ✅</h1>
          <p>Your address:</p>
          <p style={{ opacity: 0.8 }}>{address}</p>

          <p style={{ marginTop: 20 }}>🚧 Dashboard coming soon…</p>
        </div>
      </main>
    );
  }

  // ========= Login Screen =========
  return (
    <main style={styles.container}>
      <BackgroundMatrix />

      <div style={styles.card}>
        <img
          src="/logo.png"
          style={{ width: 120, marginBottom: 10, borderRadius: 10 }}
          alt="logo"
        />

        <h1 style={styles.logo}>DropSignal</h1>

        <p style={styles.tagline}>
          Deposit USDC • Supercharge Your Yield • Powered by Base
        </p>

        <button
          onClick={connectWallet}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#050b1e",
    position: "relative",
    color: "white",
  },
  card: {
    zIndex: 2,
    background: "rgba(10,15,40,0.9)",
    padding: 40,
    borderRadius: 20,
    width: 360,
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  logo: { fontSize: 32, fontWeight: 700 },
  tagline: { opacity: 0.9, marginBottom: 30, fontSize: 14 },
  button: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#ff9f1c,#38bdf8)",
    color: "white",
    fontSize: 16,
    cursor: "pointer",
  },
};