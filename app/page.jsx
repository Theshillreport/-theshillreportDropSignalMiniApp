"use client";

import { useState } from "react";
import { ethers } from "ethers";

const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDC_DECIMALS = 6;

// Dummy Vault (später Smart Contract)
const VAULT_ADDRESS = "0x000000000000000000000000000000000000dEaD";

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address owner) view returns (uint256)"
];

export default function Home() {
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  // 🔗 CONNECT
  const connectWallet = async () => {
    const { EthereumProvider } = await import("@walletconnect/ethereum-provider");
    const { WalletConnectModal } = await import("@walletconnect/modal");

    const projectId = "DEIN_WALLETCONNECT_PROJECT_ID";

    const wcProvider = await EthereumProvider.init({
      projectId,
      chains: [1],
      showQrModal: false
    });

    const modal = new WalletConnectModal({ projectId, chains: [1] });
    await modal.openModal();
    await wcProvider.connect();

    const ethersProvider = new ethers.BrowserProvider(wcProvider);
    const signer = await ethersProvider.getSigner();

    setProvider(ethersProvider);
    setSigner(signer);
    setAddress(await signer.getAddress());
    modal.closeModal();
  };

  // ✅ APPROVE
  const approveUSDC = async () => {
    try {
      setStatus("Approving USDC...");
      const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
      const value = ethers.parseUnits(amount, USDC_DECIMALS);
      const tx = await usdc.approve(VAULT_ADDRESS, value);
      await tx.wait();
      setStatus("USDC approved");
    } catch (e) {
      setStatus("Approve failed");
    }
  };

  // 📥 DEPOSIT (Demo = transfer)
  const depositUSDC = async () => {
    try {
      setStatus("Depositing USDC...");
      const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
      const value = ethers.parseUnits(amount, USDC_DECIMALS);
      const tx = await usdc.transfer(VAULT_ADDRESS, value);
      await tx.wait();
      setStatus("Deposit successful");
    } catch {
      setStatus("Deposit failed");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0b1020", color: "white", padding: 40 }}>
      <h1>DropSignal</h1>

      {!address ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>

          <input
            placeholder="USDC Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ padding: 10, marginTop: 10 }}
          />

          <div style={{ marginTop: 20 }}>
            <button onClick={approveUSDC}>Approve USDC</button>
            <button onClick={depositUSDC} style={{ marginLeft: 10 }}>
              Deposit USDC
            </button>
          </div>

          <p style={{ marginTop: 20 }}>{status}</p>
        </>
      )}
    </main>
  );
}