import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    arbitrumSepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      chainId: 421614,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  // Verify via Sourcify (no API key required).
  // Arbiscan automatically picks up Sourcify-verified contracts and shows
  // the source under the "Code" tab.
  sourcify: {
    enabled: true,
  },
  // Disable the Etherscan path. hardhat-verify 2.x for Hardhat 2 still hits
  // the deprecated V1 endpoints for arbitrumSepolia, which Etherscan no
  // longer accepts. Re-enable once Hardhat 3 + hardhat-verify 3.x is in use.
  etherscan: {
    enabled: false,
  },
};

export default config;
