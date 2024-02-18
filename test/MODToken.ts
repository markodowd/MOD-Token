import { ethers, network } from "hardhat";
import { expect } from "chai";

import { loadFixture, mine } from "@nomicfoundation/hardhat-network-helpers";

import { smock } from "@defi-wonderland/smock";
import { MODToken__factory } from "../typechain-types";

describe("MODToken", function () {
  async function deployAndMockMODToken() {
    const [alice, bob] = await ethers.getSigners();

    const MODToken = await smock.mock<MODToken__factory>("MODToken");
    const modToken = await MODToken.deploy("MODToken", "MOD", 18);

    await modToken.setVariable("balanceOf", {
      [alice.address]: 300,
    });
    await mine();

    return { alice, bob, modToken };
  }

  it("transfers tokens correctly", async function () {
    const { alice, bob, modToken } = await loadFixture(deployAndMockMODToken);

    await expect(
      await modToken.transfer(bob.address, 100)
    ).to.changeTokenBalances(modToken, [alice, bob], [-100, 100]);

    await expect(
      await modToken.connect(bob).transfer(alice.address, 50)
    ).to.changeTokenBalances(modToken, [alice, bob], [50, -50]);
  });

  it("should revert if sender has insufficient balance", async function () {
    const { bob, modToken } = await loadFixture(deployAndMockMODToken);
    await expect(modToken.transfer(bob.address, 400)).to.be.revertedWith(
      "MODToken: Insufficient sender balance"
    );
  });

  it("should emit Transfer event on transfers", async function () {
    const { alice, bob, modToken } = await loadFixture(deployAndMockMODToken);
    await expect(modToken.transfer(bob.address, 200))
      .to.emit(modToken, "Transfer")
      .withArgs(alice.address, bob.address, 200);
  });
});
