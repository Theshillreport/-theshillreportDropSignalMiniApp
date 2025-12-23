"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { USDC_ADDRESS, USDC_ABI } from "../lib/usdc";

const VAULT_ADDRESS = "0xfFc9Ad9B9A736544f062247Eb0D8a4F506805b69"; // ⚠️ ersetzen

export default function AppDashboard({ address }) {
  const [provider, setProvider] = useState(null);
  const [usdc, setUsdc] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Init
  useEffect(() => {
    if (!window.ethereum) return;

    const init = async () => {
      const p = new ethers.BrowserProvider(window.ethereum);
      const signer = await p.getSigner();
      const contract = new ethers.Contract(
        USDC_ADDRESS,
        USDC_ABI,
        signer
      );
      setProvider(p);
      setUsdc(contract);
    };

    init();
  }, []);

  // Load Balance
  const loadBalance = async () => {
    if (!usdc || !address) return;
    const raw = await usdc.balanceOf(address);
    setBalance(Number(ethers.formatUnits(raw, 6)));
  };

  useEffect(() => {
    loadBalance();
  }, [usdc, address]);

  // Deposit
  const deposit = async () => {
    if (!usdc || !amount) return;

    try {
      setLoading(true);

      // 1️⃣ Approve
      const approveTx = await usdc.approve(
        VAULT_ADDRESS,
        ethers.parseUnits(amount, 6)
      );
      await approveTx.wait();

      // 2️⃣ Transfer
      const transferTx = await usdc.transfer(
        VAULT_ADDRESS,
        ethers.parseUnits(amount, 6)
      );
      await transferTx.wait();

      await loadBalance();
      setAmount("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.bg} />

      <div style={styles.card}>
        <h1 style={styles.title}>DropSignal Vault</h1>

        <p style={styles.address}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>

        <div style={styles.balanceBox}>
          <span>Your Balance</span>
          <strong>{balance.toFixed(2)} USDC</strong>
        </div>

        <div style={styles.actions}>
          <input
            placeholder="Amount USDC"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />

          <button
            onClick={deposit}
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Processing..." : "Deposit"}
          </button>
        </div>

        <p style={styles.note}>
          Base • USDC • Non-custodial
        </p>
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    background: "#050b1e",
    color: "white"
  },
  bg: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top left, #ff8a00 0%, transparent 55%), radial-gradient(circle at bottom right, #00d4ff 0%, transparent 55%)",
    opacity: 0.35
  },
  card: {
    zIndex: 1,
    width: 360,
    padding: 32,
    borderRadius: 24,
    background: "rgba(10,15,40,0.85)",
    boxShadow: "0 0 80px rgba(255,140,0,0.25)",
    textAlign: "center"
  },
  title: {
    fontSize: 28,
    marginBottom: 8
  },
  address: {
    opacity: 0.7,
    fontSize: 14
  },
  balanceBox: {
    marginTop: 32,
    padding: 20,
    borderRadius: 16,
    background: "rgba(255,255,255,0.06)",
    fontSize: 18
  },
  actions: {
    marginTop: 28,
    display: "flex",
    gap: 12
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: "none"
  },
  button: {
    padding: "12px 20px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg,#ff8a00,#00d4ff)",
    color: "white",
    fontWeight: 600
  },
  note: {
    marginTop: 24,
    opacity: 0.5,
    fontSize: 12
  }
};