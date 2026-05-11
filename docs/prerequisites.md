# Prerequisites

You only need three things to follow this workshop. None of them require a paid account.

## 1. Node.js

Install the **LTS** version from [nodejs.org](https://nodejs.org).

Verify the installation:

```bash
node --version
npm --version
```

## 2. MetaMask

Install the [MetaMask browser extension](https://metamask.io/download/) and create a new account.

!!! warning "Use a fresh wallet"
    Save your seed phrase somewhere safe. For this workshop, use a brand-new wallet that holds no real funds — you will export its private key into a `.env` file.

### Add Arbitrum Sepolia to MetaMask

Open MetaMask → Networks → **Add a network manually**, and enter:

| Field              | Value                                       |
| ------------------ | ------------------------------------------- |
| Network name       | Arbitrum Sepolia                            |
| RPC URL            | `https://sepolia-rollup.arbitrum.io/rpc`    |
| Chain ID           | `421614`                                    |
| Currency symbol    | `ETH`                                       |
| Block explorer URL | `https://sepolia.arbiscan.io`               |

## 3. Some test ETH on Arbitrum Sepolia

You need a tiny amount of test ETH to pay for the gas of your deployment.

Use any of these faucets (no signup needed for most):

- [QuickNode faucet](https://faucet.quicknode.com/arbitrum/sepolia)
- [Alchemy faucet](https://www.alchemy.com/faucets/arbitrum-sepolia)
- [Chainlink faucet](https://faucets.chain.link/arbitrum-sepolia)

Paste your MetaMask address, request the funds, then check the balance in MetaMask once the network is selected.

## Optional — Arbiscan API key

Only needed if you want your contract source code to display the native green ✓ badge on [Arbiscan](https://sepolia.arbiscan.io). We will use the free **Sourcify** verifier as the default, so this step is optional.

If you want the Arbiscan badge:

1. Create a free account on [arbiscan.io](https://arbiscan.io).
2. Go to **API Keys** → **Add**.
3. Save the key, you will use it as `ARBISCAN_API_KEY` later.
