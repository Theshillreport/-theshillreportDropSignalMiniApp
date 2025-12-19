"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [balance, setBalance] = useState(1245.32);
  const [amount, setAmount] = useState("");
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [dailyReward, setDailyReward] = useState(2.34);

  const apy = 18.4;

  useEffect(() => {
    const interval = setInterval(() => {
      setBalance(b =>
        b + b * apy / 100 / 31536000
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [apy]);
  function handleDeposit() {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0) {
      setBalance(prev => prev + value);
      setDailyReward(prev => prev + value * 0.0018);
      setAmount("");
      setShowDeposit(false);
    }
  }

  function handleWithdraw() {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0 && value <= balance) {
      setBalance(prev => prev - value);
      setDailyReward(prev => Math.max(0, prev - value * 0.0018));
      setAmount("");
      setShowWithdraw(false);
    }
  }

  function claimReward() {
    setBalance(prev => prev + dailyReward);
    setDailyReward(0);
  }

  return (
    <main style={{ padding: 24, maxWidth: 420, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32 }}>
        🚀 <span style={{ color: "#FF8A00" }}>Drop</span>
        <span style={{ color: "#4FD1FF" }}>Signal</span>
      </h1>

      <p style={{ opacity: 0.7 }}>
        Deposit USDC. Earn daily yield.
      </p>

      {/* BALANCE CARD */}
      <div style={card}>
        <p style={{ opacity: 0.6 }}>Your Balance</p>
        <h2>${balance.toFixed(2)} USDC</h2>
        <p style={{ color: "#4FD1FF" }}>
          + ${dailyReward.toFixed(2)} today
        </p>
      </div>

      {/* YIELD CARD */}
      <div style={card}>
        <p style={{ opacity: 0.6 }}>Current APY</p>
        <h2 style={{ color: "#FF8A00" }}>{apy}%</h2>
        <p style={{ opacity: 0.6 }}>Compounded daily</p>
      </div>

      {/* ACTIONS */}
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button style={deposit} onClick={() => setShowDeposit(true)}>
          Deposit USDC
        </button>
        <button style={withdraw} onClick={() => setShowWithdraw(true)}>
          Withdraw
        </button>
      </div>

      {/* DAILY REWARD */}
      <div style={{ ...card, marginTop: 24 }}>
        <p style={{ opacity: 0.6 }}>Daily Reward</p>
        <h3>+ ${dailyReward.toFixed(2)}</h3>
        <button style={claim} onClick={claimReward}>
          Claim
        </button>
      </div>

      {/* MODAL */}
      {(showDeposit || showWithdraw) && (
        <div style={overlay}>
          <div style={card}>
            <h3>{showDeposit ? "Deposit USDC" : "Withdraw USDC"}</h3>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={input}
            />

            <button
              style={deposit}
              onClick={showDeposit ? handleDeposit : handleWithdraw}
            >
              Confirm
            </button>

            <button
              style={{ ...withdraw, marginTop: 8 }}
              onClick={() => {
                setShowDeposit(false);
                setShowWithdraw(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* STYLES (UNVERÄNDERT) */

const card = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(79,209,255,0.35)",
  borderRadius: 16,
  padding: 16,
  marginTop: 16,
  boxShadow: "0 0 40px rgba(79,209,255,0.08)"
};

const deposit = {
  flex: 1,
  padding: 14,
  borderRadius: 12,
  background: "linear-gradient(135deg,#FF8A00,#FFB347)",
  color: "black",
  fontWeight: 700,
  border: "none",
  width: "100%"
};

const withdraw = {
  flex: 1,
  padding: 14,
  borderRadius: 12,
  background: "transparent",
  color: "#4FD1FF",
  border: "1px solid #4FD1FF",
  width: "100%"
};

const claim = {
  marginTop: 12,
  width: "100%",
  padding: 12,
  borderRadius: 10,
  background: "#4FD1FF",
  color: "#000",
  border: "none",
  fontWeight: 600
};

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "none",
  marginBottom: 16
};