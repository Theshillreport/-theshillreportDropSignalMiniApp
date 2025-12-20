"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [deposit, setDeposit] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [amount, setAmount] = useState("");

  const APY = 18.4;

  // Live Yield pro Sekunde
  useEffect(() => {
    if (deposit <= 0) return;
    const interval = setInterval(() => {
      setEarnings(e => e + deposit * APY / 100 / 31536000);
    }, 1000);
    return () => clearInterval(interval);
  }, [deposit]);

  function handleDeposit() {
    const v = parseFloat(amount);
    if (isNaN(v) || v <= 0) return;
    setDeposit(d => d + v);
    setAmount("");
  }

  function handleWithdraw() {
    const v = parseFloat(amount);
    if (isNaN(v) || v <= 0) return;
    const total = deposit + earnings;
    if (v > total) return;

    if (earnings >= v) {
      setEarnings(e => e - v);
    } else {
      const rest = v - earnings;
      setEarnings(0);
      setDeposit(d => Math.max(0, d - rest));
    }
    setAmount("");
  }

  return (
    <main style={container}>
      <FloatingCoins />

      <section style={card}>
        <h1 style={title}>DropSignal</h1>
        <p style={subtitle}>Deposit. Earn. Signal.</p>

        <div style={panel}>
          <p style={label}>Deposited</p>
          <h2>${deposit.toFixed(2)} USDC</h2>
          <p style={green}>+ ${earnings.toFixed(4)} earned</p>
        </div>

        <input
          style={input}
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <div style={row}>
          <button style={primary} onClick={handleDeposit}>Deposit</button>
          <button style={secondary} onClick={handleWithdraw}>Withdraw</button>
        </div>

        <div style={panel}>
          <p style={label}>Current APY</p>
          <h3>{APY}% • live</h3>
        </div>
      </section>
    </main>
  );
}

/* ---------------- FLOATING COINS ---------------- */

function FloatingCoins() {
  const coins = Array.from({ length: 60 });

  return (
    <div style={coinLayer}>
      {coins.map((_, i) => (
        <span
          key={i}
          style={{
            ...coin,
            left: `${Math.random() * 100}%`,
            animationDuration: `${10 + Math.random() * 20}s`,
            animationDelay: `${Math.random() * 5}s`,
            background: randomColor()
          }}
        />
      ))}
    </div>
  );
}

function randomColor() {
  const colors = ["#8b5cf6", "#3b82f6", "#22d3ee", "#ec4899"];
  return colors[Math.floor(Math.random() * colors.length)];
}

/* ---------------- STYLES ---------------- */

const container = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #312e81, #020617)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  overflow: "hidden"
};

const card = {
  width: "100%",
  maxWidth: 420,
  background: "rgba(255,255,255,0.05)",
  borderRadius: 24,
  padding: 28,
  backdropFilter: "blur(16px)",
  zIndex: 2
};

const title = {
  fontSize: 32,
  textAlign: "center" as const,
  fontWeight: 700
};

const subtitle = {
  textAlign: "center" as const,
  opacity: 0.7,
  marginBottom: 16
};

const panel = {
  marginTop: 16
};

const label = {
  fontSize: 12,
  opacity: 0.6
};

const green = {
  color: "#4ade80"
};

const row = {
  display: "flex",
  gap: 12,
  marginTop: 12
};

const input = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "none",
  marginTop: 8
};

const primary = {
  flex: 1,
  padding: 14,
  borderRadius: 14,
  background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
  border: "none",
  fontWeight: 700
};

const secondary = {
  flex: 1,
  padding: 14,
  borderRadius: 14,
  background: "transparent",
  border: "1px solid #3b82f6",
  color: "#93c5fd"
};

/* Coins */

const coinLayer = {
  position: "fixed" as const,
  inset: 0,
  overflow: "hidden",
  zIndex: 0
};

const coin = {
  position: "absolute" as const,
  bottom: "-10px",
  width: 6,
  height: 6,
  borderRadius: "50%",
  opacity: 0.6,
  animationName: "floatUp",
  animationTimingFunction: "linear",
  animationIterationCount: "infinite"
};

/* Global animation */
const styleSheet = `
@keyframes floatUp {
  from { transform: translateY(0); opacity: 0; }
  10% { opacity: 0.6; }
  to { transform: translateY(-120vh); opacity: 0; }
}
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = styleSheet;
  document.head.appendChild(style);
}