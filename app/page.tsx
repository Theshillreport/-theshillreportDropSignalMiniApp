"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

/* ---------------- CONFIG ---------------- */

const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // Base Sepolia USDC
const VAULT_ADDRESS = "0x1111111111111111111111111111111111111111"; // placeholder

const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

const VAULT_ABI = [
  "function deposit(uint256 amount) external",
  "function withdraw(uint256 amount) external",
  "function balanceOf(address user) view returns (uint256)"
];

/* ---------------- PAGE ---------------- */

export default function Page() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string>("");

  const [usdcBalance, setUsdcBalance] = useState("0.00");
  const [vaultBalance, setVaultBalance] = useState("0.00");
  const [amount, setAmount] = useState("");

  /* ---------- WALLET ---------- */

  async function connectWallet() {
    if (!window.ethereum) {
      alert("No wallet detected");
      return;
    }

    const prov = new ethers.BrowserProvider(window.ethereum);
    const sign = await prov.getSigner();
    const addr = await sign.getAddress();

    setProvider(prov);
    setSigner(sign);
    setAddress(addr);
  }

  /* ---------- LOAD BALANCES ---------- */

  async function loadBalances() {
    if (!signer || !address) return;

    const usdc = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);
    const vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, signer);

    const decimals = await usdc.decimals();
    const bal = await usdc.balanceOf(address);
    const vbal = await vault.balanceOf(address);

    setUsdcBalance(ethers.formatUnits(bal, decimals));
    setVaultBalance(ethers.formatUnits(vbal, decimals));
  }

  useEffect(() => {
    loadBalances();
  }, [signer]);

  /* ---------- DEPOSIT ---------- */

  async function deposit() {
    if (!signer || !amount) return;

    const usdc = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);
    const vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, signer);

    const value = ethers.parseUnits(amount, 6);

    const approveTx = await usdc.approve(VAULT_ADDRESS, value);
    await approveTx.wait();

    const tx = await vault.deposit(value);
    await tx.wait();

    setAmount("");
    loadBalances();
  }

  /* ---------- WITHDRAW ---------- */

  async function withdraw() {
    if (!signer || !amount) return;

    const vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, signer);
    const value = ethers.parseUnits(amount, 6);

    const tx = await vault.withdraw(value);
    await tx.wait();

    setAmount("");
    loadBalances();
  }

  /* ---------------- UI ---------------- */

  return (
    <main style={container}>
      <h1 style={logo}>DropSignal</h1>
      <p style={subtitle}>Deposit USDC to earn yield</p>

      {!address ? (
        <button style={primary} onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <>
          <p style={addressStyle}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>

          <div style={card}>
            <p>Your Wallet</p>
            <h2>{usdcBalance} USDC</h2>
          </div>

          <div style={card}>
            <p>Deposited</p>
            <h2>{vaultBalance} USDC</h2>
          </div>

          <input
            style={input}
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />

          <button style={primary} onClick={deposit}>
            Deposit
          </button>

          <button style={secondary} onClick={withdraw}>
            Withdraw
          </button>
        </>
      )}
    </main>
  );
}

/* ---------------- STYLES ---------------- */

const container = {
  minHeight: "100vh",
  background: "linear-gradient(160deg,#0b1020,#1b1450)",
  color: "white",
  padding: 24,
  maxWidth: 420,
  margin: "0 auto"
};

const logo = { fontSize: 32, fontWeight: 800 };
const subtitle = { opacity: 0.7, marginBottom: 24 };
const addressStyle = { fontSize: 12, opacity: 0.6, marginBottom: 16 };

const card = {
  background: "rgba(255,255,255,0.05)",
  borderRadius: 16,
  padding: 16,
  marginBottom: 16
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  marginBottom: 12
};

const primary = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  background: "#7c5cff",
  color: "white",
  fontWeight: 700,
  border: "none",
  marginBottom: 10
};

const secondary = {
  ...primary,
  background: "transparent",
  border: "1px solid #7c5cff"
};