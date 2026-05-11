# Introduction

Welcome! This short workshop walks you through writing, testing and deploying your **first smart contract** on Ethereum, then shows you several ways to actually **interact with it**.

No prior blockchain knowledge required. By the end of the session, you will have a real contract running on a public testnet and you will know how to call it from a browser, from a terminal, and from a script.

We use **Arbitrum Sepolia** (an Ethereum L2 testnet) because:

- The public RPC is free and works without an account.
- Faucets are easy to find and reliable.
- Gas is cheap, so you can experiment without stress.

## What you will learn

- The basic vocabulary of Ethereum: wallet, RPC, gas, contract, ABI, event.
- Setting up a Hardhat project with TypeScript.
- Writing, compiling and testing a Solidity contract.
- Deploying it to a public testnet and verifying its source code.
- Calling it from a block explorer UI and from a TypeScript script.

## What you will build

A `SimpleStorage` contract that:

- stores a number on-chain,
- lets anyone change or increment it,
- restricts a `reset` action to the deployer (your first taste of access control),
- emits an event every time the value changes.

## How the workshop is organized

1. **[Prerequisites](prerequisites.md)** — install the tools (Node.js, MetaMask, test ETH).
2. **[Your first smart contract](first-contract.md)** — Hardhat, Solidity, tests, deployment.
3. **[Interacting with your contract](interact.md)** — two different ways to call your contract.

Each section is hands-on. Let's start with the [Prerequisites](prerequisites.md).
