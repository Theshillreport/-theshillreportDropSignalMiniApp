import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { WalletConnectModal } from "@walletconnect/modal";

export const projectId = "DEIN_WALLETCONNECT_PROJECT_ID";

export const chains = [1]; // Ethereum Mainnet

export const provider = await EthereumProvider.init({
  projectId,
  chains,
  showQrModal: false,
  methods: [
    "eth_sendTransaction",
    "eth_sign",
    "eth_signTransaction",
    "eth_signTypedData"
  ],
  events: ["chainChanged", "accountsChanged"]
});

export const modal = new WalletConnectModal({
  projectId,
  chains
});
