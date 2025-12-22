"use client";

import { useEffect, useState } from "react";

/* ---------- FLOATING COINS BACKGROUND ---------- */

function FloatingCoins() {
  const coins = Array.from({ length: 70 });

  return (
    <div className="coins">
      {coins.map((_, i) => (
        <span
          key={i}
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 5}s`,
            background: `hsl(${Math.random() * 360}, 80%, 60%)`
          }}
        />
      ))}
    </div>
  );
}

/* ---------- MAIN PAGE ---------- */

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [apy, setApy] = useState(7.2);

  async function connectWallet() {
    if (!(window as any).ethereum) {
      alert("No wallet detected");
      return;
    }

    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts"
    });

    setAddress(accounts[0]);
    setConnected(true);
  }

  useEffect(() => {
    const i = setInterval(() => {
      setApy(a => +(a + (Math.random() - 0.5) * 0.01).toFixed(2));
    }, 1500);
    return () => clearInterval(i);
  }, []);

  return (
    <main className="wrapper">
      <FloatingCoins />

      <section className="card hero">
        <h1>
          Drop<span>Signal</span>
        </h1>
        <p className="subtitle">Deposit USDC to earn yield</p>

        {!connected && (
          <button className="primary full" onClick={connectWallet}>
            Connect
          </button>
        )}

        {connected && (
          <p className="connected">
            Connected: {address?.slice(0, 6)}…{address?.slice(-4)}
          </p>
        )}
      </section>

      {connected && (
        <>
          <section className="card">
            <p className="label">Deposited</p>
            <h2>$0.00 USDC</h2>
            <p className="positive">+ $0.0000 earned</p>
          </section>

          <div className="actions">
            <button className="primary">Deposit</button>
            <button className="secondary">Withdraw</button>
          </div>

          <section className="card">
            <p className="label">Current APY</p>
            <h2>{apy}% • live</h2>
          </section>

          <section className="card">
            <h3>Earn Your Boosts</h3>

            <div className="boost locked">
              🔒 Welcome Boost <span>+0.00%</span>
            </div>
            <div className="boost locked">
              🔒 Referral Boost <span>+0.00%</span>
            </div>
          </section>

          <section className="card">
            <h3>Reward Hub</h3>
            <p className="muted">
              Stay in the loop. Get early access to yield upgrades and new features.
            </p>

            <input className="input" placeholder="Email address" />
            <button className="primary full">Notify me</button>
          </section>
        </>
      )}
    </main>
  );
}

/* ---------- STYLES (INLINE, BUILD SAFE) ---------- */

const styles = `
.wrapper {
  min-height: 100vh;
  background: radial-gradient(circle at top, #2b0d52, #050814);
  color: white;
  padding: 24px;
  max-width: 420px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  font-family: Inter, system-ui;
}

.coins {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.coins span {
  position: absolute;
  bottom: -10px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  opacity: 0.35;
  animation: float linear infinite;
}

@keyframes float {
  to {
    transform: translateY(-110vh);
  }
}

.card {
  position: relative;
  z-index: 2;
  background: rgba(255,255,255,0.04);
  border-radius: 16px;
  padding: 16px;
  margin-top: 16px;
  border: 1px solid rgba(255,255,255,0.08);
}

.hero h1 {
  font-size: 36px;
}

.hero span {
  color: #9b7cff;
}

.subtitle {
  opacity: 0.7;
  margin-bottom: 12px;
}

.connected {
  margin-top: 8px;
  font-size: 13px;
  opacity: 0.7;
}

.label {
  opacity: 0.6;
}

.positive {
  color: #4fd1ff;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.primary {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  background: linear-gradient(135deg,#9b7cff,#4fd1ff);
  border: none;
  color: black;
  font-weight: 700;
}

.secondary {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  background: transparent;
  border: 1px solid #9b7cff;
  color: #9b7cff;
}

.boost {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  opacity: 0.6;
}

.input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  margin-top: 12px;
}

.full {
  width: 100%;
  margin-top: 12px;
}
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = styles;
  document.head.appendChild(style);
}