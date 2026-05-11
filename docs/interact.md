# Interacting with Your Contract

Your contract is live on Arbitrum Sepolia. Now let's actually **use it**. We will call the same contract two different ways — each one teaches a different part of how blockchains work.

| Way            | What you learn                                                  | Tools         |
| -------------- | --------------------------------------------------------------- | ------------- |
| 1. Arbiscan UI | Anyone can call a public contract from a browser                | Just MetaMask |
| 2. A script    | How a backend or dApp programs a contract                       | TypeScript    |

Throughout this section, replace `<DEPLOYED_ADDRESS>` with the address printed by `npx hardhat ignition deploy ...` in the previous section.

---

## Way 1 — Through Arbiscan (no code)

Once your contract is verified, Arbiscan auto-generates a UI for it.

1. Open `https://sepolia.arbiscan.io/address/<DEPLOYED_ADDRESS>`.
2. Click the **Contract** tab.
3. You should see a green check and three sub-tabs: **Code**, **Read Contract**, **Write Contract**.

### Read (no wallet, no gas)

Open **Read Contract**. You see one button per public state variable and view function:

- `value` — click → returns the current stored number.
- `owner` — click → returns the address that deployed the contract.
- `lastValueBy` — paste any address → returns the last value that address wrote.

These are **free**. No transaction, no signature, no gas. You are just reading from the chain.

### Write (needs your wallet, costs gas)

Open **Write Contract** → click **Connect to Web3** → approve in MetaMask.

Try:

- `set` → enter `42` → **Write** → MetaMask pops up → confirm → wait for the transaction to be mined → reload **Read Contract**: `value` is now `42`.
- `increment` → **Write** → confirm → reload Read: `value` is now `43`.
- `reset` → **Write** → confirm → the transaction **fails** because your address is not the owner (unless you are the deployer). Open the failed tx on Arbiscan and read the revert reason: `"Only the owner can reset"`.

Then call `reset` from the deployer wallet → it succeeds, `value` is back to `0`.

!!! tip "Takeaway"
    Your code is on the public internet. Anyone with a wallet and some ETH can call it. The rules you wrote in Solidity (`require`, `msg.sender`) are the only thing protecting it.

---

## Way 2 — Through a script

For real automation (a backend, a bot, a dApp) you write a script. Open `scripts/interact.ts` (it ships with the project — just edit `CONTRACT_ADDRESS` at the top):

```typescript title="scripts/interact.ts"
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
```

Run it:

```bash
npx hardhat run scripts/interact.ts --network arbitrumSepolia
```

You should see something like:

```text
Calling from: 0xYourAddress...
Current value: 101
Owner       : 0xDeployer...

Incrementing value to 102...
Tx hash: 0xabc123...
Mined.
New value : 102
Your last value: 102
Event: ValueChanged(by=0xYourAddress..., newValue=102)
```

The transaction hash is a real on-chain transaction — paste it into Arbiscan to see it.

!!! tip "Takeaway"
    A dApp is just a script like this one, packaged behind a UI. Every button click in MetaMask or on a dApp ultimately runs code that looks a lot like the above.

---

## Going further — exercises

Pick one or more:

1. **Add a counter.** Add a public state variable `setCount` that increments by 1 every time `set` is called. Redeploy. Call it a few times from Arbiscan and observe `setCount`.
2. **Add a payable function.** Make `set` `payable` and store `msg.value` in a new `mapping`. Try sending 0.0001 ETH along with `set(7)` from Arbiscan.
3. **Listen to events live.** Write a second script that uses `contract.on("ValueChanged", ...)` to print every change in real-time, then trigger `set` from Arbiscan to see it pop up in your terminal.
4. **Transfer ownership.** Add a `transferOwnership(address newOwner)` function (only callable by the current owner). Test it from the script.

For every change: re-run tests, redeploy, re-verify, then play with the new functions on Arbiscan.

---

## What you just learned

- A smart contract is a **public** program. Anyone can read it for free; anyone with gas can call it.
- **Reads** are free and instant; **writes** are transactions you must sign and wait for.
- The same contract can be called from a block explorer or from a script — they both speak the same JSON-RPC underneath.
- Access control lives in the contract itself (`require(msg.sender == owner, ...)`), not outside of it.

That's the foundation. From here, any dApp you build is just a fancier UI on top of these same calls.
