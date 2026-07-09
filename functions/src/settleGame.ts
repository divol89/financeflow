import * as functions from "firebase-functions";

/**
 * Restored placeholder for the Crazy Dice V4 settlement Firebase functions.
 *
 * The production Next.js API route at pages/api/games/settle.ts contains the
 * active settlement implementation used by the recovered Vercel app. This file
 * keeps the historical Firebase exports present so Next/TypeScript builds do
 * not fail while the original iCloud placeholder finishes downloading.
 */
export const settleGame = functions.https.onRequest(async (_req, res) => {
  res.status(501).json({
    error: "Firebase settleGame is not configured in this restore. Use /api/games/settle.",
  });
});

export const settleStuckGames = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    console.log("settleStuckGames placeholder restored; no action taken.");
    return null;
  });
