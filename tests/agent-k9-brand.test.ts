import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import {
  AGENT_K9_APPLE_TOUCH_ICON_PATH,
  AGENT_K9_FAVICON_PATH,
  AGENT_K9_FAVICON_PNG_PATH,
  AGENT_K9_MINT_ADDRESS,
  AGENT_K9_NAME,
  AGENT_K9_SYMBOL,
  AGENT_K9_TELEGRAM_URL,
  AGENT_K9_X_URL,
} from "@/lib/agentK9/brand";
import { CONTEST_HOLDER_TOKENS } from "@/lib/contest/constants";
import {
  AGENT_K9_MINT_ADDRESS as BURN_TRACKER_MINT,
  BURN_TRACKER_DOCUMENT_ID,
} from "@/lib/levi/burnTracker/constants";
import { LEVI_DICE_MINT } from "@/lib/levi/dice";
import { PORTFOLIO_TOKEN_ASSETS } from "@/lib/portfolio/constants";

test("keeps every Agent K9 product surface on the canonical identity", () => {
  assert.equal(AGENT_K9_NAME, "Agent K9");
  assert.equal(AGENT_K9_SYMBOL, "K9");
  assert.equal(
    AGENT_K9_MINT_ADDRESS,
    "6NHjTmLAGcN41EDzx1kofRtgLCieF233yKidydTzpump"
  );
  assert.equal(AGENT_K9_X_URL, "https://x.com/JoePegsVOR");
  assert.equal(AGENT_K9_TELEGRAM_URL, "https://t.me/FinanceFlowx");

  assert.equal(BURN_TRACKER_DOCUMENT_ID, "agent-k9");
  assert.equal(BURN_TRACKER_MINT, AGENT_K9_MINT_ADDRESS);
  assert.deepEqual(CONTEST_HOLDER_TOKENS, []);
  assert.deepEqual(
    PORTFOLIO_TOKEN_ASSETS.map(({ mint, symbol }) => ({ mint, symbol })),
    [{ mint: AGENT_K9_MINT_ADDRESS, symbol: AGENT_K9_SYMBOL }]
  );
  assert.equal(LEVI_DICE_MINT, AGENT_K9_MINT_ADDRESS);
});

test("publishes cache-safe Agent K9 browser icons", () => {
  const iconPaths = [
    AGENT_K9_FAVICON_PATH,
    AGENT_K9_FAVICON_PNG_PATH,
    AGENT_K9_APPLE_TOUCH_ICON_PATH,
  ];

  assert.deepEqual(iconPaths, [
    "/agent-k9-favicon.ico",
    "/agent-k9-favicon-32.png",
    "/agent-k9-apple-touch-icon.png",
  ]);
  for (const iconPath of iconPaths) {
    assert.equal(existsSync(`public${iconPath}`), true, `${iconPath} must exist`);
  }
});
