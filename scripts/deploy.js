import { ethers } from "hardhat";

async function main() {
  const AavePool = "0x6Ae63C4E349A8675D8aC49f37b51f72dF6bD29c1";
  const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

  console.log("Deploying BaseYieldVault...");
  const Vault = await ethers.getContractFactory("BaseYieldVault");
  const vault = await Vault.deploy(AavePool, USDC);
  await vault.deployed();

  console.log("BaseYieldVault deployed to:", vault.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
