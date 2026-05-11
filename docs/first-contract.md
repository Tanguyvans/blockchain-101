# Your First Smart Contract

By the end of this section you will have:

1. The workshop project running locally.
2. Written your own `SimpleStorage` contract in Solidity.
3. Passing unit tests for it.
4. The contract deployed and verified on **Arbitrum Sepolia**.

We use **Arbitrum Sepolia** because faucets are easy to find and the public RPC works out of the box — no Alchemy / Infura account required.

---

## 1. Get the project

The Hardhat project is already prepared for you in this repo, in the `my-first-contract/` folder.

Clone the repo and install dependencies:

```bash
git clone https://github.com/tanguyvans/blockchain-101.git
cd blockchain-101/my-first-contract
npm install
```

What's in there:

```text
my-first-contract/
├── contracts/                    # ← you will write the Solidity here
├── test/                         # ← you will write the tests here
├── ignition/
│   └── modules/
│       └── SimpleStorage.ts      # deployment module (already done)
├── scripts/
│   └── interact.ts               # interaction script (used in next section)
├── hardhat.config.ts             # network + verifier config (already done)
├── .env.example                  # template for your secrets
└── package.json
```

!!! tip "Why not start from `npx hardhat init`?"
    A fresh init creates a Lock-contract demo and a pile of boilerplate you would then have to delete. We pre-configured the Hardhat scaffolding so you can focus on **writing** the contract and **deploying** it — not on plumbing.

---

## 2. Write the contract

Create `contracts/SimpleStorage.sol`:

```solidity title="contracts/SimpleStorage.sol"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SimpleStorage {
    // Public state variables — Solidity auto-generates a getter for each.
    uint256 public value;
    address public owner;

    // Track the last value written by each address.
    mapping(address => uint256) public lastValueBy;

    // Event emitted on every change. `indexed` lets clients filter by author.
    event ValueChanged(address indexed by, uint256 newValue);

    // Runs once, at deployment. The deployer becomes the owner.
    constructor() {
        owner = msg.sender;
    }

    // Anyone can set a new value.
    function set(uint256 _value) public {
        value = _value;
        lastValueBy[msg.sender] = _value;
        emit ValueChanged(msg.sender, _value);
    }

    // Anyone can increment by 1.
    function increment() public {
        value += 1;
        lastValueBy[msg.sender] = value;
        emit ValueChanged(msg.sender, value);
    }

    // Only the owner can reset.
    function reset() public {
        require(msg.sender == owner, "Only the owner can reset");
        value = 0;
        emit ValueChanged(msg.sender, 0);
    }
}
```

What's in there:

| Concept                | Where                                                          |
| ---------------------- | -------------------------------------------------------------- |
| State variable         | `value`, `owner`                                               |
| Auto-generated getter  | `public` keyword on `value`, `owner`, `lastValueBy`            |
| Mapping (key → value)  | `lastValueBy[address] → uint256`                               |
| Constructor            | runs once on deploy, captures the deployer in `owner`          |
| Function (write)       | `set`, `increment`, `reset` — change state, cost gas           |
| Access control         | `require(msg.sender == owner, ...)` in `reset`                 |
| Event                  | `ValueChanged` — broadcast that something happened             |

Compile it:

```bash
npx hardhat compile
```

---

## 3. Write the tests

Create `test/SimpleStorage.test.ts`:

```typescript title="test/SimpleStorage.test.ts"
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SimpleStorage", function () {
  async function deploy() {
    const [owner, alice] = await ethers.getSigners();
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const contract = await SimpleStorage.deploy();
    return { contract, owner, alice };
  }

  it("starts with value 0 and the deployer as owner", async function () {
    const { contract, owner } = await deploy();
    expect(await contract.value()).to.equal(0);
    expect(await contract.owner()).to.equal(owner.address);
  });

  it("lets anyone set a value and emits an event", async function () {
    const { contract, alice } = await deploy();
    await expect(contract.connect(alice).set(42))
      .to.emit(contract, "ValueChanged")
      .withArgs(alice.address, 42);

    expect(await contract.value()).to.equal(42);
    expect(await contract.lastValueBy(alice.address)).to.equal(42);
  });

  it("increments by 1", async function () {
    const { contract } = await deploy();
    await contract.set(10);
    await contract.increment();
    expect(await contract.value()).to.equal(11);
  });

  it("only lets the owner reset", async function () {
    const { contract, alice } = await deploy();
    await contract.set(99);

    await expect(contract.connect(alice).reset()).to.be.revertedWith(
      "Only the owner can reset"
    );

    await contract.reset();
    expect(await contract.value()).to.equal(0);
  });
});
```

Run them:

```bash
npx hardhat test
```

Four green checks. These run on a local in-memory chain — no real network, no gas, instant.

---

## 4. Look at the network config

Open `hardhat.config.ts`. The Arbitrum Sepolia network is already wired in:

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
    arbitrumSepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      chainId: 421614,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    // Etherscan V2 — one API key for every Etherscan-family explorer.
    // Get yours at https://etherscan.io/myaccount
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
```

Notice we hardcode the **public Arbitrum Sepolia RPC** — no Alchemy/Infura signup needed.

### Get your private key

1. Open MetaMask.
2. Click the three dots ⋮ next to your account → **Account details**.
3. **Export Private Key** → enter password → copy the value (starts with `0x`).

!!! danger "Use a disposable wallet"
    Never put a private key holding real funds in a `.env` file.

### Create `.env`

The repo ships an `.env.example` you can copy:

```bash
cp .env.example .env
```

Then edit `.env`:

```env title=".env"
PRIVATE_KEY=0x...your_private_key_here...
ETHERSCAN_API_KEY=       # optional, only for Arbiscan verification (Etherscan V2 unified key)
```

`.env` is already listed in `.gitignore`, so your secret will not be committed.

---

## 5. The deployment module

Open `ignition/modules/SimpleStorage.ts` — it is two lines:

```typescript title="ignition/modules/SimpleStorage.ts"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SimpleStorage", (m) => {
  const simpleStorage = m.contract("SimpleStorage");
  return { simpleStorage };
});
```

This tells Hardhat Ignition what to deploy. For our contract there are no constructor arguments, so a single `m.contract(...)` call is enough.

---

## 6. Deploy to Arbitrum Sepolia

Make sure your wallet has some Arbitrum Sepolia ETH (see [Prerequisites](prerequisites.md) for faucets), then:

```bash
npx hardhat ignition deploy ignition/modules/SimpleStorage.ts --network arbitrumSepolia
```

Hardhat prints the deployed contract address — **copy it**, you will need it in the next section. Open the address on [sepolia.arbiscan.io](https://sepolia.arbiscan.io) to see your transaction.

---

## 7. Verify the source code

Verification publishes your Solidity source so anyone can read and call your contract from the explorer.

### Option A — Sourcify (no API key)

Sourcify is enabled in the config. Trigger verification with:

```bash
npx hardhat verify --network arbitrumSepolia <DEPLOYED_ADDRESS>
```

### Option B — Arbiscan (needs `ETHERSCAN_API_KEY`)

If you set `ETHERSCAN_API_KEY` in `.env`, the same command will also push to Arbiscan and your contract will show a green ✓ badge. The Etherscan V2 API uses a single unified key — get one at [etherscan.io/myaccount](https://etherscan.io/myaccount); the same key works on every Etherscan-family explorer.

---

## Recap

You have a deployed and verified smart contract on Arbitrum Sepolia. Time to play with it — head to [Interacting with your contract](interact.md).
