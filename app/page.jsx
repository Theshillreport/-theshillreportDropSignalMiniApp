"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

const AAVE_POOL =
  "0x76b026bEad8aA2D733E4cd602d7A44dE24a97c73";
const USDC =
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bDA02913";

const AAVE_ABI = [
  "function supply(address asset,uint256 amount,address onBehalfOf,uint16 referralCode) external",
  "function withdraw(address asset,uint256 amount,address to) external returns (uint256)"
];

const ERC20_ABI = [
  "function approve(address spender,uint256 amount) external returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export default function Page() {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [usdcBalance, setUsdcBalance] = useState("0");
  const [apy] = useState(6.31);

  const [earnings, setEarnings] = useState(0);
  const [deposited, setDeposited] = useState(0);

  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("deposit");

  // ---------------- WALLET ----------------
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

      const prov = new ethers.BrowserProvider(wc);
      setProvider(prov);

      const signer = await prov.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);

      loadUSDCBalance(prov, addr);
    } catch {
      alert("Wallet Verbindung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  const loadUSDCBalance = async (prov, addr) => {
    try {
      const signer = await prov.getSigner();
      const usdc = new ethers.Contract(USDC, ERC20_ABI, signer);
      const bal = await usdc.balanceOf(addr);
      setUsdcBalance(Number(bal) / 1e6);
    } catch {}
  };

  // ---------------- DEPOSIT ----------------
  const deposit = async () => {
    try {
      if (!provider) return alert("Connect Wallet");

      const signer = await provider.getSigner();
      const amount = ethers.parseUnits(depositAmount, 6);

      const usdc = new ethers.Contract(USDC, ERC20_ABI, signer);
      await usdc.approve(AAVE_POOL, amount);

      const pool = new ethers.Contract(AAVE_POOL, AAVE_ABI, signer);
      await pool.supply(USDC, amount, address, 0);

      setDeposited(v => v + Number(depositAmount));
      alert("Deposit erfolgreich!");
      loadUSDCBalance(provider, address);
    } catch {
      alert("Deposit Fehler");
    }
  };

  // ---------------- WITHDRAW ----------------
  const withdraw = async () => {
    try {
      if (!provider) return alert("Connect Wallet");

      const signer = await provider.getSigner();
      const amount = ethers.parseUnits(withdrawAmount, 6);

      const pool = new ethers.Contract(AAVE_POOL, AAVE_ABI, signer);
      await pool.withdraw(USDC, amount, address);

      alert("Withdraw erfolgreich!");
      loadUSDCBalance(provider, address);
    } catch {
      alert("Withdraw Fehler");
    }
  };

  // ---------------- LIVE EARNINGS ----------------
  useEffect(() => {
    if (!deposited) return;

    const yearly = apy / 100;
    const perSecond = yearly / (365 * 24 * 60 * 60);

    const interval = setInterval(() => {
      setEarnings(e => e + deposited * perSecond);
    }, 1000);

    return () => clearInterval(interval);
  }, [deposited, apy]);

  // ---------------- CONNECT SCREEN (ALTES DESIGN) ----------------
  if (!address) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.grid}></div>

        <div style={styles.logoBig}></div>

        <h1>DropSignal</h1>
        <p style={{ opacity: 0.7 }}>USDC Yield auf Base</p>

        <button onClick={connectWallet} style={styles.connectBtn}>
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      </div>
    );
  }

  // ---------------- AFTER CONNECT ----------------
  return (
    <div style={styles.app}>
      <div style={styles.top}>
        <div style={styles.logo}></div>
        <span style={{ opacity: 0.8 }}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      </div>

      <div style={styles.panel}>
        <p style={{ opacity: 0.7 }}>DEPOSIT USDC TO EARN</p>

        <div style={styles.apyBox}>
          <span style={{ fontSize: 28, color: "#00ff94" }}>
            {apy}% APY
          </span>
        </div>

        <div style={styles.boostRow}>
          <div style={styles.boostCard}>WELCOME BOOST +0.00%</div>
          <div style={styles.boostCard}>REFERRAL BOOST +0.00%</div>
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          style={tab === "deposit" ? styles.tabActive : styles.tab}
          onClick={() => setTab("deposit")}
        >
          Deposit
        </button>
        <button
          style={tab === "withdraw" ? styles.tabActive : styles.tab}
          onClick={() => setTab("withdraw")}
        >
          Withdraw
        </button>
      </div>

      {tab === "deposit" ? (
        <>
          <p style={{ opacity: 0.6 }}>
            Available: {usdcBalance} USDC
          </p>

          <input
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="0.00"
            style={styles.input}
          />

          <button onClick={deposit} style={styles.depositBtn}>
            Deposit
          </button>
        </>
      ) : (
        <>
          <input
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="0.00"
            style={styles.input}
          />

          <button onClick={withdraw} style={styles.withdrawBtn}>
            Withdraw
          </button>
        </>
      )}
    </div>
  );
}

// ---------------- STYLES ----------------
const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui",
    position: "relative",
    overflow: "hidden"
  },

  grid: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at center, rgba(255,122,0,.25), transparent 60%), repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 2px, transparent 2px 20px), repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 2px, transparent 2px 20px)",
    filter: "blur(0.7px)",
    zIndex: 0
  },

  logoBig: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    background: "white",
    marginBottom: 15,
    zIndex: 2
  },

  connectBtn: {
    background: "black",
    padding: "14px 20px",
    borderRadius: 16,
    color: "white",
    border: "none",
    fontSize: 18,
    marginTop: 20,
    zIndex: 2
  },

  app: {
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    padding: 18,
    fontFamily: "system-ui"
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15
  },

  logo: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "linear-gradient(145deg,#ff7b00,#ffa640)"
  },

  panel: {
    background: "#050b1e",
    borderRadius: 22,
    padding: 18
  },

  apyBox: {
    marginTop: 8,
    marginBottom: 18
  },

  boostRow: {
    display: "flex",
    gap: 8
  },

  boostCard: {
    flex: 1,
    background: "#0a122b",
    borderRadius: 12,
    padding: 10,
    fontSize: 12,
    opacity: 0.8,
    textAlign: "center"
  },

  tabs: {
    display: "flex",
    gap: 10,
    marginTop: 15
  },

  tab: {
    flex: 1,
    background: "#0a0a0a",
    borderRadius: 20,
    padding: 10,
    color: "white",
    border: "none"
  },

  tabActive: {
    flex: 1,
    background: "white",
    color: "black",
    borderRadius: 20,
    padding: 10,
    border: "none"
  },

  input: {
    width: "100%",
    padding: 14,
    marginTop: 15,
    borderRadius: 14,
    border: "none",
    background: "#0a0a0a",
    color: "white",
    fontSize: 18
  },

  depositBtn: {
    width: "100%",
    background: "green",
    marginTop: 15,
    padding: 14,
    borderRadius: 14,
    border: "none",
    color: "white",
    fontSize: 18
  },

  withdrawBtn: {
    width: "100%",
    background: "red",
    marginTop: 15,
    padding: 14,
    borderRadius: 14,
    border: "none",
    color: "white",
    fontSize: 18
  }
};