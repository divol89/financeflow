import type {
  ClassifiedTokenActivity,
  RoutedTradeDirection,
  SignalConfidence,
  TokenActivityClassification,
  TokenActivitySummaryV2,
} from "@/types/levi";
import type {
  AccountKeyRecord,
  ParsedInstruction,
  ParsedSolanaTransaction,
  TokenBalanceRecord,
} from "./analyzers";
import { absBigInt, formatRawAmount, rawAmountValue } from "./amounts";
import { KNOWN_SWAP_PROGRAMS, QUOTE_ASSETS } from "./methodology";

const ZERO = BigInt(0);
const MIN_NATIVE_QUOTE_LAMPORTS = BigInt(100_000);

export interface ActivityEvidence {
  targetDeltaRaw: bigint;
  quoteDeltaRaw: bigint;
  nativeSolDeltaLamports: bigint;
  venue: string | null;
  hasTransferInstruction: boolean;
  hasBurnInstruction: boolean;
  hasMintInstruction: boolean;
}

export interface ActivityClassificationResult {
  classification: TokenActivityClassification;
  confidence: SignalConfidence;
  ruleId: string;
  evidence: string[];
}

function direction(value: bigint): -1 | 0 | 1 {
  if (value < ZERO) return -1;
  if (value > ZERO) return 1;
  return 0;
}

export function classifyActivityEvidence(
  input: ActivityEvidence
): ActivityClassificationResult {
  const targetDirection = direction(input.targetDeltaRaw);
  const quoteDirection = direction(
    input.quoteDeltaRaw !== ZERO
      ? input.quoteDeltaRaw
      : absBigInt(input.nativeSolDeltaLamports) >= MIN_NATIVE_QUOTE_LAMPORTS
        ? input.nativeSolDeltaLamports
        : ZERO
  );

  if (input.hasBurnInstruction && targetDirection < 0) {
    return {
      classification: "burn",
      confidence: "high",
      ruleId: "token-burn-instruction",
      evidence: ["A parsed burn instruction targets the inspected mint."],
    };
  }

  if (input.hasMintInstruction && targetDirection > 0) {
    return {
      classification: "mint",
      confidence: "high",
      ruleId: "token-mint-instruction",
      evidence: ["A parsed mint instruction targets the inspected mint."],
    };
  }

  if (input.venue && targetDirection < 0 && quoteDirection > 0) {
    return {
      classification: "sell",
      confidence: "high",
      ruleId: "known-swap-token-out-quote-in",
      evidence: [
        `A known swap venue (${input.venue}) executed in the transaction.`,
        "The inspected token decreased while a quote asset increased.",
      ],
    };
  }

  if (input.venue && targetDirection > 0 && quoteDirection < 0) {
    return {
      classification: "buy",
      confidence: "high",
      ruleId: "known-swap-token-in-quote-out",
      evidence: [
        `A known swap venue (${input.venue}) executed in the transaction.`,
        "The inspected token increased while a quote asset decreased.",
      ],
    };
  }

  if (
    input.venue &&
    targetDirection !== 0 &&
    quoteDirection !== 0 &&
    targetDirection === quoteDirection
  ) {
    return {
      classification: "liquidity",
      confidence: "medium",
      ruleId: "known-venue-assets-same-direction",
      evidence: [
        `A known swap venue (${input.venue}) executed in the transaction.`,
        "Target and quote assets moved in the same direction, which is not a simple trade.",
      ],
    };
  }

  if (input.venue && targetDirection !== 0) {
    return {
      classification: "unknown",
      confidence: "medium",
      ruleId: "known-venue-missing-quote-evidence",
      evidence: [
        `A known swap venue (${input.venue}) is present.`,
        "No opposite quote-asset movement was available to prove a buy or sell.",
      ],
    };
  }

  if (targetDirection > 0) {
    return {
      classification: "transfer_in",
      confidence: input.hasTransferInstruction ? "high" : "medium",
      ruleId: input.hasTransferInstruction
        ? "token-transfer-in"
        : "balance-in-without-swap",
      evidence: [
        input.hasTransferInstruction
          ? "A parsed token transfer instruction accompanies the incoming balance."
          : "Tokens entered without a known swap venue or opposite quote movement.",
      ],
    };
  }

  if (targetDirection < 0) {
    return {
      classification: "transfer_out",
      confidence: input.hasTransferInstruction ? "high" : "medium",
      ruleId: input.hasTransferInstruction
        ? "token-transfer-out"
        : "balance-out-without-swap",
      evidence: [
        input.hasTransferInstruction
          ? "A parsed token transfer instruction accompanies the outgoing balance."
          : "Tokens left without a known swap venue or opposite quote movement.",
      ],
    };
  }

  return {
    classification: "unknown",
    confidence: "low",
    ruleId: "no-material-target-change",
    evidence: ["No material balance change was available for classification."],
  };
}

