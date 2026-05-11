# Your First Smart Contract

By the end of this section you will have:

1. A Hardhat project set up locally.
2. A `SimpleStorage` smart contract written in Solidity.
3. Passing unit tests.
4. The contract deployed and verified on **Arbitrum Sepolia**.

We use **Arbitrum Sepolia** because faucets are easy to find and the public RPC works out of the box — no Alchemy / Infura account required.

---

## 1. Create the project

```bash
mkdir my-first-contract
cd my-first-contract
npm init -y
```

Install Hardhat and its toolbox:

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox typescript ts-node @types/node dotenv
```

Initialize Hardhat and pick **"Create a TypeScript project"**:

```bash
npx hardhat init
```

After init, your folder looks like this:

```
my-first-contract/
├── contracts/
│   └── SimpleStorage.sol         # your Solidity code
├── ignition/
│   └── modules/
│       └── SimpleStorage.ts      # deployment module
├── test/
│   └── SimpleStorage.test.ts     # unit tests
├── scripts/
│   └── interact.ts               # we will add this in the next section
├── hardhat.config.ts             # network + verifier config
├── package.json
└── .env                          # secrets, NEVER commit
```

---

## 2. Write the contract

Replace `contracts/SimpleStorage.sol` with:

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

## 3. Write tests

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

## 4. Configure Arbitrum Sepolia

Replace `hardhat.config.ts` with:

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
    apiKey: {
      arbitrumSepolia: process.env.ARBISCAN_API_KEY || "",
    },
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

```env title=".env"
PRIVATE_KEY=0x...your_private_key_here...
ARBISCAN_API_KEY=        # optional, only for Arbiscan verification
```

Make sure `.env` is listed in your `.gitignore`.

---

## 5. Write the deployment module

Create `ignition/modules/SimpleStorage.ts`:

```typescript title="ignition/modules/SimpleStorage.ts"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SimpleStorage", (m) => {
  const simpleStorage = m.contract("SimpleStorage");
  return { simpleStorage };
});
```

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

### Option B — Arbiscan (needs `ARBISCAN_API_KEY`)

If you set `ARBISCAN_API_KEY` in `.env`, the same command will also push to Arbiscan and your contract will show a green ✓ badge.

---

## Recap

You have a deployed and verified smart contract on Arbitrum Sepolia. Time to play with it — head to [Interacting with your contract](interact.md).
