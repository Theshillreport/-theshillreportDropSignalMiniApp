"use client";

import { useState } from "react";
import EthereumProvider from "@walletconnect/ethereum-provider";

/* ---------- FLOATING COINS BACKGROUND ---------- */

function FloatingCoins() {
  const coins = Array.from({ length: 60 });

  return (
    <div className="coins">
      {coins.map((_, i) => (
        <span
          key={i}
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 5}s`,
            background: `hsl(${Math.random() * 360}, 80%, 60%)`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- MAIN ---------- */

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  async function connectWallet() {
    try {
      setConnecting(true);

      const provider = await EthereumProvider.init({
        projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
        chains: [8453], // Base Mainnet (UI only for now)
        showQrModal: true,
      });

      await provider.enable();

      const accounts = provider.accounts;
      setAddress(accounts[0]);
    } catch (err) {
      console.error(err);
      alert("Wallet connection cancelled");
    } finally {
      setConnecting(false);
    }
  }

  return (
    <main className="wrapper">
      <FloatingCoins />

      <section className="card hero">
        <h1>
          Drop<span>Signal</span>
        </h1>
        <p className="subtitle">Deposit USDC to earn yield</p>

        {!address ? (
          <button className="primary full" onClick={connectWallet}>
            {connecting ? "Connecting..." : "Connect"}
          </button>
        ) : (
          <p className="connected">
            Connected: {address.slice(0, 6)}…{address.slice(-4)}
          </p>
        )}
      </section>

      {address && (
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
            <h2>7.20% • live</h2>
          </section>
        </>
      )}
    </main>
  );
}

/* ---------- STYLES ---------- */

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
  margin-bottom: 14px;
}

.connected {
  font-size: 13px;
  opacity: 0.75;
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

.full {
  width: 100%;
}
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = styles;
  document.head.appendChild(style);
}