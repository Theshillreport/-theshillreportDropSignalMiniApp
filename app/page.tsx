"use client";

import { useEffect, useMemo, useState } from "react";

export default function Page() {
  // --------------------
  // Core State
  // --------------------
  const [deposit, setDeposit] = useState(0);
  const [balance, setBalance] = useState(0);
  const [apy] = useState(12); // base APY
  const [boost, setBoost] = useState(0);
  const [email, setEmail] = useState("");
  const [refInput, setRefInput] = useState("");

  // --------------------
  // Referral
  // --------------------
  const referralCode = useMemo(
    () => Math.random().toString(36).substring(2, 10).toUpperCase(),
    []
  );

  const inviteLink = `https://your-app.vercel.app/?ref=${referralCode}`;

  const applyReferral = () => {
    if (refInput.length >= 6) {
      setBoost(0.5);
      alert("Referral applied! +0.5% APY boost for 30 days");
    }
  };

  // --------------------
  // Earnings Simulation
  // --------------------
  useEffect(() => {
    if (deposit <= 0) return;

    const interval = setInterval(() => {
      setBalance((b) => b + deposit * ((apy + boost) / 100 / 86400));
    }, 1000);

    return () => clearInterval(interval);
  }, [deposit, apy, boost]);

  // --------------------
  // Background Coins
  // --------------------
  const coins = useMemo(
    () =>
      Array.from({ length: 70 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 6 + 2,
        delay: Math.random() * 10,
        duration: Math.random() * 20 + 10,
        color: ["#ff8a00", "#4fd1ff", "#3cff8f", "#ff4f4f"][
          Math.floor(Math.random() * 4)
        ],
      })),
    []
  );

  return (
    <main style={styles.page}>
      {/* Background Coins */}
      <div style={styles.bg}>
        {coins.map((c) => (
          <span
            key={c.id}
            style={{
              ...styles.coin,
              left: `${c.left}%`,
              width: c.size,
              height: c.size,
              background: c.color,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            }}
          />
        ))}
      </div>

      {/* UI */}
      <div style={styles.container}>
        <h1 style={styles.title}>REWARD HUB</h1>

        {/* Referral */}
        <section style={styles.card}>
          <label style={styles.label}>YOUR REFERRAL CODE</label>
          <div style={styles.row}>
            <span>{referralCode}</span>
            <button onClick={() => navigator.clipboard.writeText(referralCode)}>
              Copy
            </button>
          </div>

          <label style={styles.label}>YOUR INVITE LINK</label>
          <div style={styles.row}>
            <span style={{ fontSize: 12 }}>{inviteLink}</span>
            <button onClick={() => navigator.clipboard.writeText(inviteLink)}>
              Copy
            </button>
          </div>

          <p style={styles.small}>
            Share to earn +0.5% APY boost for 30 days when friends deposit.
          </p>
        </section>

        {/* Apply Referral */}
        <section style={styles.card}>
          <label style={styles.label}>HAVE A REFERRAL CODE?</label>
          <div style={styles.row}>
            <input
              placeholder="Enter code"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
            />
            <button onClick={applyReferral}>Apply</button>
          </div>
        </section>

        {/* Deposit */}
        <section style={styles.card}>
          <label style={styles.label}>DEPOSIT (USDC)</label>
          <div style={styles.row}>
            <input
              type="number"
              placeholder="0.00"
              onChange={(e) => setDeposit(Number(e.target.value))}
            />
            <button>Deposit</button>
          </div>

          <p style={styles.small}>
            APY: {(apy + boost).toFixed(2)}%
          </p>
          <p style={styles.small}>
            Earnings: {balance.toFixed(6)} USDC
          </p>
        </section>

        {/* Email */}
        <section style={styles.cardBlue}>
          <h3>Stay in the loop</h3>
          <p>
            Subscribe to receive vault news, yield announcements and early
            feature previews.
          </p>
          <input
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={() => alert("Subscribed!")}>Notify me</button>
        </section>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          from { transform: translateY(110vh); }
          to { transform: translateY(-10vh); }
        }
      `}</style>
    </main>
  );
}

// --------------------
// Styles
// --------------------
const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#050b1e",
    color: "#fff",
    overflow: "hidden",
  },
  bg: {
    position: "fixed",
    inset: 0,
    zIndex: 0,
  },
  coin: {
    position: "absolute",
    bottom: "-10vh",
    borderRadius: "50%",
    opacity: 0.6,
    animationName: "float",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: 420,
    margin: "0 auto",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 2,
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardBlue: {
    background: "linear-gradient(135deg,#0a1f4d,#123a8a)",
    borderRadius: 20,
    padding: 20,
  },
  label: {
    fontSize: 12,
    opacity: 0.7,
  },
  row: {
    display: "flex",
    gap: 8,
    marginTop: 8,
  },
  small: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 6,
  },
};