"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [deposit, setDeposit] = useState(0);
  const [earned, setEarned] = useState(0);
  const [amount, setAmount] = useState("");

  const APY = 7.2;

  useEffect(() => {
    if (deposit <= 0) return;
    const interval = setInterval(() => {
      setEarned(e => e + deposit * APY / 100 / 31536000);
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
    const total = deposit + earned;
    if (v > total) return;

    if (earned >= v) {
      setEarned(e => e - v);
    } else {
      const rest = v - earned;
      setEarned(0);
      setDeposit(d => Math.max(0, d - rest));
    }
    setAmount("");
  }

  return (
    <main style={container}>
      <FloatingCoins />

      <section style={card}>
        {/* LOGO */}
        <div style={logo}>◉))) <span>DropSignal</span></div>

        {/* HERO */}
        <h1 style={hero}>DEPOSIT USDC TO EARN YIELD</h1>

        <div style={apyBox}>
          <div style={apy}>{APY}%</div>
          <div style={apyLabel}>APY</div>
        </div>

        {/* BALANCE */}
        <div style={section}>
          <p style={label}>YOUR BALANCE</p>
          <h2>${(deposit + earned).toFixed(2)}</h2>
        </div>

        {/* BOOSTS */}
        <div style={section}>
          <p style={label}>EARN YOUR BOOSTS</p>
          <div style={boost}>🔒 WELCOME BOOST <span>+0.00%</span></div>
          <div style={boost}>🔒 REFERRAL BOOST <span>+0.00%</span></div>
        </div>

        {/* ACTIONS */}
        <input
          style={input}
          type="number"
          placeholder="USDC amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <div style={row}>
          <button style={primary} onClick={handleDeposit}>Deposit</button>
          <button style={secondary} onClick={handleWithdraw}>Withdraw</button>
        </div>

        <p style={available}>Available: {(deposit + earned).toFixed(2)} USDC</p>

        {/* REWARD HUB */}
        <div style={rewardHub}>
          <h3>REWARD HUB</h3>
          <p style={muted}>
            Stay in the loop. Get early access to DropSignal updates.
          </p>

          <input style={input} placeholder="email@example.com" />
          <button style={primary}>Notify me</button>
        </div>
      </section>
    </main>
  );
}

/* ---------------- FLOATING COINS ---------------- */

function FloatingCoins() {
  return (
    <div style={coinLayer}>
      {Array.from({ length: 80 }).map((_, i) => (
        <span
          key={i}
          style={{
            ...coin,
            left: `${Math.random() * 100}%`,
            animationDuration: `${12 + Math.random() * 20}s`,
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
  maxWidth: 440,
  background: "rgba(255,255,255,0.06)",
  borderRadius: 28,
  padding: 28,
  backdropFilter: "blur(18px)",
  zIndex: 2
};

const logo = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  fontWeight: 700,
  fontSize: 18,
  marginBottom: 12
};

const hero = {
  fontSize: 22,
  lineHeight: 1.2
};

const apyBox = {
  display: "flex",
  alignItems: "baseline",
  gap: 8,
  marginTop: 8
};

const apy = {
  fontSize: 36,
  fontWeight: 700
};

const apyLabel = {
  opacity: 0.6
};

const section = {
  marginTop: 20
};

const label = {
  fontSize: 12,
  opacity: 0.6
};

const boost = {
  display: "flex",
  justifyContent: "space-between",
  opacity: 0.7,
  marginTop: 6
};

const input = {
  width: "100%",
  padding: 14,
  borderRadius: 14,
  border: "none",
  marginTop: 12
};

const row = {
  display: "flex",
  gap: 12,
  marginTop: 12
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

const available = {
  textAlign: "right" as const,
  opacity: 0.6,
  fontSize: 12,
  marginTop: 6
};

const rewardHub = {
  marginTop: 28,
  borderTop: "1px solid rgba(255,255,255,0.1)",
  paddingTop: 16
};

const muted = {
  opacity: 0.6,
  fontSize: 13
};

const coinLayer = {
  position: "fixed" as const,
  inset: 0,
  zIndex: 0
};

const coin = {
  position: "absolute" as const,
  bottom: "-10px",
  width: 5,
  height: 5,
  borderRadius: "50%",
  opacity: 0.6,
  animation: "floatUp linear infinite"
};

/* global animation */
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes floatUp {
      from { transform: translateY(0); opacity: 0; }
      10% { opacity: 0.6; }
      to { transform: translateY(-120vh); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}