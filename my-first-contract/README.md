# My First Contract — Arbitrum Sepolia

A minimal Hardhat project to write, test, deploy, and interact with a smart contract on **Arbitrum Sepolia** (testnet).

No paid RPC account required — uses the public Arbitrum RPC.

## Quick start

```bash
npm install
cp .env.example .env       # add your PRIVATE_KEY
npm test                   # run the local tests
npm run deploy             # deploy to Arbitrum Sepolia
npm run verify -- <addr>   # verify the source on Sourcify (+ Arbiscan if API key set)
npm run interact           # run scripts/interact.ts against the deployed contract
npm run console            # open a REPL connected to Arbitrum Sepolia
```

## Project layout

```
contracts/SimpleStorage.sol         # the contract
test/SimpleStorage.test.ts          # tests
ignition/modules/SimpleStorage.ts   # deployment module
scripts/interact.ts                 # example interaction script
hardhat.config.ts                   # network + verify config
```

## Environment

Create a `.env` file with:

```env
PRIVATE_KEY=0x...            # required for deployment
ARBISCAN_API_KEY=...         # optional, only for Arbiscan verification
```

Sourcify verification works without any API key — it is enabled by default in `hardhat.config.ts`.

## Useful links

- Faucet: https://faucet.quicknode.com/arbitrum/sepolia
- Explorer: https://sepolia.arbiscan.io
- Public RPC: https://sepolia-rollup.arbitrum.io/rpc
- Chain ID: 421614
