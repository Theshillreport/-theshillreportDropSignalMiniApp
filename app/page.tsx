"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [deposit, setDeposit] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [amount, setAmount] = useState("");

  const APY = 18.4;

  // Live Earnings pro Sekunde
  useEffect(() => {
    if (deposit <= 0) return;

    const interval = setInterval(() => {
      setRewards(r => r + deposit * APY / 100 / 31536000);
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

    const total = deposit + rewards;
    if (v > total) return;

    if (rewards >= v) {
      setRewards(r => r - v);
    } else {
      const rest = v - rewards;
      setRewards(0);
      setDeposit(d => Math.max(0, d - rest));
    }

    setAmount("");
  }

  return (
    <main style={container}>
      <div className="coins" />

      <section style={card}>
        <h1 style={title}>🚀 DropSignal</h1>

        <p style={subtitle}>Deposit USDC. Earn live yield.</p>

        <div style={box}>
          <p style={label}>Deposited</p>
          <h2>${deposit.toFixed(2)} USDC</h2>
          <p style={green}>+ ${rewards.toFixed(4)} earned</p>
        </div>

        <input
          style={input}
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <div style={row}>
          <button style={primary} onClick={handleDeposit}>Deposit</button>
          <button style={secondary} onClick={handleWithdraw}>Withdraw</button>
        </div>

        <div style={box}>
          <p style={label}>Current APY</p>
          <h3>{APY}% (live)</h3>
        </div>
      </section>

      {/* FLOATING COINS BACKGROUND */}
      <style jsx>{`
        .coins {
          position: fixed;
          inset: 0;
          z-index: -1;
          background:
            radial-gradient(circle at 10% 20%, #ff8a0040, transparent 35%),
            radial-gradient(circle at 80% 30%, #4fd1ff40, transparent 35%),
            radial-gradient(circle at 50% 80%, #22c55e40, transparent 35%),
            #020617;
          animation: float 12s ease-in-out infinite alternate;
        }

        @keyframes float {
          from { background-position: 0% 0%, 100% 0%, 50% 100%; }
          to   { background-position: 10% 10%, 90% 20%, 60% 90%; }
        }
      `}</style>
    </main>
  );
}

/* STYLES */

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 24,
  color: "white"
};

const card = {
  width: "100%",
  maxWidth: 420,
  background: "rgba(255,255,255,0.04)",
  borderRadius: 20,
  padding: 24,
  backdropFilter: "blur(12px)"
};

const title = {
  fontSize: 32,
  textAlign: "center" as const
};

const subtitle = {
  textAlign: "center" as const,
  opacity: 0.7
};

const box = {
  marginTop: 16
};

const label = {
  opacity: 0.6,
  fontSize: 12
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
  padding: 12,
  borderRadius: 10,
  border: "none",
  marginTop: 8
};

const primary = {
  flex: 1,
  padding: 12,
  borderRadius: 12,
  background: "linear-gradient(135deg,#FF8A00,#4FD1FF)",
  border: "none",
  fontWeight: 700
};

const secondary = {
  flex: 1,
  padding: 12,
  borderRadius: 12,
  background: "transparent",
  border: "1px solid #4FD1FF",
  color: "#4FD1FF"
};