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
  border: "none"
};

const withdraw = {
  flex: 1,
  padding: 14,
  borderRadius: 12,
  background: "transparent",
  color: "#4FD1FF",
  border: "1px solid #4FD1FF"
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