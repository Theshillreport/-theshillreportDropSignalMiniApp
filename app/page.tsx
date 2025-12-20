"use client";

import { useEffect, useState } from "react";

/**
 * MVP Vault UI (No Blockchain)
 * - Deposit
 * - Withdraw
 * - Rewards starten erst nach Einzahlung
 * - Vorbereitung für echten USDC Vault
 */

export default function Page() {
  const [balance, setBalance] = useState(0); // eingezahlt
  const [earnings, setEarnings] = useState(0); // rewards
  const [amount, setAmount] = useState("");
  const [apyBoost, setApyBoost] = useState(0);
  const [referralCode] = useState(
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );
  const [inviteLink, setInviteLink] = useState("");
  const [email, setEmail] = useState("");

  const APY = 18.4;

  // Invite Link generieren
  useEffect(() => {
    setInviteLink(
      `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${referralCode}`
    );
  }, [referralCode]);

  // Earnings pro Sekunde (startet nur wenn Balance > 0)
  useEffect(() => {
    if (balance <= 0) return;

    const interval = setInterval(() => {
      setEarnings(e =>
        e + balance * (APY / 100) / 31536000
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [balance]);

  // -------------------------
  // DEPOSIT (UI-SIMULATION)
  // -------------------------
  function deposit() {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return;

    setBalance(prev => prev + value);
    setAmount("");
  }

  // -------------------------
  // WITHDRAW (UI-SIMULATION)
  // -------------------------
  function withdraw() {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return;
    if (value > balance + earnings) return;

    let remaining = value;

    if (earnings >= remaining) {
      setEarnings(e => e - remaining);
    } else {
      remaining -= earnings;
      setEarnings(0);
      setBalance(b => Math.max(0, b - remaining));
    }

    setAmount("");
  }

  // Referral anwenden
  function applyReferral() {
    setApyBoost(0.5);
  }

  return (
    <main style={container}>
      {/* BACKGROUND COINS */}
      <div className="coins" />

      <section style={card}>
        <h1 style={title}>REWARD HUB</h1>

        <div style={box}>
          <p style={label}>YOUR BALANCE</p>
          <h2>${balance.toFixed(2)} USDC</h2>
          <p style={green}>+${earnings.toFixed(4)} earned</p>
        </div>

        <div style={row}>
          <button style={primary} onClick={deposit}>
            Deposit
          </button>
          <button style={secondary} onClick={withdraw}>
            Withdraw
          </button>
        </div>

        <input
          style={input}
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          type="number"
        />

        <div style={box}>
          <p style={label}>APY</p>
          <h3>
            {APY + apyBoost}%{" "}
            {apyBoost > 0 && <span style={green}>(Boosted)</span>}
          </h3>
        </div>

        <div style={box}>
          <p style={label}>YOUR REFERRAL CODE</p>
          <code>{referralCode}</code>
        </div>

        <div style={box}>
          <p style={label}>YOUR INVITE LINK</p>
          <small>{inviteLink}</small>
        </div>

        <div style={box}>
          <p style={label}>HAVE A REFERRAL CODE?</p>
          <button style={secondary} onClick={applyReferral}>
            Apply Referral
          </button>
        </div>

        <div style={box}>
          <p style={label}>STAY IN THE LOOP</p>
          <input
            style={input}
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button style={primary}>Notify me</button>
        </div>
      </section>

      {/* SIMPLE BACKGROUND STYLE */}
      <style jsx>{`
        .coins {
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at 20% 30%, #ff8a0033, transparent 40%),
            radial-gradient(circle at 80% 60%, #4fd1ff33, transparent 40%);
          z-index: -1;
        }
      `}</style>
    </main>
  );
}

/* ---------------- STYLES ---------------- */

const container = {
  minHeight: "100vh",
  background: "#020617",
  padding: 24,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
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
  textAlign: "center" as const,
  marginBottom: 16,
  letterSpacing: 2
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
  marginTop: 16
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

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  marginTop: 8,
  border: "none"
};