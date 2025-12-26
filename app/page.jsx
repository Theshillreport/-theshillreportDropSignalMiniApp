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
      chains: [8453],   // BASE
      showQrModal: true
    });

    await wc.connect();

    const provider = new ethers.BrowserProvider(wc);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();

    setAddress(addr);
  } catch (err) {
    console.error("Connect Wallet:", err);
    setAddress(null);
  } finally {
    setLoading(false);
  }
};