---
sidebar_position: 4
---

# Scaffold-ETH

In this section, we'll create an App.

```bash
npx create-eth@latest
```

```
cd my-dapp-example
yarn install
```

## Run the contract locally

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/hardhat/hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

## How to update the contract

```solidity title="my-dapp-example/packages/hardhat/contracts/YourContract.sol"
function getGreeting() public view returns (string memory) {
    return greeting;
}
```

```typescript title="my-dapp-example/packages/nextjs/app/debug/_components/contract/ContractReadMethods.tsx"
const functionsToDisplay = (
  ((deployedContractData.abi || []) as Abi).filter(
    (part) => part.type === "function"
  ) as AbiFunction[]
).filter((fn) => {
  const isQueryable =
    fn.stateMutability === "view" || fn.stateMutability === "pure";
  return isQueryable;
});
```
