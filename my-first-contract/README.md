# My First Contract — Arbitrum Sepolia

A minimal Hardhat project to write, test, deploy, and interact with a smart contract on **Arbitrum Sepolia** (testnet).

No paid RPC account required — uses the public Arbitrum RPC.

## Quick start

```bash
npm install
cp .env.example .env       # add your PRIVATE_KEY
npm test                   # run the local tests
npm run deploy             # deploy to Arbitrum Sepolia
npm run verify -- <addr>   # verify the source on Sourcify (no API key needed)
npm run interact           # run scripts/interact.ts against the deployed contract
```

## Project layout

```text
contracts/                          # you write SimpleStorage.sol here
test/                               # you write SimpleStorage.test.ts here
ignition/modules/SimpleStorage.ts   # deployment module (pre-filled)
scripts/interact.ts                 # interaction script (pre-filled)
hardhat.config.ts                   # network + verify config (pre-filled)
```

Follow the [workshop docs](../docs/first-contract.md) for the Solidity source and the test suite.

## Environment

Create a `.env` file with:

```env
PRIVATE_KEY=0x...            # required for deployment
```

Verification goes through **Sourcify** — no API key needed. Arbiscan automatically picks up Sourcify-verified contracts.

## Useful links

- Faucet: <https://faucet.quicknode.com/arbitrum/sepolia>
- Explorer: <https://sepolia.arbiscan.io>
- Public RPC: <https://sepolia-rollup.arbitrum.io/rpc>
- Chain ID: 421614
