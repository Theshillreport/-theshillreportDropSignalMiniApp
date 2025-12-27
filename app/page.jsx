"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

const AAVE_POOL = "0x76b026bEad8aA2D733E4cd602d7A44dE24a97c73";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bDA02913";

const AAVE_ABI = [
  "function supply(address asset,uint256 amount,address onBehalfOf,uint16 referralCode) external",
  "function withdraw(address asset,uint256 amount,address to) external returns (uint256)"
];

const ERC20_ABI = [
  "function approve(address spender,uint256 amount) external returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export default function Page() {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [usdcBalance, setUsdcBalance] = useState("0");

  const [apy] = useState(4.3);
  const [earnings, setEarnings] = useState(0);
  const [depositedTotal, setDepositedTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  // WALLET CONNECT
  const connectWallet = async () => {
    try {
      setLoading(true);

      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("wc@2:client:session");
        localStorage.removeItem("wc@2:core:pairing");
      }

      const { EthereumProvider } = await import("@walletconnect/ethereum-provider");

      const wc = await EthereumProvider.init({
        projectId: "6a6f915ce160625cbc11e74f7bc284e0",
        chains: [8453],
        showQrModal: true,
      });

      await wc.connect();
      const prov = new ethers.BrowserProvider(wc);
      setProvider(prov);

      const signer = await prov.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);

      loadUSDCBalance(prov, addr);
    } catch {
      alert("Wallet Verbindung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  // BALANCE
  const loadUSDCBalance = async (prov, addr) => {
    try {
      const signer = await prov.getSigner();
      const usdc = new ethers.Contract(USDC, ERC20_ABI, signer);
      const bal = await usdc.balanceOf(addr);
      setUsdcBalance(Number(bal) / 1e6);
    } catch {}
  };

  // DEPOSIT
  const deposit = async () => {
    try {
      if (!provider) return alert("Connect Wallet first");

      const signer = await provider.getSigner();
      const amount = ethers.parseUnits(depositAmount, 6);

      const usdc = new ethers.Contract(USDC, ERC20_ABI, signer);
      await usdc.approve(AAVE_POOL, amount);

      const pool = new ethers.Contract(AAVE_POOL, AAVE_ABI, signer);
      await pool.supply(USDC, amount, address, 0);

      setDepositedTotal((v) => v + Number(depositAmount));
      alert("Deposit erfolgreich!");

      loadUSDCBalance(provider, address);
    } catch {
      alert("Deposit Fehler");
    }
  };

  // WITHDRAW
  const withdraw = async () => {
    try {
      if (!provider) return alert("Connect Wallet first");

      const signer = await provider.getSigner();
      const amount = ethers.parseUnits(withdrawAmount, 6);

      const pool = new ethers.Contract(AAVE_POOL, AAVE_ABI, signer);
      await pool.withdraw(USDC, amount, address);

      alert("Withdraw erfolgreich!");
      loadUSDCBalance(provider, address);
    } catch {
      alert("Withdraw Fehler");
    }
  };

  // LIVE EARNINGS
  useEffect(() => {
    if (!depositedTotal) return;

    const yearlyRate = apy / 100;
    const perSecondRate = yearlyRate / (365 * 24 * 60 * 60);

    const interval = setInterval(() => {
      setEarnings((e) => e + depositedTotal * perSecondRate);
    }, 1000);

    return () => clearInterval(interval);
  }, [depositedTotal, apy]);

  // ===================== UI =====================

  // BEFORE CONNECT SCREEN
  if (!address) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg,#ff9a2b,#ff7b00)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {[...Array(30)].map((_, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              fontSize: Math.random() * 24 + 12,
              opacity: 0.25,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            $
          </span>
        ))}

        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "white",
            marginBottom: 15,
          }}
        />

        <h1 style={{ fontSize: 34 }}>DropSignal</h1>
        <p>USDC Yield auf Base</p>

        <button
          onClick={connectWallet}
          style={{
            background: "black",
            padding: "14px 18px",
            borderRadius: 14,
            border: "none",
            color: "white",
            fontSize: 18,
            marginTop: 25,
          }}
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      </div>
    );
  }

  // AFTER CONNECT SCREEN
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: 20,
        fontFamily: "system-ui",
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "linear-gradient(145deg,#ff7b00,#ffa640)",
            boxShadow: "0 0 25px #ff7b0080",
          }}
        />
        <h2>DropSignal</h2>
      </div>

      <p style={{ marginTop: 8, opacity: 0.7 }}>
        {address.slice(0, 6)}...{address.slice(-4)}
      </p>

      {/* CARDS */}
      <div style={{ marginTop: 25, display: "grid", gap: 15 }}>
        <div
          style={{
            background: "linear-gradient(135deg,#0d1335,#1a2c6b)",
            padding: 18,
            borderRadius: 16,
            boxShadow: "0px 0px 30px #132e7a50",
          }}
        >
          <h3>Aave APY</h3>
          <p style={{ fontSize: 32, color: "#00ffa6" }}>{apy}%</p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg,#0d1335,#13205c)",
            padding: 18,
            borderRadius: 16,
          }}
        >
          <h3>Balance</h3>
          <p style={{ fontSize: 26 }}>{usdcBalance} USDC</p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg,#071b2e,#0f3052)",
            padding: 18,
            borderRadius: 16,
          }}
        >
          <h3>Live Earnings</h3>
          <p style={{ fontSize: 28, color: "#00ffa6" }}>
            +{earnings.toFixed(6)} USDC
          </p>
        </div>
      </div>

      {/* DEPOSIT */}
      <div style={{ marginTop: 30 }}>
        <input
          placeholder="Deposit USDC"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "none",
            marginBottom: 10,
          }}
        />
        <button
          onClick={deposit}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            background: "green",
            border: "none",
            color: "white",
          }}
        >
          Deposit
        </button>
      </div>

      {/* WITHDRAW */}
      <div style={{ marginTop: 30 }}>
        <input
          placeholder="Withdraw USDC"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "none",
            marginBottom: 10,
          }}
        />
        <button
          onClick={withdraw}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            background: "red",
            border: "none",
            color: "white",
          }}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
}