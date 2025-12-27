"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

const AAVE_POOL = "0x76b026bEad8aA2D733E4cd602d7A44dE24a97c73";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bDA02913";
const aUSDC = "0xfFc9Ad9B9A736544f062247Eb0D8a4F506805b69";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export default function Page() {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);

  const [usdcBalance, setUsdcBalance] = useState(0);
  const [aUsdcBalance, setAUsdcBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [apy, setApy] = useState(0);

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
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

      loadBalances(prov, addr);
      loadAaveAPY(prov);
    } catch (err) {
      console.log(err);
      alert("Connect Wallet failed");
    } finally {
      setLoading(false);
    }
  };

  const loadBalances = async (prov, addr) => {
    try {
      const signer = await prov.getSigner();

      const usdc = new ethers.Contract(USDC, ERC20_ABI, signer);
      const decUsdc = await usdc.decimals();
      const balUsdc = await usdc.balanceOf(addr);
      setUsdcBalance(Number(ethers.formatUnits(balUsdc, decUsdc)));

      const ausdc = new ethers.Contract(aUSDC, ERC20_ABI, signer);
      const decAUsdc = await ausdc.decimals();
      const balAUsdc = await ausdc.balanceOf(addr);
      setAUsdcBalance(Number(ethers.formatUnits(balAUsdc, decAUsdc)));

      setEarnings(Number(ethers.formatUnits(balAUsdc, decAUsdc)) - Number(ethers.formatUnits(balUsdc, decUsdc)));
    } catch (err) {
      console.log(err);
    }
  };

  const loadAaveAPY = async (prov) => {
    try {
      const pool = new ethers.Contract(AAVE_POOL, [
        "function getReserveData(address asset) view returns (uint256 configuration,uint128 liquidityIndex,uint128 currentLiquidityRate,uint128 variableBorrowIndex,uint128 currentVariableBorrowRate,uint128 stableBorrowRate,uint40 lastUpdateTimestamp,address aTokenAddress,uint8 id)"
      ], prov);
      const data = await pool.getReserveData(USDC);
      const rate = Number(data.currentLiquidityRate) / 1e27;
      setApy((rate * 100).toFixed(2));
    } catch (err) {
      console.log(err);
    }
  };

  const deposit = async () => {
    try {
      if (!provider) return alert("Connect Wallet first");
      const signer = await provider.getSigner();

      const amountParsed = ethers.parseUnits(depositAmount, 6);
      const usdc = new ethers.Contract(USDC, ["function approve(address spender,uint256 value) external returns (bool)"], signer);
      await usdc.approve(AAVE_POOL, amountParsed);

      const pool = new ethers.Contract(AAVE_POOL, ["function supply(address,address,uint256,address,uint16) external"], signer);
      await pool.supply(USDC, amountParsed, address, 0);

      alert("Deposit Successful!");
      loadBalances(provider, address);
    } catch (err) {
      console.log(err);
      alert("Deposit failed");
    }
  };

  const withdraw = async () => {
    try {
      if (!provider) return alert("Connect Wallet first");
      const signer = await provider.getSigner();

      const amountParsed = ethers.parseUnits(withdrawAmount, 6);
      const pool = new ethers.Contract(AAVE_POOL, ["function withdraw(address,uint256,address) external returns(uint256)"], signer);
      await pool.withdraw(USDC, amountParsed, address);

      alert("Withdraw Successful!");
      loadBalances(provider, address);
    } catch (err) {
      console.log(err);
      alert("Withdraw failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050b1e", color: "white", padding: 20 }}>
      {!address ? (
        <button onClick={connectWallet} style={{ background: "#ff7b00", padding: 12, borderRadius: 8 }}>
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <>
          <p>Connected: {address.slice(0,6)}...{address.slice(-4)}</p>

          <div>
            <h3>Your USDC Balance</h3>
            <p>{usdcBalance} USDC</p>
          </div>

          <div>
            <h3>Your aUSDC Balance</h3>
            <p>{aUsdcBalance} aUSDC</p>
          </div>

          <div>
            <h3>Live Earnings</h3>
            <p>{earnings.toFixed(6)} USDC</p>
          </div>

          <div>
            <h3>Current APY</h3>
            <p>{apy}%</p>
          </div>

          <input placeholder="Deposit Amount" value={depositAmount} onChange={e=>setDepositAmount(e.target.value)} />

          <button onClick={deposit}>Deposit</button>

          <input placeholder="Withdraw Amount" value={withdrawAmount} onChange={e=>setWithdrawAmount(e.target.value)} />

          <button onClick={withdraw}>Withdraw</button>
        </>
      )}
    </div>
  );
}