"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import BackgroundMatrix from "./components/BackgroundMatrix";

// Base Aave + USDC
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const AAVE_POOL = "0x6Ae63C4E349A8675D8aC49f37b51f72dF6bD29c1";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender,uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)"
];

const AAVE_POOL_ABI = [
  "function supply(address asset,uint256 amount,address onBehalfOf,uint16 referralCode)",
  "function withdraw(address asset,uint256 amount,address to)",
  "function getReserveData(address asset) view returns (uint256 configuration,uint128 liquidityIndex,uint128 currentLiquidityRate,uint128 variableBorrowIndex,uint128 currentVariableBorrowRate,uint128 stableBorrowRate,uint40 lastUpdateTimestamp,address aTokenAddress,uint8 id)"
];

export default function Home() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [apy, setApy] = useState(0);
  const [depositAmount, setDepositAmount] = useState("");

  // Load Aave APY after connect
  const loadAaveData = async (provider) => {
    try {
      const pool = new ethers.Contract(AAVE_POOL, AAVE_POOL_ABI, provider);
      const data = await pool.getReserveData(USDC);
      const liquidityRate = Number(data.currentLiquidityRate) / 1e27;
      setApy((liquidityRate * 100).toFixed(2));
    } catch (err) {
      console.log("Error loading Aave data:", err);
    }
  };

  // Live earnings counter
  useEffect(() => {
    if (!address || balance <= 0 || apy <= 0) return;
    const ratePerSec = (apy / 100) / 365 / 24 / 60 / 60;
    const interval = setInterval(() => {
      setEarnings((prev) => prev + balance * ratePerSec);
    }, 1000);
    return () => clearInterval(interval);
  }, [address, balance, apy]);

  // CONNECT WALLET
  const connectWallet = async () => {
    try {
      setLoading(true);
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("wc@2:client:session");
        localStorage.removeItem("wc@2:core:pairing");
      }
      const { EthereumProvider } = await import(
        "@walletconnect/ethereum-provider"
      );
      const wc = await EthereumProvider.init({
        projectId: "6a6f915ce160625cbc11e74f7bc284e0",
        chains: [8453],
        showQrModal: true
      });
      await wc.connect();
      const provider = new ethers.BrowserProvider(wc);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);
      await loadAaveData(provider);

      const token = new ethers.Contract(USDC, ERC20_ABI, provider);
      const decimals = await token.decimals();
      const bal = await token.balanceOf(addr);
      setBalance(Number(ethers.formatUnits(bal, decimals)));
    } catch (err) {
      console.log("Connect error:", err);
    } finally {
      setLoading(false);
    }
  };

  // DEPOSIT via Aave
  const deposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      alert("Enter an amount");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum || window.web3);
      const signer = await provider.getSigner();

      const token = new ethers.Contract(USDC, ERC20_ABI, signer);
      const pool = new ethers.Contract(AAVE_POOL, AAVE_POOL_ABI, signer);

      const dec = await token.decimals();
      const value = ethers.parseUnits(depositAmount, dec);

      await token.approve(AAVE_POOL, value);
      await pool.supply(USDC, value, address, 0);

      alert("Deposit successful!");
      setBalance((b) => b + Number(depositAmount));
      setDepositAmount("");
    } catch (err) {
      console.log("Deposit error:", err);
      alert("Deposit failed");
    }
  };

  // WITHDRAW via Aave
  const withdraw = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum || window.web3);
      const signer = await provider.getSigner();
      const pool = new ethers.Contract(AAVE_POOL, AAVE_POOL_ABI, signer);
      await pool.withdraw(USDC, ethers.MaxUint256, address);

      alert("Withdraw successful!");
      setBalance(0);
      setEarnings(0);
    } catch (err) {
      console.log("Withdraw error:", err);
      alert("Withdraw failed");
    }
  };

  return (
    <main style={styles.page}>
      {/* Matrix Hintergrund */}
      <BackgroundMatrix />

      {/* HEADER (X-QUO Style) */}
      <div style={styles.topBar}>
        <img src="/logo.png" style={styles.logoImg} />
        <span style={styles.logoText}>DropSignal</span>

        {address && (
          <div style={styles.profile}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        )}
      </div>

      {!address ? (
        <div style={styles.centerBox}>
          <h1 style={styles.mainTitle}>Earn REAL Aave Yield on Base</h1>
          <button
            onClick={connectWallet}
            disabled={loading}
            style={styles.connectBtn(loading)}
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      ) : (
        <div style={styles.dashboard}>
          <div style={styles.card}>
            <p>Total Deposited</p>
            <h2>{balance.toFixed(2)} USDC</h2>
          </div>

          <div style={styles.card}>
            <p>Live Earnings</p>
            <h2>+{earnings.toFixed(6)} USDC</h2>
          </div>

          <div style={styles.card}>
            <p>Current APY</p>
            <h2>{apy}%</h2>
          </div>

          <input
            type="number"
            placeholder="Amount USDC"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            style={styles.input}
          />

          <div style={styles.btnRow}>
            <button style={styles.depositBtn} onClick={deposit}>
              Deposit
            </button>
            <button style={styles.withdrawBtn} onClick={withdraw}>
              Withdraw
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    background: "#ff7a00",
    color: "#fff"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px"
  },
  logoImg: {
    width: 40,
    height: 40,
    borderRadius: "50%"
  },
  logoText: {
    fontSize: 20,
    fontWeight: 800
  },
  profile: {
    padding: "6px 12px",
    borderRadius: 12,
    background: "rgba(0,0,0,0.4)"
  },
  centerBox: {
    textAlign: "center",
    marginTop: 120
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 900,
    marginBottom: 18
  },
  connectBtn: (loading) => ({
    padding: "12px 24px",
    borderRadius: 12,
    background: "#000",
    color: "#fff",
    fontSize: 18,
    opacity: loading ? 0.6 : 1
  }),
  dashboard: {
    textAlign: "center",
    marginTop: 60
  },
  card: {
    background: "rgba(0,0,0,0.4)",
    padding: 18,
    borderRadius: 14,
    margin: "10px auto",
    width: "85%",
    border: "1px solid rgba(255,255,255,0.3)"
  },
  input: {
    width: "80%",
    padding: 12,
    borderRadius: 10,
    border: "none",
    margin: "16px auto",
    display: "block"
  },
  btnRow: {
    display: "flex",
    justifyContent: "center",
    gap: 12
  },
  depositBtn: {
    padding: "12px 20px",
    background: "#00ff9c",
    borderRadius: 12,
    border: "none",
    color: "#000",
    fontWeight: 700
  },
  withdrawBtn: {
    padding: "12px 20px",
    background: "#ff0033",
    borderRadius: 12,
    border: "none",
    color: "#fff",
    fontWeight: 700
  }
};