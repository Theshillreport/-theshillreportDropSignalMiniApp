// SAME FILE AS BEFORE — ONLY DESIGN / PERFORMANCE IMPROVED
// Everything is optimized for mobile smoothness 💨

"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

const AAVE_POOL = "0x76b026bEad8aA2D733E4cd602d7A44dE24a97c73";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bDA02913";

const AAVE_ABI = [
  "function supply(address asset,uint256 amount,address onBehalfOf,uint16 referralCode) external",
  "function withdraw(address asset,uint256 amount,address to) external returns (uint256)"
];

const ERC20_ABI = [
  "function approve(address spender,uint256 amount) external returns (bool)",
  "function balanceOf(address owner) view returns (uint256)"
];

export default function Page() {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [usdcBalance, setUsdcBalance] = useState("0");

  const [baseApy] = useState(4.3);
  const [boostActive, setBoostActive] = useState(false);
  const [boostApy, setBoostApy] = useState(0);
  const [boostTime, setBoostTime] = useState(0);

  const [earnings, setEarnings] = useState(0);
  const [animatedEarnings, setAnimatedEarnings] = useState(0);
  const [depositedTotal, setDepositedTotal] = useState(0);
  const [loading, setLoading] = useState(false);

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
        showQrModal: true,
      });

      await wc.connect();
      const prov = new ethers.BrowserProvider(wc);
      setProvider(prov);

      const signer = await prov.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);
      loadUSDCBalance(prov, addr);
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

  const deposit = async () => {
    if (!provider) return alert("Connect Wallet");
    try {
      const signer = await provider.getSigner();
      const amount = ethers.parseUnits(depositAmount, 6);

      const usdc = new ethers.Contract(USDC, ERC20_ABI, signer);
      await usdc.approve(AAVE_POOL, amount);

      const pool = new ethers.Contract(AAVE_POOL, AAVE_ABI, signer);
      await pool.supply(USDC, amount, address, 0);
      setDepositedTotal(v => v + Number(depositAmount));

      alert("Deposit erfolgreich!");
      loadUSDCBalance(provider, address);
    } catch {
      alert("Deposit Fehler");
    }
  };

  const withdraw = async () => {
    if (!provider) return alert("Connect Wallet");
    try {
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

  const activateBoost = () => {
    if (boostActive) return;
    setBoostActive(true);
    setBoostApy(2);
    setBoostTime(3600);
  };

  useEffect(() => {
    if (!boostActive || boostTime <= 0) {
      setBoostActive(false);
      setBoostApy(0);
      return;
    }
    const t = setTimeout(() => setBoostTime(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [boostActive, boostTime]);

  const totalApy = baseApy + boostApy;

  // Earnings update — throttled for battery life
  useEffect(() => {
    if (!depositedTotal) return;
    const yearly = totalApy / 100;
    const perSecond = yearly / (365 * 24 * 60 * 60);

    const interval = setInterval(() => {
      setEarnings(e => e + depositedTotal * perSecond);
    }, 1500); // battery friendly
    return () => clearInterval(interval);
  }, [depositedTotal, totalApy]);

  // Smooth animation but lighter than before
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedEarnings(e => e + (earnings - e) * 0.25);
    }, 120);
    return () => clearInterval(interval);
  }, [earnings]);

  if (!address) {
    return (
      <div style={styles.wrapper}>
        <img
          src="/IMG_2690.jpeg"
          style={styles.logo}
        />
        <h1>DropSignal</h1>
        <p>USDC Yield auf Base</p>
        <button onClick={connectWallet} style={styles.connectBtn}>
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <div style={styles.topBar}>
        <div style={styles.logoSmall}>
          <img src="/IMG_2690.jpeg" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
        </div>
        <h2>DropSignal</h2>
      </div>

      <p style={{ opacity: .7 }}>
        {address.slice(0, 6)}...{address.slice(-4)}
      </p>

      <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
        <Card title="Base APY" value={`${baseApy}%`} />
        <Card title="Boost APY" value={boostActive ? `+${boostApy}%` : "0%"} />
        <Card title="Total APY" value={`${totalApy.toFixed(2)}%`} />

        <Card title="Balance" value={`${usdcBalance} USDC`} />

        <div style={styles.greenCard}>
          <h3>Live Earnings</h3>
          <p style={styles.glowText}>+{animatedEarnings.toFixed(6)} USDC</p>
        </div>
      </div>

      {!boostActive && (
        <button onClick={activateBoost} style={styles.boostBtn}>
          🚀 Activate Boost +2%
        </button>
      )}

      <InputBlock value={depositAmount} onChange={setDepositAmount} action={deposit} text="Deposit" />
      <InputBlock value={withdrawAmount} onChange={setWithdrawAmount} action={withdraw} text="Withdraw" />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p style={{ fontSize: 24 }}>{value}</p>
    </div>
  );
}

function InputBlock({ value, onChange, action, text }) {
  return (
    <div style={{ marginTop: 18 }}>
      <input value={value} onChange={e => onChange(e.target.value)} style={styles.input} />
      <button onClick={action} style={styles.actionBtn}>{text}</button>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },

  app: {
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    padding: 16
  },

  logo: {
    width: 115,
    height: 115,
    borderRadius: "50%",
    objectFit: "cover",
    boxShadow: "0 0 25px rgba(255,122,0,.6)"
  },

  topBar: { display: "flex", alignItems: "center", gap: 8 },
  logoSmall: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    overflow: "hidden",
    boxShadow: "0 0 15px rgba(255,122,0,.7)"
  },

  card: {
    background: "#0b1436",
    padding: 16,
    borderRadius: 14,
    boxShadow: "0 0 12px rgba(0,255,166,.25)"
  },

  greenCard: {
    background: "#003c29",
    padding: 16,
    borderRadius: 16
  },

  glowText: {
    fontSize: 26,
    color: "#00ffa6",
    textShadow: "0 0 8px #00ffa6"
  },

  connectBtn: {
    marginTop: 18,
    padding: 14,
    borderRadius: 12,
    border: "none",
    color: "white",
    background: "#000"
  },

  boostBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    background: "#ff7b00",
    border: "none",
    marginTop: 16
  },

  input: {
    width: "100%",
    padding: 10,
    borderRadius: 12,
    border: "none"
  },

  actionBtn: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    border: "none",
    background: "#1f2937",
    color: "white"
  }
};