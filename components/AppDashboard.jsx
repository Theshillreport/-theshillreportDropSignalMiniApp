"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { USDC_ADDRESS, USDC_ABI } from "../lib/usdc";

const VAULT_ADDRESS = "0xDEINE_VAULT_ADRESSE";

const VAULT_ABI = [
  "function deposit(uint256)",
  "function withdraw(uint256)",
  "function balances(address) view returns (uint256)",
  "function totalDeposits() view returns (uint256)"
];

export default function AppDashboard({ address }) {
  const [usdc, setUsdc] = useState(null);
  const [vault, setVault] = useState(null);

  const [walletBalance, setWalletBalance] = useState(0);
  const [vaultBalance, setVaultBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("deposit");
  const [loading, setLoading] = useState(false);

  const APY = 8.4;

  useEffect(() => {
    const init = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setUsdc(new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer));
      setVault(new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, signer));
    };
    init();
  }, []);

  const loadData = async () => {
    if (!usdc || !vault) return;

    const wb = await usdc.balanceOf(address);
    const vb = await vault.balances(address);

    setWalletBalance(Number(ethers.formatUnits(wb, 6)));
    setVaultBalance(Number(ethers.formatUnits(vb, 6)));
  };

  useEffect(() => {
    loadData();
  }, [usdc, vault]);

  const action = async () => {
    if (!amount) return;
    setLoading(true);

    try {
      const value = ethers.parseUnits(amount, 6);

      if (mode === "deposit") {
        await (await usdc.approve(VAULT_ADDRESS, value)).wait();
        await (await vault.deposit(value)).wait();
      } else {
        await (await vault.withdraw(value)).wait();
      }

      setAmount("");
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>

        {/* BALANCE CARD */}
        <div style={styles.balanceCard}>
          <p style={styles.sub}>YOUR BALANCE</p>
          <h1 style={styles.balance}>
            ${vaultBalance.toFixed(2)}
          </h1>
          <p style={styles.apy}>•• APY {APY}%</p>
        </div>

        {/* BOOSTS */}
        <p style={styles.section}>EARN YOUR BOOSTS</p>
        <div style={styles.boosts}>
          <div style={styles.boost}>WELCOME BOOST<br /><span>+0.00%</span></div>
          <div style={styles.boost}>REFERRAL BOOST<br /><span>+0.00%</span></div>
        </div>

        {/* TABS */}
        <div style={styles.tabs}>
          <button
            onClick={() => setMode("deposit")}
            style={mode === "deposit" ? styles.tabActive : styles.tab}
          >
            Deposit
          </button>
          <button
            onClick={() => setMode("withdraw")}
            style={mode === "withdraw" ? styles.tabActive : styles.tab}
          >
            Withdraw
          </button>
        </div>

        {/* INPUT */}
        <div style={styles.inputBox}>
          <div style={styles.available}>
            Available: {walletBalance.toFixed(2)} USDC
            <span onClick={() => setAmount(walletBalance)}>MAX</span>
          </div>

          <div style={styles.amountRow}>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={styles.amountInput}
            />
            <span>USDC</span>
          </div>
        </div>

        <button onClick={action} disabled={loading} style={styles.actionBtn}>
          {loading ? "Processing..." : mode === "deposit" ? "Deposit" : "Withdraw"}
        </button>

      </div>
    </main>
  );
}

const glow = "0 0 40px rgba(255,140,0,0.35)";

const styles = {
  container: {
    minHeight: "100vh",
    background: "#050b1e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white"
  },
  card: {
    width: 380,
    padding: 24
  },
  balanceCard: {
    background: "radial-gradient(circle at top, #ff8a0030, #0a0f28)",
    borderRadius: 20,
    padding: 28,
    textAlign: "center",
    boxShadow: glow
  },
  sub: { opacity: 0.6, fontSize: 12 },
  balance: { fontSize: 42, margin: "10px 0" },
  apy: { color: "#38bdf8" },

  section: {
    margin: "28px 0 12px",
    opacity: 0.6,
    fontSize: 12
  },
  boosts: {
    display: "flex",
    gap: 12
  },
  boost: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    background: "rgba(255,255,255,0.05)",
    textAlign: "center",
    fontSize: 12
  },
  tabs: {
    display: "flex",
    marginTop: 28,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 16
  },
  tab: {
    flex: 1,
    padding: 14,
    background: "transparent",
    border: "none",
    color: "white",
    opacity: 0.4
  },
  tabActive: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    background: "linear-gradient(135deg,#ff8a00,#00d4ff)",
    border: "none",
    color: "white",
    boxShadow: glow
  },
  inputBox: {
    marginTop: 20,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 16
  },
  available: {
    fontSize: 12,
    opacity: 0.6,
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
    cursor: "pointer"
  },
  amountRow: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  amountInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: 28,
    outline: "none"
  },
  actionBtn: {
    width: "100%",
    marginTop: 24,
    padding: 16,
    borderRadius: 18,
    border: "none",
    background: "linear-gradient(135deg,#ff8a00,#00d4ff)",
    color: "white",
    fontSize: 16,
    boxShadow: glow
  }
};