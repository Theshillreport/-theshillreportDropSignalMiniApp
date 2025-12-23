"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { USDC_ADDRESS, USDC_ABI } from "../lib/usdc";

export default function AppDashboard({ address }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [usdc, setUsdc] = useState(null);
  const [balance, setBalance] = useState("0.00");
  const [amount, setAmount] = useState("");

  // 🔌 Init Provider + Contract
  useEffect(() => {
    if (!window.ethereum) return;

    const init = async () => {
      const p = new ethers.BrowserProvider(window.ethereum);
      const s = await p.getSigner();
      const c = new ethers.Contract(USDC_ADDRESS, USDC_ABI, s);

      setProvider(p);
      setSigner(s);
      setUsdc(c);
    };

    init();
  }, []);

  // 💰 USDC Balance laden
  const loadBalance = async () => {
    if (!usdc) return;
    const raw = await usdc.balanceOf(address);
    setBalance(ethers.formatUnits(raw, 6));
  };

  useEffect(() => {
    loadBalance();
  }, [usdc]);

  // ➕ Deposit (einfacher Transfer – Vault folgt in D️⃣)
  const deposit = async () => {
    if (!usdc || !amount) return;

    const tx = await usdc.transfer(
      address, // ⚠️ Platzhalter – Vault kommt in D️⃣
      ethers.parseUnits(amount, 6)
    );
    await tx.wait();
    loadBalance();
    setAmount("");
  };

  // ➖ Withdraw (Demo – Logik wird später Vault-basiert)
  const withdraw = async () => {
    alert("Withdraw kommt mit Vault (Schritt D️⃣)");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "white",
        padding: 32
      }}
    >
      <h1>DropSignal Vault</h1>

      <p style={{ opacity: 0.7 }}>
        Connected: {address.slice(0, 6)}...{address.slice(-4)}
      </p>

      <div style={{ marginTop: 30 }}>
        <h2>USDC Balance</h2>
        <div style={{ fontSize: 28 }}>{balance} USDC</div>
      </div>

      <div style={{ marginTop: 40 }}>
        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 8,
            border: "none",
            marginRight: 12
          }}
        />

        <button
          onClick={deposit}
          style={{
            padding: "12px 20px",
            borderRadius: 10,
            background: "#7c5cff",
            color: "white",
            border: "none",
            marginRight: 10
          }}
        >
          Deposit
        </button>

        <button
          onClick={withdraw}
          style={{
            padding: "12px 20px",
            borderRadius: 10,
            background: "#333",
            color: "white",
            border: "none"
          }}
        >
          Withdraw
        </button>
      </div>
    </main>
  );
}