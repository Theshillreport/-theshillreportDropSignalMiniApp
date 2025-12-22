"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [balance, setBalance] = useState(0);
  const [deposited, setDeposited] = useState(0);
  const [earned, setEarned] = useState(0);
  const [amount, setAmount] = useState("");
  const apy = 18.4;

  /* AUTO YIELD – pro Sekunde */
  useEffect(() => {
    const interval = setInterval(() => {
      setBalance(b => {
        if (b <= 0) return b;
        const perSecond = apy / 100 / 31536000;
        const gain = b * perSecond;
        setEarned(e => e + gain);
        return b + gain;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function deposit() {
    const v = parseFloat(amount);
    if (!v || v <= 0) return;
    setBalance(b => b + v);
    setDeposited(d => d + v);
    setAmount("");
  }

  function withdraw() {
    const v = parseFloat(amount);
    if (!v || v <= 0 || v > balance) return;
    setBalance(b => b - v);
    setAmount("");
  }

  return (
    <main style={container}>
      {/* BACKGROUND COINS */}
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="coin"
          style={{
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            background: COLORS[Math.floor(Math.random() * COLORS.length)]
          }}
        />
      ))}

      {/* UI */}
      <div style={card}>
        <h1 style={logo}>DropSignal</h1>
        <p style={{ opacity: 0.7 }}>Deposit. Earn. Signal.</p>

        <div style={box}>
          <p>Deposited</p>
          <h2>${deposited.toFixed(2)} USDC</h2>
          <p style={{ color: "#4FD1FF" }}>
            + ${earned.toFixed(4)} earned
          </p>
        </div>

        <div style={box}>
          <p>Current APY</p>
          <h2 style={{ color: "#a78bfa" }}>{apy}% • live</h2>
        </div>

        <input
          style={input}
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <button style={primary} onClick={deposit}>
          Deposit
        </button>
        <button style={secondary} onClick={withdraw}>
          Withdraw
        </button>
      </div>
    </main>
  );
}

/* -------- STYLES -------- */

const COLORS = ["#f97316", "#38bdf8", "#22c55e", "#a78bfa", "#ef4444"];

const container = {
  minHeight: "100vh",
  position: "relative" as const,
  background: "radial-gradient(circle at top,#1e1b4b,#020617)",
  overflow: "hidden"
};

const card = {
  position: "relative" as const,
  zIndex: 2,
  maxWidth: 420,
  margin: "0 auto",
  padding: 24
};

const logo = { fontSize: 34, fontWeight: 800 };

const box = {
  background: "rgba(255,255,255,0.06)",
  borderRadius: 16,
  padding: 16,
  marginTop: 16
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  marginTop: 16
};

const primary = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  background: "#7c5cff",
  color: "white",
  border: "none",
  marginTop: 12,
  fontWeight: 700
};

const secondary = {
  ...primary,
  background: "transparent",
  border: "1px solid #7c5cff"
};