// Run with:
//   npx hardhat run scripts/interact.ts --network arbitrumSepolia
//
// Replace CONTRACT_ADDRESS below with your deployed contract address.

import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0xREPLACE_ME";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Calling from:", signer.address);

  const contract = await ethers.getContractAt("SimpleStorage", CONTRACT_ADDRESS);

  // 1. Read current state — free, no transaction.
  const currentValue = await contract.value();
  const owner = await contract.owner();
  console.log("Current value:", currentValue.toString());
  console.log("Owner       :", owner);

  // 2. Write — costs gas, returns a transaction we must wait for.
  const newValue = Number(currentValue) + 1;
  console.log(`\nIncrementing value to ${newValue}...`);
  const tx = await contract.set(newValue);
  console.log("Tx hash:", tx.hash);
  await tx.wait();
  console.log("Mined.");

  // 3. Read again to confirm.
  console.log("New value :", (await contract.value()).toString());
  console.log(
    "Your last value:",
    (await contract.lastValueBy(signer.address)).toString()
  );

  // 4. Look at the event emitted by our transaction.
  const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
  const log = receipt?.logs.find((l) => l.address === CONTRACT_ADDRESS);
  if (log) {
    const parsed = contract.interface.parseLog(log);
    console.log(`Event: ${parsed?.name}(by=${parsed?.args.by}, newValue=${parsed?.args.newValue})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
