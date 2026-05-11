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
