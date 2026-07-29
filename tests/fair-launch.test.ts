import assert from "node:assert/strict";
import test from "node:test";
import { parseFairLaunchAdminWallets } from "../lib/fairLaunch/admin";
import {
  BULLISH_MULE_MINT,
  BULLISH_MULE_SYMBOL,
} from "../lib/fairLaunch/constants";
import { hasBullishMuleAccess } from "../lib/fairLaunch/eligibility";
import {
  CreateFairLaunchSchema,
  UpdateFairLaunchSchema,
} from "../lib/fairLaunch/validation";

const VALID_WALLET = "So11111111111111111111111111111111111111112";

function launchInput() {
  return {
    mint: BULLISH_MULE_MINT,
    name: "Bullish Mule Community Launch",
    symbol: BULLISH_MULE_SYMBOL,
    summary:
      "A verified community launch entry with official sources and clear review guidance.",
    status: "announced" as const,
    launchAt: null,
    officialUrl: "https://flow-finance.xyz/fair-launches",
    xUrl: "https://x.com/JoePegsVOR",
    telegramUrl: "https://t.me/FinanceFlowx",
    isPublished: true,
  };
}

test("Bullish Mule access requires any positive raw token balance", () => {
  assert.equal(hasBullishMuleAccess("0"), false);
  assert.equal(hasBullishMuleAccess(BigInt(0)), false);
  assert.equal(hasBullishMuleAccess("1"), true);
  assert.equal(hasBullishMuleAccess("100000000000000000000"), true);
  assert.equal(hasBullishMuleAccess("not-a-balance"), false);
});

test("launch validation accepts a Solana mint and safe official channels", () => {
  const parsed = CreateFairLaunchSchema.parse(launchInput());
  assert.equal(parsed.mint, BULLISH_MULE_MINT);
  assert.equal(parsed.symbol, BULLISH_MULE_SYMBOL);
  assert.equal(parsed.isPublished, true);
});

test("launch validation rejects unsafe links and invalid token mints", () => {
  assert.equal(
    CreateFairLaunchSchema.safeParse({
      ...launchInput(),
      officialUrl: "http://flow-finance.xyz",
    }).success,
    false
  );
  assert.equal(
    CreateFairLaunchSchema.safeParse({
      ...launchInput(),
      xUrl: "https://example.com/WhiteBullAgent",
    }).success,
    false
  );
  assert.equal(
    CreateFairLaunchSchema.safeParse({
      ...launchInput(),
      mint: "not-a-solana-mint",
    }).success,
    false
  );
});

test("launch updates require at least one field beyond the mint", () => {
  assert.equal(
    UpdateFairLaunchSchema.safeParse({ mint: BULLISH_MULE_MINT }).success,
    false
  );
  assert.equal(
    UpdateFairLaunchSchema.safeParse({
      mint: BULLISH_MULE_MINT,
      status: "open",
    }).success,
    true
  );
});

test("admin wallet parsing ignores invalid values and removes duplicates", () => {
  assert.deepEqual(
    parseFairLaunchAdminWallets(
      `${VALID_WALLET},invalid, ${VALID_WALLET},`
    ),
    [VALID_WALLET]
  );
});
