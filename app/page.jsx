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
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
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

  const deposit = async () => {
    try {
      if (!provider) return alert("Connect Wallet");
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

  const activateBoost = () => {
    if (boostActive) return alert("Boost läuft bereits!");
    setBoostActive(true);
    setBoostApy(2.0);
    setBoostTime(3600);
    alert("BOOST aktiviert! 🔥 +2% APY für 60 Minuten");
  };

  useEffect(() => {
    if (!boostActive) return;
    if (boostTime <= 0) {
      setBoostActive(false);
      setBoostApy(0);
      return;
    }

    const timer = setTimeout(() => setBoostTime(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [boostActive, boostTime]);

  const totalApy = baseApy + boostApy;

  useEffect(() => {
    if (!depositedTotal) return;

    const yearlyRate = totalApy / 100;
    const perSecondRate = yearlyRate / (365 * 24 * 60 * 60);

    const interval = setInterval(() => {
      setEarnings(e => e + depositedTotal * perSecondRate);
    }, 1000);

    return () => clearInterval(interval);
  }, [depositedTotal, totalApy]);

  useEffect(() => {
    let frame;
    const animate = () => {
      setAnimatedEarnings(prev => {
        const diff = earnings - prev;
        if (Math.abs(diff) < 0.0000001) return earnings;
        return prev + diff * 0.08;
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [earnings]);

  if (!address) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.animatedGrid}></div>

        <img
          src="/IMG_2690.jpeg"
          style={{
            width: 130,
            height: 130,
            borderRadius: "50%",
            objectFit: "cover",
            zIndex: 2,
            boxShadow: "0 0 25px rgba(255,122,0,0.9), 0 0 60px rgba(255,122,0,0.4)",
            animation: "pulseGlow 2.5s infinite ease-in-out"
          }}
        />

        <h1>DropSignal</h1>
        <p>USDC Yield auf Base</p>

        <button onClick={connectWallet} style={styles.connectBtn}>
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>

        <style>{`
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 25px rgba(255,122,0,1), 0 0 60px rgba(255,122,0,0.45); }
            50% { box-shadow: 0 0 45px rgba(255,122,0,1), 0 0 90px rgba(255,122,0,0.7); }
            100% { box-shadow: 0 0 25px rgba(255,122,0,1), 0 0 60px rgba(255,122,0,0.45); }
          }

          @keyframes backgroundMove {
            0% { transform: translateY(0px); }
            50% { transform: translateY(20px); }
            100% { transform: translateY(0px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <div style={styles.animatedGrid}></div>

      <div style={styles.topBar}>
        <div style={styles.logoGlow}>
          <img
            src="/IMG_2690.jpeg"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
          />
        </div>
        <h2>DropSignal</h2>
      </div>

      <p style={{ opacity: 0.7 }}>
        {address.slice(0, 6)}...{address.slice(-4)}
      </p>

      <div style={{ marginTop: 20, display: "grid", gap: 15 }}>
        <Card title="Base APY" value={`${baseApy}%`} />
        <Card title="Boost APY" value={boostActive ? `+${boostApy}%` : "0%"} color="#ff7b00" />
        <Card title="Total APY" value={`${totalApy.toFixed(2)}%`} color="#00ffa6" />

        <Card title="Balance" value={`${usdcBalance} USDC`} />

        <div style={styles.neonCard}>
          <h3 style={{ color: "#00ffa6" }}>Live Earnings</h3>
          <p style={styles.neonText}>
            +{animatedEarnings.toFixed(6)} USDC
          </p>
        </div>

        {boostActive && (
          <Card
            title="Boost Time Left"
            value={`${Math.floor(boostTime / 60)}:${String(boostTime % 60).padStart(2, "0")}`}
            color="#ff7b00"
          />
        )}
      </div>

      {!boostActive && (
        <button onClick={activateBoost} style={styles.boostBtn}>
          🚀 Activate Boost +2% APY
        </button>
      )}

      <InputBlock
        value={depositAmount}
        onChange={setDepositAmount}
        action={deposit}
        placeholder="Deposit USDC"
        btnColor="green"
        text="Deposit"
      />

      <InputBlock
        value={withdrawAmount}
        onChange={setWithdrawAmount}
        action={withdraw}
        placeholder="Withdraw USDC"
        btnColor="red"
        text="Withdraw"
      />
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div style={styles.cardGlow}>
      <h3>{title}</h3>
      <p style={{ fontSize: 26, color: color || "white" }}>{value}</p>
    </div>
  );
}

function InputBlock({ value, onChange, action, placeholder, btnColor, text }) {
  return (
    <div style={{ marginTop: 25 }}>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      />
      <button
        onClick={action}
        style={{ ...styles.actionBtn, background: btnColor }}
      >
        {text}
      </button>
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
    justifyContent: "center",
    fontFamily: "system-ui",
    position: "relative",
    overflow: "hidden",
  },

  app: {
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    padding: 20,
    fontFamily: "system-ui",
    position: "relative",
    overflow: "hidden",
  },

  animatedGrid: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at center, rgba(255,122,0,.25), transparent 60%), repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 2px, transparent 2px 20px), repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 2px, transparent 2px 20px)",
    animation: "backgroundMove 12s ease-in-out infinite",
    zIndex: 0,
  },

  topBar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    position: "relative",
    zIndex: 2,
  },

  logoGlow: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    overflow: "hidden",
    boxShadow: "0 0 15px rgba(255,122,0,1), 0 0 40px rgba(255,122,0,0.6)",
    animation: "pulseGlow 2.5s infinite ease-in-out",
  },

  cardGlow: {
    background: "linear-gradient(145deg,#0b1436,#152f6b)",
    padding: 18,
    borderRadius: 16,
    position: "relative",
    boxShadow: "0 0 20px rgba(0,255,166,.25)",
    zIndex: 2,
  },

  neonCard: {
    background: "linear-gradient(145deg,#001b12,#003c29)",
    padding: 18,
    borderRadius: 18,
    boxShadow:
      "0 0 25px rgba(0,255,166,.4), inset 0 0 20px rgba(0,255,166,.2)",
    zIndex: 2,
  },

  neonText: {
    fontSize: 28,
    color: "#00ffa6",
    textShadow:
      "0 0 10px #00ffa6, 0 0 20px #00ffa6, 0 0 40px #00ffa6",
  },

  connectBtn: {
    background: "black",
    padding: "14px 18px",
    borderRadius: 14,
    border: "none",
    color: "white",
    fontSize: 18,
    marginTop: 25,
    zIndex: 2,
  },

  boostBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    background: "#ff7b00",
    color: "white",
    border: "none",
    marginTop: 20,
    fontSize: 18,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "none",
    marginBottom: 10,
  },

  actionBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    color: "white",
  },
};