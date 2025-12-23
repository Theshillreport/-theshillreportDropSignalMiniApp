"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { USDC_ADDRESS, USDC_ABI } from "../lib/usdc";

const VAULT_ADDRESS = "0xYOUR_VAULT_ADDRESS"; // später ersetzen
const APY = 0.085;

export default function AppDashboard({ address }) {
  const [provider, setProvider] = useState(null);
  const [usdc, setUsdc] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!window.ethereum) return;

    const init = async () => {
      const p = new ethers.BrowserProvider(window.ethereum);
      const signer = await p.getSigner();

      setProvider(p);
      setUsdc(new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer));
    };

    init();
  }, []);

  const loadBalance = async () => {
    if (!usdc) return;
    const raw = await usdc.balanceOf(address);
    setBalance(Number(ethers.formatUnits(raw, 6)));
  };

  useEffect(() => {
    loadBalance();
  }, [usdc]);

  const deposit = async () => {
    if (!amount || !usdc) return;

    const parsed = ethers.parseUnits(amount, 6);

    const approveTx = await usdc.approve(VAULT_ADDRESS, parsed);
    await approveTx.wait();

    const tx = await usdc.transfer(VAULT_ADDRESS, parsed);
    await tx.wait();

    setAmount("");
    loadBalance();
  };

  return (
    <main style={styles.container}>
      <div style={styles.bg} />

      <div style={styles.card}>
        <h1>DropSignal Vault</h1>

        <p style={{ opacity: 0.6 }}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>

        <div style={styles.balance}>
          <span>Your Balance</span>
          <strong>{balance.toFixed(2)} USDC</strong>
          <small>APY {APY * 100}%</small>
        </div>

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="USDC amount"
          style={styles.input}
        />

        <button onClick={deposit} style={styles.button}>
          Deposit USDC
        </button>
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
    background: "#050b1e",
    color: "white",
    position: "relative",
  },
  bg: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top left,#ff9f1c 0%,transparent 55%),radial-gradient(circle at bottom right,#38bdf8 0%,transparent 55%)",
    opacity: 0.45,
  },
  card: {
    zIndex: 1,
    background: "rgba(10,15,40,0.9)",
    padding: 40,
    borderRadius: 20,
    width: 400,
  },
  balance: {
    marginTop: 30,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#ff9f1c,#38bdf8)",
    color: "white",
    fontSize: 16,
  },
};