"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [earned, setEarned] = useState(0);
  const [amount, setAmount] = useState("");
  const apy = 18.4;

  /* -----------------------------
     LIVE YIELD (pro Sekunde)
  ----------------------------- */
  useEffect(() => {
    if (!connected || balance <= 0) return;

    const interval = setInterval(() => {
      setEarned(e => e + balance * (apy / 100) / 31536000);
    }, 1000);

    return () => clearInterval(interval);
  }, [connected, balance]);

  /* -----------------------------
     DEPOSIT / WITHDRAW
  ----------------------------- */
  function deposit() {
    const v = parseFloat(amount);
    if (!isNaN(v) && v > 0) {
      setBalance(b => b + v);
      setAmount("");
    }
  }

  function withdraw() {
    const v = parseFloat(amount);
    if (!isNaN(v) && v > 0 && v <= balance) {
      setBalance(b => b - v);
      setAmount("");
    }
  }

  return (
    <main style={container}>
      <FloatingCoins />

      {!connected ? (
        <div style={card}>
          <div style={logo}>◉))) DropSignal</div>
          <p style={subtitle}>Deposit. Earn. Signal.</p>

          <button style={connectBtn} onClick={() => setConnected(true)}>
            Connect
          </button>
        </div>
      ) : (
        <div style={card}>
          <div style={logo}>◉))) DropSignal</div>

          <div style={stat}>
            <span>Deposited</span>
            <strong>${balance.toFixed(2)} USDC</strong>
          </div>

          <div style={stat}>
            <span>Earned</span>
            <strong>+ ${earned.toFixed(4)}</strong>
          </div>

          <div style={actions}>
            <input
              style={input}
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <button style={depositBtn} onClick={deposit}>Deposit</button>
            <button style={withdrawBtn} onClick={withdraw}>Withdraw</button>
          </div>

          <div style={apyBox}>
            <span>Current APY</span>
            <strong>{apy}% • live</strong>
          </div>
        </div>
      )}
    </main>
  );
}

/* ======================================================
   FLOATING COINS (HINTERGRUND)
   ====================================================== */

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
            animationDuration: `${8 + Math.random() * 12}s`,
            animationDelay: `${Math.random() * 5}s`,
            background: colors[i % colors.length],
          }}
        />
      ))}
    </div>
  );
}

/* ======================================================
   STYLES
   ====================================================== */

const container = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #312e81, #020617)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative" as const,
  overflow: "hidden",
};

const card = {
  width: 360,
  padding: 22,
  borderRadius: 22,
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 0 80px rgba(139,92,246,0.25)",
  zIndex: 2,
};

const logo = {
  fontSize: 22,
  fontWeight: 800,
  letterSpacing: 0.5,
};

const subtitle = {
  marginTop: 6,
  opacity: 0.7,
};

const connectBtn = {
  marginTop: 22,
  width: "100%",
  padding: 14,
  borderRadius: 16,
  border: "none",
  fontWeight: 700,
  background: "#8b5cf6",
  color: "white",
};

const stat = {
  marginTop: 14,
  padding: 12,
  borderRadius: 14,
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "space-between",
};

const actions = {
  marginTop: 16,
  display: "grid",
  gap: 8,
};

const input = {
  padding: 12,
  borderRadius: 12,
  border: "none",
};

const depositBtn = {
  padding: 12,
  borderRadius: 14,
  border: "none",
  background: "#22c55e",
  fontWeight: 700,
};

const withdrawBtn = {
  padding: 12,
  borderRadius: 14,
  background: "transparent",
  border: "1px solid #8b5cf6",
  color: "#c4b5fd",
};

const apyBox = {
  marginTop: 16,
  padding: 12,
  borderRadius: 14,
  background: "rgba(139,92,246,0.18)",
  display: "flex",
  justifyContent: "space-between",
};

/* ---------- Coins ---------- */

const coinLayer = {
  position: "absolute" as const,
  inset: 0,
  zIndex: 1,
};

const coin = {
  position: "absolute" as const,
  bottom: "-20px",
  width: 6,
  height: 6,
  borderRadius: "50%",
  opacity: 0.6,
  animationName: "float",
  animationTimingFunction: "linear",
  animationIterationCount: "infinite",
};

const colors = ["#fb7185", "#38bdf8", "#34d399", "#fbbf24"];