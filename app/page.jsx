"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const VAULT_ADDRESS = "0xYOUR_WALLET_ADDRESS_HERE";

const USDC_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install a wallet.");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
    loadBalance(accounts[0]);
  };

  const loadBalance = async (addr) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const usdc = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);
    const bal = await usdc.balanceOf(addr);
    setBalance(ethers.formatUnits(bal, 6));
  };

  const depositUSDC = async () => {
    if (!amount) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const usdc = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);

    const tx = await usdc.transfer(
      VAULT_ADDRESS,
      ethers.parseUnits(amount, 6)
    );

    await tx.wait();
    setAmount("");
    loadBalance(account);
  };

  if (!mounted) return null;

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>DropSignal</h1>

        {!account ? (
          <button onClick={connectWallet} style={styles.btn}>
            Connect
          </button>
        ) : (
          <>
            <div style={styles.addr}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>

            <div style={styles.balance}>
              USDC Balance: {balance}
            </div>

            <input
              style={styles.input}
              placeholder="Amount USDC"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button onClick={depositUSDC} style={styles.btn}>
              Deposit USDC
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#050B1E",
  },
  card: {
    background: "rgba(20,25,60,0.9)",
    padding: 32,
    borderRadius: 20,
    width: 360,
    textAlign: "center",
  },
  logo: {
    color: "#fff",
    marginBottom: 20,
  },
  addr: {
    color: "#a5b4fc",
    marginBottom: 10,
  },
  balance: {
    color: "#22c55e",
    marginBottom: 12,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    border: "none",
  },
  btn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    background: "linear-gradient(135deg,#6366f1,#9333ea)",
    color: "#fff",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  },
};