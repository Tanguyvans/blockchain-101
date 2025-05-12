import { expect } from "chai";
import { ethers } from "hardhat";
import { SimpleStorage } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("SimpleStorage", function () {
  let simpleStorage: SimpleStorage;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorage.deploy();
  });

  it("Should store and retrieve the value", async function () {
    const value = 42;
    await simpleStorage.set(value);
    expect(await simpleStorage.get()).to.equal(value);
  });
});