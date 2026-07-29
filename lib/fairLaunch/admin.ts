import { normalizeSolanaAddress } from "@/lib/levi/wallet";

export function parseFairLaunchAdminWallets(value: string): string[] {
  const wallets = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .flatMap((item) => {
      try {
        return [normalizeSolanaAddress(item)];
      } catch {
        return [];
      }
    });

  return [...new Set(wallets)];
}

export function getFairLaunchAdminWallets(): string[] {
  return parseFairLaunchAdminWallets(
    [
      process.env.FAIR_LAUNCH_ADMIN_WALLETS,
      process.env.CONTEST_ADMIN_WALLETS,
    ]
      .filter(Boolean)
      .join(",")
  );
}

export function isFairLaunchAdminWallet(wallet: string): boolean {
  let normalized: string;
  try {
    normalized = normalizeSolanaAddress(wallet);
  } catch {
    return false;
  }

  return getFairLaunchAdminWallets().includes(normalized);
}
