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

### Option A — Email me your address

Send your **MetaMask public address** (the one starting with `0x...`) to **<tanguy.vansnick@umons.ac.be>** and I will fund it directly with Arbitrum Sepolia ETH for the workshop.

!!! tip "How to copy your address from MetaMask"
    Open MetaMask → click on your account name at the top → the address (starting with `0x...`) is copied to your clipboard. Paste it in the email — that's a **public** address, totally safe to share.

### Option B — Use a public faucet

Try any of these (no signup needed for most):

- [QuickNode faucet](https://faucet.quicknode.com/arbitrum/sepolia)
- [Alchemy faucet](https://www.alchemy.com/faucets/arbitrum-sepolia)
- [Chainlink faucet](https://faucets.chain.link/arbitrum-sepolia)

Paste your MetaMask address, request the funds, then check the balance in MetaMask once the network is selected.

## That's it — no third-party accounts needed

We verify contracts through **Sourcify**, which requires no API key. The verified source code is then displayed on Arbiscan automatically, so you do not need an Etherscan / Arbiscan account for this workshop.
