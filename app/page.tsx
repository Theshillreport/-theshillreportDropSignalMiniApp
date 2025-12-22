"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [earned, setEarned] = useState(0);
  const [amount, setAmount] = useState("");
  const [invites, setInvites] = useState(0);

  const baseApy = 18.4;
  const welcomeBoost = 0.5;
  const referralBoost = invites >= 1 ? 1.0 : 0;

  const apy = baseApy + welcomeBoost + referralBoost;

  /* -----------------------------
     LIVE YIELD (pro Sekunde)
  ----------------------------- */
  useEffect(() => {
    if (!connected || balance <= 0) return;

    const interval = setInterval(() => {
      setEarned(e => e + balance * (apy / 100) / 31536000);
    }, 1000);

    return () => clearInterval(interval);
  }, [connected, balance, apy]);

  function deposit() {
    const v = parseFloat(amount);
    if (!isNaN(v) && v > 0) {
      setBalance(b => b + v);
      setAmount("");
    }
  }

  function withdraw() {
    const v = parseFloat(amount);
    if (!isNaN(v) && v <= balance) {
      setBalance(b => b - v);
      setAmount("");
    }
  }

  function copyInvite() {
    navigator.clipboard.writeText(
      "https://farcaster.xyz/miniapps/dropsignal?ref=you"
    );
    alert("Invite link copied");
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
            <strong>{apy.toFixed(2)}%</strong>
          </div>

          {/* BOOSTS */}
          <div style={boostBox}>
            <h4 style={{ marginBottom: 8 }}>Earn your boosts</h4>

            <Boost
              label="Welcome Boost"
              value="+0.50%"
              unlocked
            />

            <Boost
              label="Referral Boost"
              value="+1.00%"
              unlocked={invites >= 1}
            />
          </div>

          {/* INVITE */}
          <div style={inviteBox}>
            <p style={{ opacity: 0.7 }}>
              Invite friends to unlock boosts
            </p>

            <button style={inviteBtn} onClick={copyInvite}>
              Copy Invite Link
            </button>

            {/* Demo Button to simulate invite */}
            <button
              style={simulateBtn}
              onClick={() => setInvites(1)}
            >
              Simulate 1 Invite
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ======================================================
   SMALL COMPONENTS
   ====================================================== */

function Boost({
  label,
  value,
  unlocked,
}: {
  label: string;
  value: string;
  unlocked: boolean;
}) {
  return (
    <div style={boostRow}>
      <span>
        {unlocked ? "🔓" : "🔒"} {label}
      </span>
      <strong style={{ opacity: unlocked ? 1 : 0.4 }}>
        {value}
      </strong>
    </div>
  );
}

/* ======================================================
   FLOATING COINS
   ====================================================== */

function FloatingCoins() {
  return (
    <div style={coinLayer}>
      {Array.from({ length: 60 }).map((_, i) => (
        <span
          key={i}
          style={{
            ...coin,
            left: `${Math.random() * 100}%`,
            animationDuration: `${10 + Math.random() * 10}s`,
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

const logo = { fontSize: 22, fontWeight: 800 };
const subtitle = { marginTop: 6, opacity: 0.7 };

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

const actions = { marginTop: 16, display: "grid", gap: 8 };

const input = { padding: 12, borderRadius: 12, border: "none" };

const depositBtn = {
  padding: 12,
  borderRadius: 14,
  background: "#22c55e",
  border: "none",
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

const boostBox = {
  marginTop: 18,
  padding: 14,
  borderRadius: 16,
  background: "rgba(0,0,0,0.35)",
};

const boostRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 6,
};

const inviteBox = {
  marginTop: 18,
  padding: 14,
  borderRadius: 16,
  background: "rgba(0,0,0,0.35)",
};

const inviteBtn = {
  width: "100%",
  padding: 12,
  borderRadius: 14,
  background: "#8b5cf6",
  border: "none",
  fontWeight: 700,
  marginTop: 8,
};

const simulateBtn = {
  width: "100%",
  padding: 10,
  borderRadius: 12,
  background: "transparent",
  border: "1px dashed #64748b",
  color: "#94a3b8",
  marginTop: 8,
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
  animation: "float linear infinite",
};

const colors = ["#fb7185", "#38bdf8", "#34d399", "#fbbf24"];