"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [account, setAccount] = useState(null);
  const [connected, setConnected] = useState(false);

  // Earnings Counter
  const [earnings, setEarnings] = useState(0);
  const apy = 4.2; // Demo APY
  const startAmount = 1000; // Beispiel Start Balance

  useEffect(() => {
    if (!connected) return;

    let amt = 0;
    const perSecond = (startAmount * (apy / 100)) / (365 * 24 * 60 * 60);

    const interval = setInterval(() => {
      amt += perSecond;
      setEarnings(amt);
    }, 1000);

    return () => clearInterval(interval);
  }, [connected]);

  // Wallet Connect
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Keine Wallet gefunden. Bitte MetaMask oder Coinbase Wallet nutzen.");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
      setConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050B1E",
        color: "white",
        fontFamily: "system-ui, sans-serif",
        padding: 18,
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <img
          src="/logo.png"
          alt="App Logo"
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>DropSignal Yield</span>
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            Earn on Base · Powered by Aave
          </span>
        </div>
      </div>

      {/* CARD */}
      <div
        style={{
          background: "#0F1A3A",
          borderRadius: 16,
          padding: 18,
          marginTop: 10,
        }}
      >
        {!connected && (
          <>
            <p style={{ opacity: 0.7 }}>Verbinde deine Wallet um zu starten</p>

            <button
              onClick={connectWallet}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "none",
                background: "#3478F6",
                color: "white",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Connect Wallet
            </button>
          </>
        )}

        {connected && (
          <>
            <p style={{ opacity: 0.7 }}>
              Verbunden: {account.slice(0, 6)}...{account.slice(-4)}
            </p>

            <div
              style={{
                marginTop: 20,
                background: "#081029",
                padding: 16,
                borderRadius: 12,
              }}
            >
              <p style={{ margin: 0, opacity: 0.8 }}>Live Earnings</p>

              <h1 style={{ margin: 0, marginTop: 6 }}>
                ${earnings.toFixed(6)}
              </h1>

              <p style={{ marginTop: 5, opacity: 0.6 }}>
                APY ~ {apy}% (Demo Anzeige)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}