"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import USDCAbi from "../lib/usdcAbi.json"; // ERC20 ABI
import VaultAbi from "../lib/vaultAbi.json"; // Dein Vault Contract ABI

const USDC_ADDRESS = "0xfFc9Ad9B9A736544f062247Eb0D8a4F506805b69"; // USDC Testnet Address
const VAULT_ADDRESS = "0x..."; // Dein Vault Contract Address

export default function Home() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [signer, setSigner] = useState<ethers.Signer>();
  const [address, setAddress] = useState<string>();
  const [balance, setBalance] = useState(0);
  const [dailyReward, setDailyReward] = useState(0);
  const [amount, setAmount] = useState("");
  const [showDeposit, setShowDeposit] = useState(false);

  const apy = 18.4;

  // Wallet connect
  async function connectWallet() {
    if (!window.ethereum) return alert("Metamask not installed!");
    const p = new ethers.providers.Web3Provider(window.ethereum);
    await p.send("eth_requestAccounts", []);
    const s = p.getSigner();
    const a = await s.getAddress();
    setProvider(p);
    setSigner(s);
    setAddress(a);
    // Lade initial Balance vom Contract
    const vault = new ethers.Contract(VAULT_ADDRESS, VaultAbi, s);
    const bal = await vault.balanceOf(a);
    setBalance(Number(ethers.utils.formatUnits(bal, 6)));
  }

  // Deposit echte USDC
  async function handleDeposit() {
    if (!signer) return;
    const usdc = new ethers.Contract(USDC_ADDRESS, USDCAbi, signer);
    const vault = new ethers.Contract(VAULT_ADDRESS, VaultAbi, signer);
    const value = ethers.utils.parseUnits(amount, 6);

    // 1️⃣ Approve
    const tx1 = await usdc.approve(VAULT_ADDRESS, value);
    await tx1.wait();

    // 2️⃣ Deposit
    const tx2 = await vault.deposit(value);
    await tx2.wait();

    // Update UI
    setBalance(prev => prev + Number(amount));
    setDailyReward(prev => prev + Number(amount) * 0.0018);
    setAmount("");
    setShowDeposit(false);
  }

  // Auto Yield pro Sekunde (UI)
  useEffect(() => {
    const interval = setInterval(() => {
      setBalance(prev => prev + (prev * apy) / 100 / 31536000);
      setDailyReward(prev => prev + (balance * apy) / 100 / 31536000);
    }, 1000);
    return () => clearInterval(interval);
  }, [apy, balance]);

  // Claim reward (UI)
  function claimReward() {
    setBalance(prev => prev + dailyReward);
    setDailyReward(0);
  }

  return (
    <main style={{ padding: 24, maxWidth: 420, margin: "0 auto", position: "relative", overflow: "hidden" }}>
      {/* Hintergrund Animation */}
      <div className="coin-background"></div>

      <h1 style={{ fontSize: 32 }}>
        🚀 <span style={{ color: "#FF8A00" }}>Drop</span>
        <span style={{ color: "#4FD1FF" }}>Signal</span>
      </h1>

      {!address ? (
        <button onClick={connectWallet} style={deposit}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected: {address.slice(0,6)}…{address.slice(-4)}</p>
          <div style={card}>
            <p style={{ opacity: 0.6 }}>Your Balance</p>
            <h2>${balance.toFixed(2)} USDC</h2>
            <p style={{ color: "#4FD1FF" }}>+ ${dailyReward.toFixed(2)} today</p>
          </div>

          <button style={deposit} onClick={() => setShowDeposit(true)}>Deposit USDC</button>
          {showDeposit && (
            <div style={overlay}>
              <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" style={input}/>
              <button style={deposit} onClick={handleDeposit}>Confirm</button>
              <button style={withdrawBtn} onClick={()=>setShowDeposit(false)}>Cancel</button>
            </div>
          )}

          <div style={{ ...card, marginTop: 24 }}>
            <p style={{ opacity: 0.6 }}>Daily Reward</p>
            <h3>+ ${dailyReward.toFixed(2)}</h3>
            <button style={claim} onClick={claimReward}>Claim</button>
          </div>
        </>
      )}
    </main>
  );
}

/* ------------------- Styles (inklusive Overlay) ------------------- */
const card = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(79,209,255,0.35)",
  borderRadius: 16,
  padding: 16,
  marginTop: 16,
  boxShadow: "0 0 40px rgba(79,209,255,0.08)"
};

const deposit = {
  padding: 14,
  borderRadius: 12,
  background: "linear-gradient(135deg,#FF8A00,#FFB347)",
  color: "#000",
  fontWeight: 700,
  border: "none",
  width: "100%"
};

const withdrawBtn = {
  padding: 14,
  borderRadius: 12,
  background: "transparent",
  color: "#4FD1FF",
  border: "1px solid #4FD1FF",
  width: "100%"
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

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10
};

const input = {
  width: "200px",
  padding: 12,
  borderRadius: 8,
  border: "none",
  marginBottom: 16
};