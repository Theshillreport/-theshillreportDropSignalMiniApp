"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install a wallet");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
  };

  if (!mounted) return null;

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>DropSignal</h1>

        {!account ? (
          <button style={styles.button} onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <>
            <p style={styles.text}>
              Connected:
              <br />
              {account.slice(0, 6)}...{account.slice(-4)}
            </p>

            <button style={styles.secondary}>
              Deposit (soon)
            </button>

            <button style={styles.secondary}>
              Withdraw (soon)
            </button>
          </>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "radial-gradient(circle, #ff9f1c, #1e3a8a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#0b1025",
    padding: 32,
    borderRadius: 20,
    width: 340,
    textAlign: "center",
    color: "#fff",
  },
  logo: {
    fontSize: 26,
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #ff9f1c, #38bdf8)",
    color: "#000",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondary: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    border: "1px solid #334155",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
  },
};