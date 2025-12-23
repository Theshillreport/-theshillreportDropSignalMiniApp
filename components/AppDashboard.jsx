"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { USDC_ADDRESS, USDC_ABI } from "../lib/usdc";

const VAULT_ADDRESS = "0xfFc9Ad9B9A736544f062247Eb0D8a4F506805b69";

const VAULT_ABI = [
  "function deposit(uint256 amount)",
  "function withdraw(uint256 amount)",
  "function balances(address) view returns (uint256)",
  "function totalDeposits() view returns (uint256)"
];

export default function AppDashboard({ address }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [usdc, setUsdc] = useState(null);
  const [vault, setVault] = useState(null);

  const [walletBalance, setWalletBalance] = useState(0);
  const [vaultBalance, setVaultBalance] = useState(0);
  const [tvl, setTvl] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Init
  useEffect(() => {
    if (!window.ethereum) return;

    const init = async () => {
      const prov = new ethers.BrowserProvider(window.ethereum);
      const sign = await prov.getSigner();

      setProvider(prov);
      setSigner(sign);

      setUsdc(new ethers.Contract(USDC_ADDRESS, USDC_ABI, sign));
      setVault(new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, sign));
    };

    init();
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

        <p style={styles.note}>
          1% fee on deposits • Base • Non-custodial
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
  note: {
    marginTop: 20,
    opacity: 0.5,
    fontSize: 12
  }
};