function accountPubkey(value: AccountKeyRecord): string {
  return typeof value === "string" ? value : value.pubkey || "";
}

function walletIndex(tx: ParsedSolanaTransaction, wallet: string): number {
  return (tx.transaction?.message?.accountKeys || []).findIndex(
    (item) => accountPubkey(item) === wallet
  );
}

function allInstructions(tx: ParsedSolanaTransaction): ParsedInstruction[] {
  return [
    ...(tx.transaction?.message?.instructions || []),
    ...(tx.meta?.innerInstructions?.flatMap((item) => item.instructions || []) || []),
  ];
}

function instructionType(instruction: ParsedInstruction): string {
  return instruction.parsed?.type?.toLowerCase() || "";
}

function instructionMint(instruction: ParsedInstruction): string | null {
  const mint = instruction.parsed?.info?.mint;
  return typeof mint === "string" ? mint : null;
}

function collectProgramIds(tx: ParsedSolanaTransaction): string[] {
  const ids = new Set<string>();
  for (const instruction of allInstructions(tx)) {
    if (typeof instruction.programId === "string") ids.add(instruction.programId);
  }
  for (const message of tx.meta?.logMessages || []) {
    const match = message.match(/Program ([1-9A-HJ-NP-Za-km-z]{32,44}) invoke/);
    if (match?.[1]) ids.add(match[1]);
  }
  return [...ids];
}

function rawTokenBalance(
  wallet: string,
  mint: string,
  records: TokenBalanceRecord[] = [],
  tx?: ParsedSolanaTransaction,
  ownedTokenAccounts: Set<string> = new Set()
): { raw: bigint; decimals: number } {
  return records.reduce(
    (total, record) => {
      const accountKey =
        typeof record.accountIndex === "number"
          ? accountPubkey(
              tx?.transaction?.message?.accountKeys?.[record.accountIndex] || ""
            )
          : "";
      const belongsToWallet =
        record.owner === wallet || ownedTokenAccounts.has(accountKey);
      if (!belongsToWallet || record.mint !== mint) return total;
      return {
        raw: total.raw + BigInt(record.uiTokenAmount?.amount || "0"),
        decimals: record.uiTokenAmount?.decimals ?? total.decimals,
      };
    },
    { raw: ZERO, decimals: 0 }
  );
}

function findQuoteDelta(
  wallet: string,
  tx: ParsedSolanaTransaction
): { mint: string; symbol: string; decimals: number; delta: bigint } | null {
  for (const [mint, config] of Object.entries(QUOTE_ASSETS)) {
    const before = rawTokenBalance(wallet, mint, tx.meta?.preTokenBalances, tx);
    const after = rawTokenBalance(wallet, mint, tx.meta?.postTokenBalances, tx);
    const delta = after.raw - before.raw;
    if (delta !== ZERO) {
      return {
        mint,
        symbol: config.symbol,
        decimals: after.decimals || before.decimals || config.decimals,
        delta,
      };
    }
  }
  return null;
}

function getVenue(programIds: string[]): string | null {
  for (const programId of programIds) {
    if (KNOWN_SWAP_PROGRAMS[programId]) return KNOWN_SWAP_PROGRAMS[programId];
  }
  return null;
}

