import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { CRAZY_DICE_V4_ADDRESS, IOTA_RPC_URL } from "@/utils/gamesConfig";

// ABI for settleGame function
const SETTLE_ABI = [
  "function settleGame(uint256 _gameId, uint256[] calldata _rolls, uint256[] calldata _nonces, bytes[] calldata _signatures) external",
  "function getGameDetails(uint256 _gameId) external view returns (uint256 id, uint256 entryFee, uint256 pot, uint256 maxPlayers, uint256 currentPlayers, uint8 state, address creator, address winner)",
  "function getGamePlayers(uint256 _gameId) external view returns (address[])",
];

interface SettleRequest {
  gameId: string;
  rolls: { address: string; roll: number; nonce: number; signature: string }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { gameId, rolls } = req.body as SettleRequest;

  if (!gameId || !rolls || rolls.length === 0) {
    return res.status(400).json({ error: "Missing gameId or rolls" });
  }

  // Get bot private key from environment
  const botPrivateKey = process.env.SETTLEMENT_BOT_PRIVATE_KEY;
  if (!botPrivateKey) {
    console.error("SETTLEMENT_BOT_PRIVATE_KEY not configured");
    return res.status(500).json({ error: "Bot not configured" });
  }

  try {
    // Connect to IOTA EVM
    const provider = new ethers.providers.JsonRpcProvider(IOTA_RPC_URL, {
      chainId: 8822,
      name: "iota-evm",
    });
    const wallet = new ethers.Wallet(botPrivateKey, provider);
    const contract = new ethers.Contract(
      CRAZY_DICE_V4_ADDRESS,
      SETTLE_ABI,
      wallet
    );

    // Get players from contract
    const players: string[] = await contract.getGamePlayers(gameId);

    // Order signed rolls by player order
    const orderedRolls: number[] = [];
    const orderedNonces: number[] = [];
    const orderedSignatures: string[] = [];

    for (const playerAddress of players) {
      const roll = rolls.find(
        (r) => r.address.toLowerCase() === playerAddress.toLowerCase()
      );
      if (!roll) {
        return res.status(400).json({
          error: `Missing roll for player ${playerAddress}`,
        });
      }
      orderedRolls.push(roll.roll);
      orderedNonces.push(roll.nonce);
      orderedSignatures.push(roll.signature);
    }

    console.log(`Settling game ${gameId}...`);
    console.log(`  Rolls: ${orderedRolls}`);
    console.log(`  Players: ${players.length}`);

    // Call settleGame on contract
    const tx = await contract.settleGame(
      gameId,
      orderedRolls,
      orderedNonces,
      orderedSignatures,
      { gasLimit: 500000 }
    );

    console.log(`TX sent: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`TX confirmed in block ${receipt.blockNumber}`);

    return res.status(200).json({
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Settlement failed:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Settlement failed",
    });
  }
}
