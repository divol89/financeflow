const hre = require("hardhat");

async function main() {
  console.log("Deploying ParchisEscrow to IOTA EVM...");

  const ParchisEscrow = await hre.ethers.getContractFactory("ParchisEscrow");
  const parchis = await ParchisEscrow.deploy();

  await parchis.deployed();

  console.log("ParchisEscrow deployed to:", parchis.address);
  console.log("Owner/Signer:", await parchis.owner());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
