import { scanSolanaCreatorWallet } from "@/lib/levi/scanner/scanWallet";
import { normalizeSolanaAddress } from "@/lib/levi/wallet";

async function main() {
  const wallet = process.argv[2];
  if (!wallet) {
    console.error("Usage: npm run scan:levi -- <solana-wallet>");
    process.exit(1);
  }

  const normalizedWallet = normalizeSolanaAddress(wallet);
  const report = await scanSolanaCreatorWallet(normalizedWallet, {
    tier: "full",
  });

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
