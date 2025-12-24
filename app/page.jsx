"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from "next/image";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [balance, setBalance] = useState(0);
  const [apy, setApy] = useState(0);
  const [activeTab, setActiveTab] = useState("deposit");
  const [amount, setAmount] = useState("");

  const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  const AAVE_POOL = "0x6Ae63C4E349A8675D8aC49f37b51f72dF6bD29c1";

  const USDC_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function approve(address spender, uint256 value)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ];

  const AAVE_ABI = [
    "function supply(address asset,uint256 amount,address onBehalfOf,uint16 referralCode)",
    "function withdraw(address asset,uint256 amount,address to)",
    "function getReserveData(address asset) view returns (uint256 configuration, uint128 liquidityIndex,uint128 currentLiquidityRate,uint128 variableBorrowRate,uint128 stableBorrowRate,uint40 lastUpdateTimestamp)"
  ];

  // CONNECT WALLET
  const connectWallet = async () => {
    const eth = window.ethereum;
    if (!eth) return alert("Install Wallet!");

    await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x2105" }] });

    const prov = new ethers.BrowserProvider(eth);
    const signer = await prov.getSigner();
    const addr = await signer.getAddress();

    setProvider(prov);
    setAddress(addr);
  };

  // LOAD LIVE APY
  const loadAaveData = async () => {
    if (!provider) return;

    const pool = new ethers.Contract(AAVE_POOL, AAVE_ABI, provider);
    const data = await pool.getReserveData(USDC);

    const liquidityRate = Number(data.currentLiquidityRate) / 1e27;
    const yearly = liquidityRate * 100;

    setApy(yearly.toFixed(2));
  };

  // LOAD USER BALANCE
  const loadBalance = async () => {
    if (!provider || !address) return;

    const token = new ethers.Contract(USDC, USDC_ABI, provider);
    const bal = await token.balanceOf(address);

    setBalance(Number(ethers.formatUnits(bal, 6)).toFixed(2));
  };

  useEffect(() => {
    if (address) {
      loadBalance();
      loadAaveData();
    }
  }, [address]);

  // DEPOSIT
  const deposit = async () => {
    if (!provider) return;

    const signer = await provider.getSigner();
    const token = new ethers.Contract(USDC, USDC_ABI, signer);
    const pool = new ethers.Contract(AAVE_POOL, AAVE_ABI, signer);

    const value = ethers.parseUnits(amount, 6);

    await token.approve(AAVE_POOL, value);
    await pool.supply(USDC, value, address, 0);

    alert("Deposit Successful!");
    loadBalance();
  };

  // WITHDRAW
  const withdraw = async () => {
    if (!provider) return;

    const signer = await provider.getSigner();
    const pool = new ethers.Contract(AAVE_POOL, AAVE_ABI, signer);

    await pool.withdraw(USDC, ethers.MaxUint256, address);

    alert("Withdraw Successful!");
    loadBalance();
  };

  return (
    <main style={styles.page}>
      {!address ? (
        <button style={styles.connect} onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <>
          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.logo}>
              <Image src="/logo.png" alt="DropSignal" width={40} height={40} style={{ borderRadius: 50 }} />
              <span style={{ marginLeft: 10 }}>DropSignal</span>
            </div>

            <div style={styles.profile}>
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          </div>

          {/* CARD */}
          <div style={styles.card}>
            <p style={styles.title}>DEPOSIT USDC TO EARN YIELD</p>

            <h1>${balance}</h1>

            <p>APY: {apy ? `${apy}%` : ".."}</p>

            {/* TABS */}
            <div style={styles.tabs}>
              <button
                style={activeTab === "deposit" ? styles.tabActive : styles.tab}
                onClick={() => setActiveTab("deposit")}
              >
                Deposit
              </button>

              <button
                style={activeTab === "withdraw" ? styles.tabActive : styles.tab}
                onClick={() => setActiveTab("withdraw")}
              >
                Withdraw
              </button>
            </div>

            {/* INPUT */}
            {activeTab === "deposit" ? (
              <>
                <input
                  style={styles.input}
                  placeholder="Amount USDC"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button style={styles.green} onClick={deposit}>
                  Deposit
                </button>
              </>
            ) : (
              <button style={styles.white} onClick={withdraw}>
                Withdraw All
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
}

// STYLES
const styles = {
  page: { minHeight: "100vh", background: "black", color: "white", padding: 20 },
  connect: { marginTop: 200, padding: 20, borderRadius: 12, fontSize: 18 },

  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { display: "flex", alignItems: "center", fontSize: 18, fontWeight: 700 },
  profile: { padding: 10, borderRadius: 12, border: "1px solid white" },

  card: {
    marginTop: 30,
    padding: 25,
    borderRadius: 20,
    background: "rgba(0,0,0,.6)",
    border: "1px solid rgba(255,255,255,0.2)",
    textAlign: "center"
  },

  title: { opacity: 0.7 },

  tabs: { display: "flex", marginTop: 20 },
  tab: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    background: "transparent",
    border: "1px solid white",
    color: "white"
  },
  tabActive: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    background: "white",
    border: "1px solid white",
    color: "black"
  },

  input: {
    marginTop: 20,
    padding: 12,
    width: "100%",
    borderRadius: 12,
    border: "1px solid white",
    background: "transparent",
    color: "white"
  },

  green: {
    marginTop: 15,
    padding: 12,
    borderRadius: 12,
    background: "#00ffae",
    border: "none"
  },

  white: {
    marginTop: 15,
    padding: 12,
    borderRadius: 12,
    border: "1px solid white",
    background: "transparent",
    color: "white"
  }
};