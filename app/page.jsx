"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import BackgroundMatrix from "./components/BackgroundMatrix";

// Base Aave + USDC
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const AAVE_POOL = "0x6Ae63C4E349A8675D8aC49f37b51f72dF6bD29c1";

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 value) public returns (bool)",
  "function transfer(address to,uint256 value) public returns (bool)",
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

  const [amount, setAmount] = useState("");

  // Fetch Aave data once user connects
  const loadAaveData = async (provider) => {
    try {
      const pool = new ethers.Contract(AAVE_POOL, AAVE_POOL_ABI, provider);
      const data = await pool.getReserveData(USDC);

      const liquidityRate = Number(data.currentLiquidityRate) / 1e27;
      setApy((liquidityRate * 100).toFixed(2));
    } catch (err) {
      console.error("Aave fetch error:", err);
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

      // fetch current USDC balance
      const token = new ethers.Contract(USDC, ERC20_ABI, provider);
      const dec = await token.decimals();
      const b = await token.balanceOf(addr);
      setBalance(Number(ethers.formatUnits(b, dec)));

    } catch (err) {
      console.error("Connect Wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  const deposit = async () => {
    try {
      if (!amount || Number(amount) <= 0) return;

      const provider = new ethers.BrowserProvider(window.ethereum || window.web3);
      const signer = await provider.getSigner();

      const token = new ethers.Contract(USDC, ERC20_ABI, signer);
      const pool = new ethers.Contract(AAVE_POOL, AAVE_POOL_ABI, signer);

      const dec = await token.decimals();

      const value = ethers.parseUnits(amount, dec);

      // approve
      await token.approve(AAVE_POOL, value);
      // supply
      await pool.supply(USDC, value, address, 0);

      alert("Deposit success!");
      setBalance((prev) => prev + Number(amount));

    } catch (err) {
      console.error("Deposit error:", err);
      alert("Deposit failed");
    }
  };

  const withdraw = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum || window.web3);
      const signer = await provider.getSigner();

      const pool = new ethers.Contract(AAVE_POOL, AAVE_POOL_ABI, signer);

      const decUsdc = await pool.getReserveData(USDC);

      await pool.withdraw(USDC, ethers.MaxUint256, address);

      alert("Withdraw success!");
      setBalance(0);
      setEarnings(0);

    } catch (err) {
      console.error("Withdraw error:", err);
      alert("Withdraw failed");
    }
  };

  return (
    <main style={styles.page}>
      <BackgroundMatrix />

      {/* HEADER like X-QUO */}
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
          <h1 style={styles.mainTitle}>Earn Real Aave Yield on Base</h1>
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
          {/* Cards */}
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

          {/* Deposit / Withdraw */}
          <input
            type="number"
            placeholder="Amount USDC"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
    background: "#ff7a00",
    color: "white",
    position: "relative"
  },
  topBar: {
    width: "90%",
    margin: "10px auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logoImg: {
    width: 42,
    height: 42,
    borderRadius: "50%"
  },
  logoText: {
    fontSize: 20,
    fontWeight: 800
  },
  profile: {
    padding: "6px 12px",
    borderRadius: 12,
    background: "rgba(0,0,0,0.3)"
  },
  centerBox: {
    marginTop: 100,
    textAlign: "center"
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 800,
    marginBottom: 20
  },
  connectBtn: (loading) => ({
    padding: "12px 26px",
    borderRadius: 14,
    border: "none",
    background: "#000",
    color: "white",
    fontSize: 18,
    opacity: loading ? 0.6 : 1
  }),
  dashboard: {
    marginTop: 70,
    textAlign: "center"
  },
  card: {
    background: "rgba(0,0,0,0.5)",
    padding: 18,
    borderRadius: 14,
    margin: "12px auto",
    width: "85%",
    border: "1px solid rgba(255,255,255,0.3)"
  },
  input: {
    padding: 12,
    width: "85%",
    margin: "20px auto",
    borderRadius: 12,
    border: "none"
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
    fontWeight: 700
  },
  withdrawBtn: {
    padding: "12px 20px",
    background: "#ff0033",
    borderRadius: 12,
    border: "none",
    fontWeight: 700
  }
};