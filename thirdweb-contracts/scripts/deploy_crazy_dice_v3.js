const hre = require("hardhat");

async function main() {
  console.log("🎲 Deploying CrazyDiceV3 to IOTA EVM...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log(
    "Account balance:",
    hre.ethers.utils.formatEther(balance),
    "IOTA\n"
  );

  // Deploy CrazyDiceV3
  const CrazyDiceV3 = await hre.ethers.getContractFactory("CrazyDiceV3");
  const crazyDice = await CrazyDiceV3.deploy();
  await crazyDice.deployed();

  console.log("✅ CrazyDiceV3 deployed to:", crazyDice.address);
  console.log("\n📋 Contract Features:");
  console.log("  - Player count: 2-5 players per game");
  console.log("  - AFK timeout: 5 minutes");
  console.log("  - Protocol fee: 5%");
  console.log("  - Early start: Creator can start with 2+ players");
  console.log("  - Cancel: Creator can cancel waiting games");
  console.log("\n🔧 Admin functions available:");
  console.log("  - setProtocolFee(uint256) - Change fee %");
  console.log("  - setFeeRecipient(address) - Change fee recipient");
  console.log("  - setAfkTimeout(uint256) - Change AFK timeout");
  console.log("  - setPlayerLimits(uint256, uint256) - Change min/max players");

  console.log("\n📝 Update your gamesConfig.ts with:");
  console.log(`  CRAZY_DICE_V3_ADDRESS: "${crazyDice.address}"`);

  // Verify on explorer (if supported)
  console.log("\n⏳ Waiting 30s before verification...");
  await new Promise((r) => setTimeout(r, 30000));

  try {
    await hre.run("verify:verify", {
      address: crazyDice.address,
      constructorArguments: [],
    });
    console.log("✅ Contract verified on explorer!");
  } catch (error) {
    console.log("⚠️ Verification skipped:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
