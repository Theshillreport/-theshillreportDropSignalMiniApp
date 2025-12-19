export const USDC_ADDRESS =
  "0x..."; // Base Sepolia USDC

export const VAULT_ADDRESS =
  "0x..."; // dein Vault auf Base Sepolia

export const vaultAbi = [
  {
    "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];