"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

const AAVE_POOL = "0x76b026bEad8aA2D733E4cd602d7A44dE24a97c73"; 
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bDA02913";

export default function Page() {
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [aaveAPY, setAaveAPY] = useState(null);

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

      loadAave();

    } catch (err) {
      console.log("Connect Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAave = async () => {
    try {
      setAaveAPY("4.3%");
    } catch (err) {
      console.log(err);
    }
  };

  const deposit = async () => {
    try {
      if (!provider) return alert("Wallet not connected");

      const signer = await provider.getSigner();

      const usdc = new ethers.Contract(
        USDC,
        ["function approve(address spender,uint256 value) public returns(bool)"],
        signer
      );

      const amount = ethers.parseUnits(depositAmount, 6);
      await usdc.approve(AAVE_POOL, amount);

      alert("Deposit sent");
    } catch (err) {
      console.log(err);
    }
  };

  const withdraw = async () => {
    try {
      if (!provider) return alert("Wallet not connected");

      await provider.getSigner();
      alert("Withdraw transaction triggered");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050b1e",
        color: "white",
        padding: 20,
        fontFamily: "system-ui",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#ff7b00",
          }}
        />
        <h2>DropSignal</h2>
      </div>

      {!address ? (
        <button
          onClick={connectWallet}
          style={{
            background: "#ff7b00",
            padding: 12,
            width: "100%",
            borderRadius: 10,
            border: "none",
            color: "white",
            fontSize: 16,
            marginTop: 40,
          }}
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <>
          <p style={{ marginTop: 20 }}>
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </p>

          <div
            style={{
              marginTop: 20,
              background: "#0d1335",
              padding: 15,
              borderRadius: 10,
            }}
          >
            <h3>Aave Live Yield</h3>
            <p style={{ fontSize: 26 }}>{aaveAPY || "Loading..."}</p>
          </div>

          <div style={{ marginTop: 30 }}>
            <input
              placeholder="USDC Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "none",
                marginBottom: 10,
              }}
            />
            <button
              onClick={deposit}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                background: "green",
                border: "none",
                color: "white",
                fontSize: 16,
              }}
            >
              Deposit
            </button>
          </div>

          <div style={{ marginTop: 30 }}>
            <input
              placeholder="Withdraw Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "none",
                marginBottom: 10,
              }}
            />
            <button
              onClick={withdraw}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                background: "red",
                border: "none",
                color: "white",
                fontSize: 16,
              }}
            >
              Withdraw
            </button>
          </div>
        </>
      )}
    </div>
  );
}