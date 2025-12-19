"use client";

import { useState } from "react";

export default function Home() {
  const [balance, setBalance] = useState(0); // Your Balance
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [referralBoost, setReferralBoost] = useState(0);

  // Deposit
  const handleDeposit = () => {
    if(depositAmount > 0) {
      let totalDeposit = depositAmount * (1 + referralBoost/100);
      setBalance(balance + totalDeposit);
      setDepositAmount(0);
    }
  }

  // Withdraw
  const handleWithdraw = () => {
    if(withdrawAmount > 0 && withdrawAmount <= balance) {
      setBalance(balance - withdrawAmount);
      setWithdrawAmount(0);
    }
  }

  // Simpler Referral Boost
  const handleReferral = () => {
    const boost = 5; // +5% APY boost per invite
    setReferralBoost(referralBoost + boost);
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 500, margin: "auto" }}>
      <h1>🚀 DropSignal Yield App</h1>
      <p>Your Balance: {balance.toFixed(2)} USDC</p>
      <p>Referral APY Boost: {referralBoost}%</p>

      {/* Deposit */}
      <div style={{ marginTop: 24 }}>
        <input 
          type="number" 
          placeholder="Amount to deposit" 
          value={depositAmount}
          onChange={(e) => setDepositAmount(parseFloat(e.target.value))}
        />
        <button onClick={handleDeposit} style={{ marginLeft: 12 }}>Deposit</button>
      </div>

      {/* Withdraw */}
      <div style={{ marginTop: 16 }}>
        <input 
          type="number" 
          placeholder="Amount to withdraw" 
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
        />
        <button onClick={handleWithdraw} style={{ marginLeft: 12 }}>Withdraw</button>
      </div>

      {/* Referral */}
      <div style={{ marginTop: 24 }}>
        <button onClick={handleReferral}>Invite Friend → +5% APY</button>
      </div>
    </main>
  );
}