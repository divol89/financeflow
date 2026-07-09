const hre = require("hardhat");

async function main() {
  console.log("Deploying CrazyDiceV2 contract...");

  const CrazyDice = await hre.ethers.getContractFactory("CrazyDiceV2");
  const crazyDice = await CrazyDice.deploy();

  await crazyDice.deployed();

  console.log("CrazyDiceV2 deployed to:", crazyDice.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
