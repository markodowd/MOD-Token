import { ethers } from "hardhat";

async function main() {
  const MODToken = await ethers.getContractFactory("MODToken");
  const modToken = await MODToken.deploy("MODToken", "MOD", 18);
  console.log("MODToken deployed to", modToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
