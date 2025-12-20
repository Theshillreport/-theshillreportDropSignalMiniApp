"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [reward, setReward] = useState(0);
  const [amount, setAmount] = useState("");
  const [showDeposit, setShowDeposit] = useState(false);

  const apy = 18.4;

  // Auto Yield – startet nur wenn Balance > 0
  useEffect(() => {
    const interval = setInterval(() => {
      if (balance > 0) {
        const inc = (balance * apy) / 100 / 31536000;
        setBalance(b => b + inc);
        setReward(r => r + inc);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [balance]);

  function deposit() {
    const v = parseFloat(amount);
    if (!isNaN(v) && v > 0) {
      setBalance(b => b + v);
      setAmount("");
      setShowDeposit(false);
    }
  }

  function claim() {
    setBalance(b => b + reward);
    setReward(0);
  }

  // 🔵🟠🟢🔴 Hintergrund Coins
  const colors = ["#FF8A00", "#4FD1FF", "#22c55e", "#ef4444"];
  const [coins, setCoins] = useState<any[]>([]);

  useEffect(() => {
    setCoins(
      Array.from({ length: 90 }).map(() => ({
        id: Math.random(),
        left: Math.random() * 100,
        size: 3 + Math.random() * 5,
        speed: 0.3 + Math.random() * 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        offset: Math.random() * 100
      }))
    );
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        maxWidth: 420,
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top, #0b1a33 0%, #020617 60%)"
      }}
    >
      {/* ✨ COIN BACKGROUND */}
      {coins.map(c => (
        <div
          key={c.id}
          style={{
            position: "absolute",
            left: `${c.left}%`,
            width: c.size,
            height: c.size,
            borderRadius: "50%",
            background: c.color,
            top: `${(Date.now() / 60 * c.speed + c.offset) % 120}%`,
            opacity: 0.75,
            filter: `blur(0.3px) drop-shadow(0 0 6px ${c.color})`,
            zIndex: 0,
            pointerEvents: "none"
          }}
        />
      ))}

      {/* 🧠 UI FOREGROUND */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: 32, color: "#fff" }}>
          🚀 <span style={{ color: "#FF8A00" }}>Drop</span>
          <span style={{ color: "#4FD1FF" }}>Signal</span>
        </h1>

        <div style={card}>
          <p style={{ opacity: 0.6 }}>Your Balance</p>
          <h2>${balance.toFixed(2)} USDC</h2>
          <p style={{ color: "#4FD1FF" }}>+ ${reward.toFixed(2)} today</p>
        </div>

        <button style={depositBtn} onClick={() => setShowDeposit(true)}>
          Deposit USDC
        </button>

        {showDeposit && (
          <div style={overlay}>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={input}
            />
            <button style={depositBtn} onClick={deposit}>
              Confirm
            </button>
            <button style={cancelBtn} onClick={() => setShowDeposit(false)}>
              Cancel
            </button>
          </div>
        )}

        <div style={{ ...card, marginTop: 24 }}>
          <p style={{ opacity: 0.6 }}>Daily Reward</p>
          <h3>+ ${reward.toFixed(2)}</h3>
          <button style={claimBtn} onClick={claim}>
            Claim
          </button>
        </div>
      </div>
    </main>
  );
}

/* 🎨 STYLES */

const card = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(79,209,255,0.25)",
  borderRadius: 16,
  padding: 16,
  marginTop: 16,
  color: "#fff"
};

const depositBtn = {
  marginTop: 16,
  padding: 14,
  width: "100%",
  borderRadius: 12,
  background: "linear-gradient(135deg,#FF8A00,#FFB347)",
  color: "#000",
  fontWeight: 700,
  border: "none"
};

const cancelBtn = {
  marginTop: 8,
  padding: 14,
  width: "100%",
  borderRadius: 12,
  background: "transparent",
  color: "#4FD1FF",
  border: "1px solid #4FD1FF"
};

const claimBtn = {
  marginTop: 12,
  padding: 12,
  width: "100%",
  borderRadius: 10,
  background: "#4FD1FF",
  color: "#000",
  fontWeight: 600,
  border: "none"
};

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10
};

const input = {
  width: 220,
  padding: 12,
  borderRadius: 8,
  border: "none",
  marginBottom: 16
};