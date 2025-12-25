"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import BackgroundMatrix from "./components/BackgroundMatrix";

// ===== AAVE + USDC ON BASE =====
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const AAVE_POOL = "0x6Ae63C4E349A8675D8aC49f37b51f72dF6bD29c1";

const ERC20_ABI = [
  "function approve(address spender,uint256 value) external returns(bool)",
  "function allowance(address owner,address spender) view returns(uint256)",
  "function balanceOf(address owner) view returns(uint256)",
  "function decimals() view returns(uint8)"
];

const AAVE_ABI = [
  "function supply(address asset,uint256 amount,address onBehalfOf,uint16 referralCode)",
  "function withdraw(address asset,uint256 amount,address to)",
  "function getReserveData(address asset) view returns((uint256 configuration,uint128 liquidityIndex,uint128 currentLiquidityRate,uint128 variableBorrowIndex,uint128 currentVariableBorrowRate,uint128 currentStableBorrowRate,uint40 lastUpdateTimestamp,address aTokenAddress,uint8 id))"
];

export default function Home() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  // UI States
  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [apy, setApy] = useState(0);
  const [amount, setAmount] = useState("");

  // 🔥 LIVE EARNINGS
  useEffect(() => {
    if (!address || balance === 0 || apy === 0) return;

    const rate = (apy / 100) / 365 / 24 / 3600; 
    const interval = setInterval(() => {
      setEarnings(e => e + balance * rate);
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

      const { EthereumProvider } = await import("@walletconnect/ethereum-provider");

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
      loadAaveData(provider, addr);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAaveData = async (provider, addr) => {
    const pool = new ethers.Contract(AAVE_POOL, AAVE_ABI, provider);
    const data = await pool.getReserveData(USDC);

    // APY from liquidity rate
    const liquidityRate = Number(data.currentLiquidityRate) / 1e27;
    setApy((liquidityRate * 100).toFixed(2));
  };

  const deposit = async () => {
    try {
      if (!amount) return alert("Enter amount");

      const provider = new ethers.BrowserProvider(window.ethereum || window.web3);
      const signer = await provider.getSigner();

      const token = new ethers.Contract(USDC, ERC20_ABI, signer);
      const pool = new ethers.Contract(AAVE_POOL, AAVE_ABI, signer);

      const decimals = await token.decimals();
      const value = ethers.parseUnits(amount, decimals);

      await token.approve(AAVE_POOL, value);
      await pool.supply(USDC, value, address, 0);

      setBalance(prev => prev + Number(amount));
      alert("Deposit Successful!");
    } catch (e) {
      console.log(e);
      alert("Deposit failed");
    }
  };

  const withdraw = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum || window.web3);
      const signer = await provider.getSigner();

      const pool = new ethers.Contract(AAVE_POOL, AAVE_ABI, signer);

      await pool.withdraw(USDC, ethers.MaxUint256, address);
      setBalance(0);
      setEarnings(0);
      alert("Withdraw Successful!");
    } catch (e) {
      console.log(e);
      alert("Withdraw failed");
    }
  };

  return (
    <main style={styles.page}>
      <BackgroundMatrix />

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logoWrap}>
          <img src="/logo.png" style={styles.logoImg} />
          <span style={styles.logoText}>DropSignal</span>
        </div>

        {address && (
          <div style={styles.profile}>
            {address.slice(0,6)}...{address.slice(-4)}
          </div>
        )}
      </div>

      {!address ? (
        <div style={styles.center}>
          <h1 style={styles.big}>Earn Real Yield on Base</h1>

          <button onClick={connectWallet} disabled={loading} style={styles.connectBtn}>
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      ) : (
        <div style={styles.dashboard}>
          <div style={styles.card}>
            <p>Deposited</p>
            <h2>{balance.toFixed(2)} USDC</h2>
          </div>

          <div style={styles.card}>
            <p>Live Earnings</p>
            <h2>+{earnings.toFixed(6)} USDC</h2>
          </div>

          <div style={styles.card}>
            <p>APY</p>
            <h2>{apy}%</h2>
          </div>

          <input
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
            placeholder="Amount USDC"
            style={styles.input}
          />

          <div style={styles.row}>
            <button style={styles.deposit} onClick={deposit}>Deposit</button>
            <button style={styles.withdraw} onClick={withdraw}>Withdraw</button>
          </div>
        </div>
      )}
    </main>
  );
}

const styles = {
  page:{
    minHeight:"100vh",
    position:"relative",
    background:"#ff7a00",
    color:"white"
  },
  header:{
    position:"fixed",
    top:10,
    left:10,
    right:10,
    zIndex:10,
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center"
  },
  logoWrap:{display:"flex",alignItems:"center",gap:8},
  logoImg:{width:42,height:42,borderRadius:"50%"},
  logoText:{fontSize:18,fontWeight:900},
  profile:{
    background:"rgba(0,0,0,0.5)",
    padding:"8px 12px",
    borderRadius:12,
    border:"1px solid white"
  },
  center:{
    zIndex:5,
    minHeight:"100vh",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center"
  },
  big:{fontSize:30,fontWeight:900,marginBottom:20},
  connectBtn:{
    padding:"14px 28px",
    borderRadius:14,
    background:"black",
    color:"white",
    border:"none",
    fontSize:18
  },
  dashboard:{
    paddingTop:120,
    textAlign:"center"
  },
  card:{
    margin:"12px auto",
    width:"85%",
    background:"rgba(0,0,0,0.4)",
    padding:18,
    borderRadius:16,
    border:"1px solid white"
  },
  input:{
    width:"80%",
    padding:12,
    borderRadius:12,
    border:"none",
    marginTop:15
  },
  row:{
    display:"flex",
    justifyContent:"center",
    gap:10,
    marginTop:18
  },
  deposit:{
    background:"lime",
    padding:"12px 20px",
    borderRadius:12,
    border:"none",
    color:"black",
    fontWeight:900
  },
  withdraw:{
    background:"red",
    padding:"12px 20px",
    borderRadius:12,
    border:"none",
    color:"white",
    fontWeight:900
  }
};