"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function Page() {
  const [address, setAddress] = useState(null);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [apy] = useState(8.5);

  // 🔹 Fake live yield tick (UI only)
  useEffect(() => {
    if (!address) return;
    const interval = setInterval(() => {
      setBalance((b) => +(b + 0.000001).toFixed(6));
    }, 1000);
    return () => clearInterval(interval);
  }, [address]);

  // 🔹 WalletConnect (bereits funktionierend)
  const connectWallet = async () => {
    if (typeof window === "undefined") return;

    const { EthereumProvider } = await import(
      "@walletconnect/ethereum-provider"
    );
    const { WalletConnectModal } = await import("@walletconnect/modal");

    const provider = await EthereumProvider.init({
      projectId: "DEIN_WALLETCONNECT_PROJECT_ID",
      chains: [1],
      showQrModal: false
    });

    const modal = new WalletConnectModal({
      projectId: "DEIN_WALLETCONNECT_PROJECT_ID",
      chains: [1]
    });

    await modal.openModal();
    await provider.connect();

    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    setAddress(await signer.getAddress());
    modal.closeModal();
  };

  /* ======================================================
     🔒 CONNECT SCREEN
  ====================================================== */
  if (!address) {
    return (
      <main style={styles.connect}>
        <h1 style={{ fontSize: 46 }}>DropSignal</h1>
        <p>Deposit. Earn. Signal.</p>
        <button style={styles.connectBtn} onClick={connectWallet}>
          Connect Wallet
        </button>
      </main>
    );
  }

  /* ======================================================
     🚀 VAULT APP (nach Connect)
  ====================================================== */
  return (
    <main style={styles.app}>
      <h1 style={styles.title}>DropSignal Vault</h1>
      <p style={styles.addr}>
        Connected: {address.slice(0, 6)}…{address.slice(-4)}
      </p>

      <div style={styles.card}>
        <p style={{ opacity: 0.7 }}>Vault Balance</p>
        <h2 style={styles.balance}>{balance} USDC</h2>
        <p style={{ color: "#3cffb0" }}>APY {apy}%</p>

        <div style={styles.actions}>
          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />
          <button style={styles.deposit}>Deposit</button>
        </div>
      </div>

      <div style={styles.status}>
        <p>🔄 Yield accruing in real-time</p>
        <p>🟢 Vault active</p>
      </div>
    </main>
  );
}

/* ======================================================
   🎨 STYLES
====================================================== */
const styles = {
  connect: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #1b2559, #050814)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white"
  },

  connectBtn: {
    marginTop: 24,
    padding: "14px 36px",
    borderRadius: 14,
    border: "none",
    fontSize: 16,
    cursor: "pointer",
    background: "linear-gradient(135deg,#7c5cff,#00e0ff)",
    color: "white"
  },

  app: {
    minHeight: "100vh",
    padding: 40,
    color: "white",
    background:
      "radial-gradient(circle at 30% 20%, #1f2a5a, #050814 70%)"
  },

  title: {
    fontSize: 40,
    marginBottom: 6
  },

  addr: {
    opacity: 0.6,
    marginBottom: 30
  },

  card: {
    background: "rgba(255,255,255,0.04)",
    borderRadius: 24,
    padding: 32,
    maxWidth: 420,
    backdropFilter: "blur(20px)"
  },

  balance: {
    fontSize: 48,
    margin: "12px 0"
  },

  actions: {
    display: "flex",
    gap: 12,
    marginTop: 20
  },

  input: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    border: "none",
    outline: "none"
  },

  deposit: {
    padding: "14px 24px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg,#6a5cff,#00c6ff)",
    color: "white"
  },

  status: {
    marginTop: 30,
    padding: 24,
    borderRadius: 20,
    background: "rgba(255,255,255,0.03)",
    maxWidth: 420
  }
};