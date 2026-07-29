import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import {
  BULLISH_MULE_APPLE_TOUCH_ICON_PATH,
  BULLISH_MULE_FAVICON_PATH,
  BULLISH_MULE_FAVICON_PNG_PATH,
  BULLISH_MULE_MINT_ADDRESS,
  BULLISH_MULE_NAME,
  BULLISH_MULE_SYMBOL,
  BULLISH_MULE_TELEGRAM_URL,
  BULLISH_MULE_X_URL,
} from "@/lib/bullishMule/brand";
import { CONTEST_HOLDER_TOKENS } from "@/lib/contest/constants";
import {
  BULLISH_MULE_MINT_ADDRESS as BURN_TRACKER_MINT,
  BURN_TRACKER_DOCUMENT_ID,
} from "@/lib/levi/burnTracker/constants";
import { LEVI_DICE_MINT } from "@/lib/levi/dice";
import { PORTFOLIO_TOKEN_ASSETS } from "@/lib/portfolio/constants";

test("keeps every Bullish Mule product surface on the canonical identity", () => {
  assert.equal(BULLISH_MULE_NAME, "Bullish Mule");
  assert.equal(BULLISH_MULE_SYMBOL, "MULE");
  assert.equal(
    BULLISH_MULE_MINT_ADDRESS,
    "D9yaixWzJ9kLjWdjrhYnyFmfw8d9fjQ3AGW4hdSypump"
  );
  assert.equal(BULLISH_MULE_X_URL, "https://x.com/JoePegsVOR");
  assert.equal(BULLISH_MULE_TELEGRAM_URL, "https://t.me/FinanceFlowx");

  assert.equal(BURN_TRACKER_DOCUMENT_ID, "bullish-mule");
  assert.equal(BURN_TRACKER_MINT, BULLISH_MULE_MINT_ADDRESS);
  assert.deepEqual(CONTEST_HOLDER_TOKENS, []);
  assert.deepEqual(
    PORTFOLIO_TOKEN_ASSETS.map(({ mint, symbol }) => ({ mint, symbol })),
    [{ mint: BULLISH_MULE_MINT_ADDRESS, symbol: BULLISH_MULE_SYMBOL }]
  );
  assert.equal(LEVI_DICE_MINT, BULLISH_MULE_MINT_ADDRESS);
});

test("publishes cache-safe Bullish Mule browser icons", () => {
  const iconPaths = [
    BULLISH_MULE_FAVICON_PATH,
    BULLISH_MULE_FAVICON_PNG_PATH,
    BULLISH_MULE_APPLE_TOUCH_ICON_PATH,
  ];

  assert.deepEqual(iconPaths, [
    "/mule-favicon-v1.ico",
    "/mule-favicon-v1-32.png",
    "/mule-apple-touch-v1.png",
  ]);
  for (const iconPath of iconPaths) {
    assert.equal(existsSync(`public${iconPath}`), true, `${iconPath} must exist`);
  }
});
