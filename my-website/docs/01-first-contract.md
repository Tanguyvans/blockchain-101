---
sidebar_position: 3
---

# First Smart Contract

In this section, we'll set up a Hardhat project and create our first smart contract. We'll go through the entire process from project initialization to deployment on Base Sepolia.

## Setting Up the Project

1. Create a new directory and initialize the project:

```bash
mkdir my-first-contract
cd my-first-contract
npm init -y
```

2. Install Hardhat and other dependencies:

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox typescript ts-node @types/node dotenv
```

3. Initialize Hardhat:

```bash
npx hardhat init
```

Choose "Create a TypeScript project" when prompted.

## Project Structure

After initialization, your project will have the following structure:

```
my-first-contract/
│
├── contracts/              # Smart contract files
│   └── SimpleStorage.sol   # Your smart contracts go here
│
├── ignition/              # Deployment modules
│   └── SimpleStorage.ts   # Deployment configuration
│
├── hardhat.config.ts      # Hardhat configuration file
├── tsconfig.json          # TypeScript configuration
├── package.json           # Project dependencies and scripts
└── .env                   # Environment variables (create this)
```

## Creating Your First Smart Contract

1. Create a new file `contracts/SimpleStorage.sol`:

```solidity title="contracts/SimpleStorage.sol"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SimpleStorage {
    uint256 private storedData;

    event DataStored(uint256 newValue);

    function set(uint256 x) public {
        storedData = x;
        emit DataStored(x);
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
```

## Deploying the Contract

1. Create a deployment module `ignition/modules/SimpleStorage.ts`:

```typescript title="ignition/modules/SimpleStorage.ts"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SimpleStorage", (m) => {
  const simpleStorage = m.contract("SimpleStorage");

  return { simpleStorage };
});
```

## Configuration

Update your `hardhat.config.ts` to include Base Sepolia network:

```typescript title="hardhat.config.ts"
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
```

## Environment Setup

### Getting Your Private Key

1. Open MetaMask
2. Click on the three dots (⋮) next to your account
3. Select "Account details"
4. Click "Export Private Key"
5. Enter your MetaMask password
6. Copy the private key (it starts with "0x")

⚠️ **SECURITY WARNING**: Never share your private key or commit it to Git!

### Getting Base Sepolia RPC URL

1. Go to [Alchemy](https://www.alchemy.com/)
2. Sign up or log in
3. Click "Create New App"
4. Fill in the details:
   - Name: "My First Contract"
   - Chain: "Base"
   - Network: "Base Sepolia"
5. Click "Create App"
6. Once created, click "View Key"
7. Copy the "HTTPS" URL

### Adding Base Sepolia to MetaMask

1. Open MetaMask
2. Click "Add Network"
3. Click "Add a network manually"
4. Fill in these details:
   - Network Name: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - Chain ID: 84532
   - Currency Symbol: ETH
   - Block Explorer URL: https://sepolia.basescan.org

### Setting Up Environment Variables

Create a `.env` file in your project root:

```env
PRIVATE_KEY=0x...your_private_key_here...
BASE_SEPOLIA_URL=...
API_KEY=...
```

## Deploying to Base Sepolia

To deploy your contract:

```bash
npx hardhat ignition deploy ignition/modules/SimpleStorage.ts --network baseSepolia
```

After deployment, you'll see the contract address in the console. You can view your contract on [Base Sepolia Explorer](https://sepolia.basescan.org).

## Verifying Your Contract

After deploying your contract, it's important to verify it on Base Sepolia Explorer. This makes your contract's source code publicly available and allows others to interact with it. Use the following command to verify your contract, replacing the address with your deployed contract address:

```bash
npx hardhat verify --network baseSepolia ["contractAddress"]
```

If your contract has constructor arguments, include them in the verification command:

```bash
npx hardhat verify --network baseSepolia ["contractAddress"] "arg1" "arg2"
```

Once verified, you can:

1. View the contract source code
2. Read contract state
3. Interact with contract functions
4. View contract events
