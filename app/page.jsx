"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import BackgroundMatrix from "./components/BackgroundMatrix";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);

  const [deposit, setDeposit] = useState("0.00");
  const [earnings, setEarnings] = useState("0.00");
  const [apy, setApy] = useState("0");

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");

  const CONTRACT_ADDRESS = "PASTE_DEINEN_CONTRACT_HIER";
  const USDC_ADDRESS = "PASTE_USDC_TOKEN_HIER";

  const ABI = [
    "function deposit(uint256 amount) external",
    "function withdraw() external",
    "function getUserDeposit(address user) public view returns(uint256)",
    "function getEarnings(address user) public view returns(uint256)",
    "function getAPY() public view returns(uint256)"
  ];

  const connectWallet = async () => {
    try {
      setLoading(true);

      if (typeof window === "undefined") return;

      const { EthereumProvider } = await import(
        "@walletconnect/ethereum-provider"
      );

      const wcProvider = await EthereumProvider.init({
        projectId: "6a6f915ce160625cbc11e74f7bc284e0",
        chains: [1],
        showQrModal: true
      });

      await wcProvider.connect();

      const ethersProvider = new ethers.BrowserProvider(wcProvider);
      const signer = await ethersProvider.getSigner();
      const addr = await signer.getAddress();

      setAddress(addr);
      setProvider(signer);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    if (!provider || !address) return;

    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    const dep = await contract.getUserDeposit(address);
    const earn = await contract.getEarnings(address);
    const apyData = await contract.getAPY();

    setDeposit(Number(ethers.formatUnits(dep, 6)).toFixed(2));
    setEarnings(Number(ethers.formatUnits(earn, 6)).toFixed(6));
    setApy(apyData.toString());
  };

  useEffect(() => {
    if (address) loadData();
  }, [address]);

  const depositUSDC = async () => {
    if (!amount || !provider) return;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    const usdc = new ethers.Contract(
      USDC_ADDRESS,
      ["function approve(address spender,uint256 amount) public returns(bool)"],
      provider
    );

    const value = ethers.parseUnits(amount, 6);

    await usdc.approve(CONTRACT_ADDRESS, value);
    await contract.deposit(value);

    loadData();
  };

  const withdrawAll = async () => {
    if (!provider) return;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    await contract.withdraw();
    loadData();
  };

  return (
    <main style={styles.page}>
      <BackgroundMatrix />

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <img src="/logo.png" style={styles.logo} />
        {address && (
          <div style={styles.profile}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        )}
      </div>

      {/* CENTER */}
      <div style={styles.container}>
        {!address ? (
          <>
            <h1 style={styles.title}>Deposit • Earn • Signal</h1>
            <button
              onClick={connectWallet}
              disabled={loading}
              style={styles.connect}
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
          </>
        ) : (
          <>
            <h1 style={styles.dashboard}>Dashboard</h1>

            <div style={styles.card}>
              <p>Total Deposited</p>
              <h2>{deposit} USDC</h2>
            </div>

            <div style={styles.card}>
              <p>Live Earnings</p>
              <h2>
                {deposit > 0 ? `+${earnings} USDC` : "0.00 USDC"}
              </h2>
            </div>

            <div style={styles.card}>
              <p>APY</p>
              <h2>{apy}%</h2>
            </div>

            <input
              placeholder="Amount USDC"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
            />

            <div style={styles.btnRow}>
              <button style={styles.depositBtn} onClick={depositUSDC}>
                Deposit
              </button>
              <button style={styles.withdrawBtn} onClick={withdrawAll}>
                Withdraw
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    background: "#000",
    minHeight: "100vh",
    color: "white",
    position: "relative"
  },
  topBar: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    display: "flex",
    justifyContent: "space-between",
    zIndex: 10
  },
  logo: {
    width: 110
  },
  profile: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid white"
  },
  container: {
    zIndex: 5,
    position: "relative",
    marginTop: 120,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 18
  },
  title: { fontSize: 28 },
  dashboard: { fontSize: 36 },
  card: {
    background: "rgba(0,0,0,.7)",
    padding: 20,
    borderRadius: 18,
    width: "90%",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.4)"
  },
  input: {
    padding: 12,
    width: "80%",
    borderRadius: 12,
    border: "none",
    textAlign: "center",
    fontSize: 16
  },
  btnRow: {
    display: "flex",
    gap: 16
  },
  depositBtn: {
    padding: "14px 20px",
    borderRadius: 14,
    border: "none",
    background: "#00ffb3",
    fontSize: 16
  },
  withdrawBtn: {
    padding: "14px 20px",
    borderRadius: 14,
    border: "1px solid white",
    background: "transparent",
    fontSize: 16,
    color: "white"
  },
  connect: {
    padding: "16px 26px",
    borderRadius: 14,
    border: "none",
    background:
      "linear-gradient(135deg, #6a5cff, #00d4ff)",
    color: "white",
    fontSize: 18
  }
};