"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { USDC_ADDRESS, USDC_ABI } from "../lib/usdc";

const APY = 0.085; // 8.5 %

export default function AppDashboard({ address }) {
  const [usdc, setUsdc] = useState(null);
  const [balance, setBalance] = useState(0);
  const [liveBalance, setLiveBalance] = useState(0);
  const [amount, setAmount] = useState("");

  // 🔌 Init Provider + Contract
  useEffect(() => {
    if (!window.ethereum) return;

    const init = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        USDC_ADDRESS,
        USDC_ABI,
        signer
      );
      setUsdc(contract);
    };

    init();
  }, []);

  // 💰 Load USDC balance
  const loadBalance = async () => {
    if (!usdc) return;
    const raw = await usdc.balanceOf(address);
    const parsed = Number(ethers.formatUnits(raw, 6));
    setBalance(parsed);
    setLiveBalance(parsed);
  };

  useEffect(() => {
    loadBalance();
  }, [usdc]);

  // ⏱ Live Yield Counter
  useEffect(() => {
    if (balance <= 0) return;

    const yearlyYield = balance * APY;
    const perSecond = yearlyYield / 31_536_000;

    const interval = setInterval(() => {
      setLiveBalance((prev) => prev + perSecond);
    }, 1000);

    return () => clearInterval(interval);
  }, [balance]);

  // ➕ Deposit (Demo)
  const deposit = async () => {
    if (!usdc || !amount) return;

    const tx = await usdc.transfer(
      address, // Vault folgt in D️⃣
      ethers.parseUnits(amount, 6)
    );
    await tx.wait();
    loadBalance();
    setAmount("");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "white",
        padding: 40
      }}
    >
      <h1 style={{ fontSize: 36 }}>DropSignal Vault</h1>

      <p style={{ opacity: 0.6 }}>
        Connected: {address.slice(0, 6)}...{address.slice(-4)}
      </p>

      {/* BALANCE */}
      <div style={{ marginTop: 40 }}>
        <h2>Vault Balance</h2>
        <div style={{ fontSize: 36, fontWeight: 600 }}>
          {liveBalance.toFixed(6)} USDC
        </div>
        <p style={{ opacity: 0.7 }}>APY: {(APY * 100).toFixed(2)}%</p>
      </div>

      {/* ACTIONS */}
      <div style={{ marginTop: 40 }}>
        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 10,
            border: "none",
            marginRight: 12
          }}
        />

        <button
          onClick={deposit}
          style={{
            padding: "12px 24px",
            borderRadius: 12,
            background: "linear-gradient(135deg,#7c5cff,#00d4ff)",
            border: "none",
            color: "white",
            fontSize: 16
          }}
        >
          Deposit
        </button>
      </div>

      {/* STATUS */}
      <div
        style={{
          marginTop: 50,
          padding: 20,
          borderRadius: 16,
          background: "rgba(255,255,255,0.05)"
        }}
      >
        <h3>Yield Status</h3>
        <p>🔄 Yield accruing in real-time</p>
        <p>🟢 Vault active</p>
      </div>
    </main>
  );
}