function matchesMintInstruction(
  instruction: ParsedInstruction,
  mint: string,
  prefix: "burn" | "mintto"
): boolean {
  const type = instructionType(instruction).replaceAll("_", "");
  if (!type.startsWith(prefix)) return false;
  const parsedMint = instructionMint(instruction);
  return parsedMint === null || parsedMint === mint;
}

interface TargetInstructionFlow {
  incomingRaw: bigint;
  outgoingRaw: bigint;
  decimals: number;
}

interface RoutedTradeContext {
  direction: RoutedTradeDirection;
  actor: string | null;
}

function targetInstructionFlow(
  mint: string,
  instructions: ParsedInstruction[],
  ownedAccounts: Set<string>
): TargetInstructionFlow {
  let incomingRaw = ZERO;
  let outgoingRaw = ZERO;
  let decimals = 0;

  for (const instruction of instructions) {
    if (!instructionType(instruction).startsWith("transfer")) continue;
    const info = instruction.parsed?.info;
    if (!info) continue;
    const source = typeof info.source === "string" ? info.source : null;
    const destination =
      typeof info.destination === "string" ? info.destination : null;
    const sourceOwned = Boolean(source && ownedAccounts.has(source));
    const destinationOwned = Boolean(
      destination && ownedAccounts.has(destination)
    );
    if (!sourceOwned && !destinationOwned) continue;

    const parsedMint = instructionMint(instruction);
    if (parsedMint && parsedMint !== mint) continue;
    const tokenAmount =
      info.tokenAmount && typeof info.tokenAmount === "object"
        ? (info.tokenAmount as Record<string, unknown>)
        : null;
    const rawAmount = tokenAmount?.amount ?? info.amount;
    const amount =
      typeof rawAmount === "string" && /^\d+$/.test(rawAmount)
        ? BigInt(rawAmount)
        : typeof rawAmount === "number" && Number.isSafeInteger(rawAmount)
          ? BigInt(rawAmount)
          : ZERO;
    if (amount <= ZERO) continue;

    if (destinationOwned) incomingRaw += amount;
    if (sourceOwned) outgoingRaw += amount;
    if (typeof tokenAmount?.decimals === "number") {
      decimals = tokenAmount.decimals;
    }
  }

  return { incomingRaw, outgoingRaw, decimals };
}

function routedTradeContext(
  mint: string,
  tx: ParsedSolanaTransaction
): RoutedTradeContext {
  for (const account of tx.transaction?.message?.accountKeys || []) {
    if (typeof account === "string" || !account.signer) continue;
    const actor = account.pubkey || null;
    if (!actor) continue;
    const before = rawTokenBalance(
      actor,
      mint,
      tx.meta?.preTokenBalances,
      tx
    );
    const after = rawTokenBalance(
      actor,
      mint,
      tx.meta?.postTokenBalances,
      tx
    );
    const delta = after.raw - before.raw;
    if (delta < ZERO) return { direction: "sell", actor };
    if (delta > ZERO) return { direction: "buy", actor };
  }
  return { direction: "neutral", actor: null };
}

