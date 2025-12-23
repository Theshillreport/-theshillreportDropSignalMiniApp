"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { USDC_ADDRESS, USDC_ABI } from "../lib/usdc";

// 🔴 HIER DEINE DEPLOYTE VAULT-ADRESSE EINTRAGEN
const VAULT_ADDRESS = "0xfFc9Ad9B9A736544f062247Eb0D8a4F506805b69";

const VAULT_ABI = [
  "function deposit(uint256 amount)",
  "function withdraw(uint256 amount)",
  "function balances(address) view returns (uint256)",
  "function totalDeposits() view returns (uint256)"
];

export default function AppDashboard({ address }) {
  const [usdc, setUsdc] = useState(null);
  const [vault, setVault] = useState(null);

  const [walletBalance, setWalletBalance] = useState(0);
  const [vaultBalance, setVaultBalance] = useState(0);
  const [tvl, setTvl] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [apy] = useState(8.4);
  const [referrer, setReferrer] = useState(null);

  // Init Contracts
  useEffect(() => {
    if (!window.ethereum) return;

    const init = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setUsdc(new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer));
      setVault(new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, signer));
    };

    init();
  }, []);

  // Referral laden
  useEffect(() => {
    const ref = localStorage.getItem("dropsignal_ref");
    if (ref) setReferrer(ref);
  }, []);

  // Auto-Focus bei Farcaster Deposit
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "deposit") {
      setTimeout(() => {
        document.getElementById("deposit-input")?.focus();
      }, 300);
    }
  }, []);

  const loadData = async () => {
    if (!usdc || !vault) return;

    const wb = await usdc.balanceOf(address);
    const vb = await vault.balances(address);
    const tvlRaw = await vault.totalDeposits();

    setWalletBalance(Number(ethers.formatUnits(wb, 6)));
    setVaultBalance(Number(ethers.formatUnits(vb, 6)));
    setTvl(Number(ethers.formatUnits(tvlRaw, 6)));
  };

  useEffect(() => {
    loadData();
  }, [usdc, vault]);

  const deposit = async () => {
    if (!amount) return;
    setLoading(true);

    try {
      const value = ethers.parseUnits(amount, 6);

      const approveTx = await usdc.approve(VAULT_ADDRESS, value);
      await approveTx.wait();

      const tx = await vault.deposit(value);
      await tx.wait();

      setAmount("");
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async () => {
    if (!amount) return;
    setLoading(true);

    try {
      const tx = await vault.withdraw(
        ethers.parseUnits(amount, 6)
      );
      await tx.wait();

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
        <h1>DropSignal Vault</h1>

        <p style={styles.address}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>

        <div style={styles.apyBox}>
          <span>Estimated APY</span>
          <strong>{apy}%</strong>
        </div>

        <div style={styles.stats}>
          <div>
            <span>Wallet</span>
            <strong>{walletBalance.toFixed(2)} USDC</strong>
          </div>
          <div>
            <span>Your Vault</span>
            <strong>{vaultBalance.toFixed(2)} USDC</strong>
          </div>
          <div>
            <span>Total TVL</span>
            <strong>{tvl.toFixed(2)} USDC</strong>
          </div>
        </div>

        <input
          id="deposit-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount USDC"
          style={styles.input}
        />

        <button onClick={deposit} disabled={loading} style={styles.primary}>
          Deposit
        </button>

        <button onClick={withdraw} disabled={loading} style={styles.secondary}>
          Withdraw
        </button>

        {referrer && (
          <p style={styles.ref}>
            Referred by <strong>{referrer}</strong>
          </p>
        )}

        <p style={styles.note}>
          1% fee on deposits · Base · Non-custodial
        </p>
      </div>
    </main>
  );
}

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
    padding: 32,
    borderRadius: 24,
    background: "rgba(10,15,40,0.9)",
    textAlign: "center"
  },
  address: { opacity: 0.6 },
  apyBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    background:
      "linear-gradient(135deg, rgba(255,138,0,0.2), rgba(0,212,255,0.2))",
    fontSize: 18
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    margin: "24px 0"
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12
  },
  primary: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    background: "linear-gradient(135deg,#ff8a00,#00d4ff)",
    color: "white",
    border: "none",
    marginBottom: 10
  },
  secondary: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    background: "transparent",
    border: "1px solid #38bdf8",
    color: "#38bdf8"
  },
  ref: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.6
  },
  note: {
    marginTop: 16,
    opacity: 0.5,
    fontSize: 12
  }
};