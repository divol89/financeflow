import { PublicKey } from "@solana/web3.js";

export function normalizeSolanaAddress(address: string): string {
  const trimmed = address.trim();
  const publicKey = new PublicKey(trimmed);
  return publicKey.toBase58();
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    normalizeSolanaAddress(address);
    return true;
  } catch {
    return false;
  }
}

export function truncateSolanaAddress(address: string, size = 4): string {
  if (address.length <= size * 2 + 3) return address;
  return `${address.slice(0, size)}...${address.slice(-size)}`;
}
