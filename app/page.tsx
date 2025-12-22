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
  const [apy, setApy] = useState(7.2);

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
      </section>

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

        <input
          className="input"
          placeholder="Email address"
          disabled
        />
        <button className="primary full">Notify me</button>
      </section>
    </main>
  );
}