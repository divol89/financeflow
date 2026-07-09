import { LEVI_MINT_ADDRESS } from "./constants";

export type LeviDiceStatus = "WAITING" | "PLAYING" | "ENDED" | "CANCELLED";

export interface LeviDicePreviewGame {
  id: string;
  creator: string;
  entryFee: number;
  maxPlayers: number;
  players: string[];
  status: LeviDiceStatus;
  rolls: Record<string, number>;
  winner?: string;
  createdAt: number;
}

export const LEVI_DICE_STORAGE_KEY = "flowfinance_levi_dice_preview_games";
export const LEVI_DICE_PROTOCOL_FEE_BPS = 500;
export const LEVI_DICE_MINT = LEVI_MINT_ADDRESS;
export const LEVI_DICE_PROGRAM_ID =
  process.env.NEXT_PUBLIC_LEVI_DICE_PROGRAM_ID || "";

export function isLeviDiceProgramReady(): boolean {
  return LEVI_DICE_PROGRAM_ID.length >= 32;
}

export function getLeviDicePrize(entryFee: number, playerCount: number): number {
  const pot = entryFee * playerCount;
  return pot * (10_000 - LEVI_DICE_PROTOCOL_FEE_BPS) / 10_000;
}

export function getLeviDicePot(entryFee: number, playerCount: number): number {
  return entryFee * playerCount;
}

export function formatLeviAmount(amount: number): string {
  return amount.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

export function makeLeviDicePreviewGame(params: {
  creator: string;
  entryFee: number;
  maxPlayers: number;
}): LeviDicePreviewGame {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    creator: params.creator,
    entryFee: params.entryFee,
    maxPlayers: params.maxPlayers,
    players: [params.creator],
    status: "WAITING",
    rolls: {},
    createdAt: Date.now(),
  };
}

export function readLeviDicePreviewGames(): LeviDicePreviewGame[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(LEVI_DICE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LeviDicePreviewGame[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeLeviDicePreviewGames(games: LeviDicePreviewGame[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LEVI_DICE_STORAGE_KEY, JSON.stringify(games));
}

export function upsertLeviDicePreviewGame(game: LeviDicePreviewGame) {
  const games = readLeviDicePreviewGames();
  const index = games.findIndex((item) => item.id === game.id);
  const nextGames =
    index >= 0
      ? games.map((item) => (item.id === game.id ? game : item))
      : [game, ...games].slice(0, 20);
  writeLeviDicePreviewGames(nextGames);
  return nextGames;
}

export function findLeviDicePreviewGame(id: string): LeviDicePreviewGame | null {
  return readLeviDicePreviewGames().find((game) => game.id === id) || null;
}

export function rollLeviDice(): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return Number(values[0] % 100) + 1;
  }

  return Math.floor(Math.random() * 100) + 1;
}

export function settleLeviDicePreviewGame(
  game: LeviDicePreviewGame
): LeviDicePreviewGame {
  const winner = [...game.players].sort((a, b) => {
    const rollDiff = (game.rolls[b] || 0) - (game.rolls[a] || 0);
    return rollDiff || a.localeCompare(b);
  })[0];

  return {
    ...game,
    winner,
    status: "ENDED",
  };
}
