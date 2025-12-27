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

  // ---------------- WALLET ----------------
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

  // ---------------- BALANCE ----------------
  const loadUSDCBalance = async (prov, addr) => {
    try {
      const signer = await prov.getSigner();
      const usdc = new ethers.Contract(USDC, ERC20_ABI, signer);
      const bal = await usdc.balanceOf(addr);
      setUsdcBalance(Number(bal) / 1e6);
    } catch {}
  };

  // ---------------- DEPOSIT ----------------
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

  // ---------------- WITHDRAW ----------------
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

  // ---------------- LIVE EARNINGS ENGINE ----------------
  useEffect(() => {
    if (!depositedTotal) return;

    const yearlyRate = apy / 100;
    const perSecondRate = yearlyRate / (365 * 24 * 60 * 60);

    const interval = setInterval(() => {
      setEarnings((e) => e + depositedTotal * perSecondRate);
    }, 1000);

    return () => clearInterval(interval);
  }, [depositedTotal, apy]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050b1e",
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
            background: "#ff7b00",
          }}
        />
        <h2>DropSignal</h2>
      </div>

      {!address ? (
        <button
          onClick={connectWallet}
          style={{
            background: "#ff7b00",
            padding: 12,
            width: "100%",
            borderRadius: 10,
            border: "none",
            color: "white",
            fontSize: 16,
            marginTop: 40,
          }}
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <>
          <p style={{ marginTop: 20 }}>
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </p>

          {/* LIVE APY */}
          <div
            style={{
              marginTop: 20,
              background: "#0d1335",
              padding: 15,
              borderRadius: 10,
            }}
          >
            <h3>Aave Live Yield</h3>
            <p style={{ fontSize: 26 }}>{apy}%</p>
          </div>

          {/* BALANCE */}
          <div
            style={{
              marginTop: 20,
              background: "#0d1335",
              padding: 15,
              borderRadius: 10,
            }}
          >
            <h3>Your USDC Balance</h3>
            <p style={{ fontSize: 22 }}>{usdcBalance} USDC</p>
          </div>

          {/* LIVE EARNINGS */}
          <div
            style={{
              marginTop: 20,
              background: "#13205c",
              padding: 15,
              borderRadius: 10,
            }}
          >
            <h3>Live Earnings</h3>
            <p style={{ fontSize: 26, color: "#00ffa6" }}>
              +{earnings.toFixed(6)} USDC
            </p>
          </div>

          {/* DEPOSIT */}
          <div style={{ marginTop: 30 }}>
            <input
              placeholder="USDC Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "none",
                marginBottom: 10,
              }}
            />

            <button
              onClick={deposit}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                background: "green",
                border: "none",
                color: "white",
                fontSize: 16,
              }}
            >
              Deposit
            </button>
          </div>

          {/* WITHDRAW */}
          <div style={{ marginTop: 30 }}>
            <input
              placeholder="Withdraw Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "none",
                marginBottom: 10,
              }}
            />

            <button
              onClick={withdraw}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                background: "red",
                border: "none",
                color: "white",
                fontSize: 16,
              }}
            >
              Withdraw
            </button>
          </div>
        </>
      )}
    </div>
  );
}