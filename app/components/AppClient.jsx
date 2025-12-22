"use client";

import { useEffect, useState } from "react";

export default function AppClient() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0.00");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install a wallet (Farcaster / MetaMask / Coinbase)");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
  };

  return (
    <main style={styles.container}>
      <div style={styles.background} />

      <div style={styles.card}>
        <h1 style={styles.logo}>DropSignal</h1>
        <p style={styles.tagline}>Deposit USDC. Earn Yield.</p>

        {!account ? (
          <button style={styles.primaryBtn} onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <>
            <div style={styles.address}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>

            <div style={styles.balance}>
              Your Balance  
              <strong>{balance} USDC</strong>
            </div>

            <button style={styles.primaryBtn}>Deposit</button>
            <button style={styles.secondaryBtn}>Withdraw</button>
          </>
        )}
      </div>
    </main>
  );
}