export function classifyTokenTransaction(
  wallet: string,
  mint: string,
  tx: ParsedSolanaTransaction,
  ownedTokenAccounts: string[] = []
): ClassifiedTokenActivity | null {
  if (tx.meta?.err) return null;

  const ownedAccounts = new Set(ownedTokenAccounts);
  const before = rawTokenBalance(
    wallet,
    mint,
    tx.meta?.preTokenBalances,
    tx,
    ownedAccounts
  );
  const after = rawTokenBalance(
    wallet,
    mint,
    tx.meta?.postTokenBalances,
    tx,
    ownedAccounts
  );
  const targetDeltaRaw = after.raw - before.raw;
  const instructions = allInstructions(tx);
  const targetFlow = targetInstructionFlow(mint, instructions, ownedAccounts);
  const routedRaw =
    targetFlow.incomingRaw > ZERO && targetFlow.outgoingRaw > ZERO
      ? targetFlow.incomingRaw < targetFlow.outgoingRaw
        ? targetFlow.incomingRaw
        : targetFlow.outgoingRaw
      : ZERO;
  const isRoutedFlow = targetDeltaRaw === ZERO && routedRaw > ZERO;
  if (targetDeltaRaw === ZERO && !isRoutedFlow) return null;

  const programIds = collectProgramIds(tx);
  const venue = getVenue(programIds);
  const routeContext =
    isRoutedFlow && venue
      ? routedTradeContext(mint, tx)
      : { direction: "neutral" as const, actor: null };
  const balanceSubject =
    isRoutedFlow && routeContext.actor ? routeContext.actor : wallet;
  const accountIndex = walletIndex(tx, balanceSubject);
  const preSol = accountIndex >= 0 ? tx.meta?.preBalances?.[accountIndex] || 0 : 0;
  const postSol = accountIndex >= 0 ? tx.meta?.postBalances?.[accountIndex] || 0 : 0;
  const fee = accountIndex === 0 ? tx.meta?.fee || 0 : 0;
  const netSolLamports = BigInt(Math.trunc(postSol - preSol + fee));
  const quote = findQuoteDelta(balanceSubject, tx);
  const hasTransferInstruction = instructions.some((instruction) =>
    instructionType(instruction).startsWith("transfer")
  );
  const hasBurnInstruction = instructions.some((instruction) =>
    matchesMintInstruction(instruction, mint, "burn")
  );
  const hasMintInstruction = instructions.some((instruction) =>
    matchesMintInstruction(instruction, mint, "mintto")
  );
  const classified: ActivityClassificationResult = isRoutedFlow
    ? {
        classification: "routed",
        confidence: "high",
        ruleId: "balanced-token-routing",
        evidence: [
          "Target tokens entered and left an inspected token account in the same transaction.",
          "The account finished with no net target-token change, so this is routed volume rather than a user buy or sell.",
          ...(routeContext.direction !== "neutral"
            ? [
                `The signing account's target-token balance ${routeContext.direction === "sell" ? "decreased" : "increased"} through ${venue}, identifying a ${routeContext.direction}-side route.`,
              ]
            : []),
        ],
      }
    : classifyActivityEvidence({
        targetDeltaRaw,
        quoteDeltaRaw: quote?.delta || ZERO,
        nativeSolDeltaLamports: netSolLamports,
        venue,
        hasTransferInstruction,
        hasBurnInstruction,
        hasMintInstruction,
      });
  const signature = tx.transaction?.signatures?.[0] || "unknown";
  const decimals = after.decimals || before.decimals || targetFlow.decimals;
  const displayedTargetRaw = isRoutedFlow
    ? routedRaw
    : absBigInt(targetDeltaRaw);

  return {
    id: `${signature}:${mint}`,
    mint,
    signature,
    slot: tx.slot || 0,
    blockTime: tx.blockTime || null,
    classification: classified.classification,
    confidence: classified.confidence,
    targetDeltaRaw: targetDeltaRaw.toString(),
    targetAmount: rawAmountValue(displayedTargetRaw, decimals),
    grossTargetInRaw:
      targetFlow.incomingRaw > ZERO
        ? targetFlow.incomingRaw.toString()
        : undefined,
    grossTargetOutRaw:
      targetFlow.outgoingRaw > ZERO
        ? targetFlow.outgoingRaw.toString()
        : undefined,
    routeDirection: isRoutedFlow ? routeContext.direction : undefined,
    routeActor: isRoutedFlow ? routeContext.actor : undefined,
    preBalanceRaw: before.raw.toString(),
    postBalanceRaw: after.raw.toString(),
    quoteAsset: quote
      ? {
          mint: quote.mint,
          symbol: quote.symbol,
          delta: rawAmountValue(quote.delta, quote.decimals),
        }
      : null,
    netSolLamports: netSolLamports.toString(),
    netSol: formatRawAmount(netSolLamports, 9),
    feeLamports: String(tx.meta?.fee || 0),
    venue: venue || (isRoutedFlow ? "Balanced routed flow" : null),
    programIds,
    evidence: classified.evidence,
    ruleId: classified.ruleId,
  };
}

