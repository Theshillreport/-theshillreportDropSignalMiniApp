"use client";

import { useState } from "react";

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const apy = 8.4; // example APY

  function deposit() {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0) {
      setBalance(prev => prev + value);
      setAmount("");
      setShowDeposit(false);
    }
  }

  function withdraw() {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0 && value <= balance) {
      setBalance(prev => prev - value);
      setAmount("");
      setShowWithdraw(false);
    }
  }

  return (
    <main>
      <div className="card">
        <h1>💰 USDC Yield Vault</h1>

        <p><strong>Your Balance</strong></p>
        <h2>{balance.toFixed(2)} USDC</h2>

        <p>APY: <strong>{apy}%</strong></p>

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button onClick={() => setShowDeposit(true)}>Deposit</button>
          <button onClick={() => setShowWithdraw(true)}>Withdraw</button>
        </div>
      </div>

      {(showDeposit || showWithdraw) && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div className="card">
            <h3>{showDeposit ? "Deposit USDC" : "Withdraw USDC"}</h3>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "none",
                marginBottom: 16
              }}
            />

            <button onClick={showDeposit ? deposit : withdraw}>
              Confirm
            </button>

            <button
              style={{ marginLeft: 10, background: "#444" }}
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