export function classifyTokenTransactions(
  wallet: string,
  mint: string,
  transactions: ParsedSolanaTransaction[],
  ownedTokenAccounts: string[] = []
): ClassifiedTokenActivity[] {
  return transactions
    .map((transaction) =>
      classifyTokenTransaction(wallet, mint, transaction, ownedTokenAccounts)
    )
    .filter((event): event is ClassifiedTokenActivity => Boolean(event))
    .sort((left, right) => (right.blockTime || 0) - (left.blockTime || 0));
}

export function summarizeClassifiedActivity(
  events: ClassifiedTokenActivity[],
  decimals: number
): TokenActivitySummaryV2 {
  let totalSold = ZERO;
  let totalBought = ZERO;
  let totalRouted = ZERO;
  let totalRoutedBought = ZERO;
  let totalRoutedSold = ZERO;
  let possibleOutflow = ZERO;
  let netTokenChange = ZERO;
  let largestSell = ZERO;
  let latestSellAt: number | null = null;
  let latestRoutedAt: number | null = null;
  let observedSellCount = 0;
  let probableSellCount = 0;
  let buyCount = 0;
  let routedCount = 0;
  let routedBuyCount = 0;
  let routedSellCount = 0;
  let routedNeutralCount = 0;
  let transferCount = 0;
  let unknownCount = 0;
  const quoteTotals = new Map<string, { symbol: string; decimals: number; raw: bigint }>();

  for (const event of events) {
    const delta = BigInt(event.targetDeltaRaw);
    const amount = absBigInt(delta);
    netTokenChange += delta;

    if (event.classification === "sell") {
      if (event.confidence === "high") {
        observedSellCount += 1;
        totalSold += amount;
        largestSell = amount > largestSell ? amount : largestSell;
        latestSellAt = Math.max(latestSellAt || 0, event.blockTime || 0) || null;
        const quote = event.quoteAsset;
        if (quote && BigInt(quote.delta.raw) > ZERO) {
          const stored = quoteTotals.get(quote.mint) || {
            symbol: quote.symbol,
            decimals: quote.delta.decimals,
            raw: ZERO,
          };
          stored.raw += BigInt(quote.delta.raw);
          quoteTotals.set(quote.mint, stored);
        }
      } else {
        probableSellCount += 1;
      }
    } else if (event.classification === "buy") {
      buyCount += 1;
      totalBought += amount;
    } else if (event.classification === "routed") {
      routedCount += 1;
      totalRouted += BigInt(event.targetAmount.raw);
      if (event.routeDirection === "buy") {
        routedBuyCount += 1;
        totalRoutedBought += BigInt(event.targetAmount.raw);
      } else if (event.routeDirection === "sell") {
        routedSellCount += 1;
        totalRoutedSold += BigInt(event.targetAmount.raw);
      } else {
        routedNeutralCount += 1;
      }
      latestRoutedAt =
        Math.max(latestRoutedAt || 0, event.blockTime || 0) || null;
    } else if (
      event.classification === "transfer_in" ||
      event.classification === "transfer_out"
    ) {
      transferCount += 1;
      if (event.classification === "transfer_out") possibleOutflow += amount;
    } else if (event.classification === "unknown") {
      unknownCount += 1;
      if (delta < ZERO) possibleOutflow += amount;
    }
  }

  return {
    observedSellCount,
    probableSellCount,
    buyCount,
    routedCount,
    routedBuyCount,
    routedSellCount,
    routedNeutralCount,
    transferCount,
    unknownCount,
    totalSold: rawAmountValue(totalSold, decimals),
    totalBought: rawAmountValue(totalBought, decimals),
    totalRouted: rawAmountValue(totalRouted, decimals),
    totalRoutedBought: rawAmountValue(totalRoutedBought, decimals),
    totalRoutedSold: rawAmountValue(totalRoutedSold, decimals),
    possibleOutflow: rawAmountValue(possibleOutflow, decimals),
    netTokenChange: rawAmountValue(netTokenChange, decimals),
    largestSell: rawAmountValue(largestSell, decimals),
    latestSellAt,
    latestRoutedAt,
    quoteReceived: [...quoteTotals.entries()].map(([mint, value]) => ({
      mint,
      symbol: value.symbol,
      amount: rawAmountValue(value.raw, value.decimals),
    })),
  };
}
