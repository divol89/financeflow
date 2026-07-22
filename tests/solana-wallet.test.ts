import assert from "node:assert/strict";
import test from "node:test";
import {
  FLOW_FINANCE_ORIGIN,
  buildPhantomBrowseUrl,
  getInjectedSolanaProvider,
  getSolanaWalletErrorMessage,
  isLikelyMobileWalletBrowser,
  waitForInjectedSolanaProvider,
  type InjectedSolanaProvider,
  type SolanaWalletWindow,
} from "../lib/levi/solanaWallet";

function makeProvider(
  flags: Partial<Pick<InjectedSolanaProvider, "isPhantom" | "isSolflare">> = {}
): InjectedSolanaProvider {
  return {
    ...flags,
    async connect() {
      return { publicKey: { toBase58: () => "Wallet1111111111111111111111111111111111" } };
    },
    async signMessage(message) {
      return message;
    },
  };
}

test("prioritizes the modern Phantom namespace over legacy and Solflare providers", () => {
  const phantom = makeProvider({ isPhantom: true });
  const solflare = makeProvider({ isSolflare: true });
  const legacy = makeProvider();

  assert.equal(
    getInjectedSolanaProvider({
      phantom: { solana: phantom },
      solflare,
      solana: legacy,
    }),
    phantom
  );
});

test("falls back to Solflare and then a capable legacy Solana provider", () => {
  const solflare = makeProvider({ isSolflare: true });
  const legacy = makeProvider();

  assert.equal(getInjectedSolanaProvider({ solflare, solana: legacy }), solflare);
  assert.equal(getInjectedSolanaProvider({ solana: legacy }), legacy);
  assert.equal(
    getInjectedSolanaProvider({ solana: { connect: async () => ({}) } as never }),
    null
  );
});

test("detects an extension that injects after the initial page render", async () => {
  const phantom = makeProvider({ isPhantom: true });
  let readCount = 0;

  const provider = await waitForInjectedSolanaProvider({
    readScope: (): SolanaWalletWindow => {
      readCount += 1;
      return readCount >= 3 ? { phantom: { solana: phantom } } : {};
    },
    delays: [0, 10, 20],
    wait: async () => undefined,
  });

  assert.equal(provider, phantom);
  assert.equal(readCount, 3);
});

test("builds a canonical Phantom browse link while preserving route state", () => {
  const deepLink = new URL(
    buildPhantomBrowseUrl(
      "https://www.flow-finance.xyz/burn?amount=1000#confirm"
    )
  );
  const encodedTarget = deepLink.pathname.slice("/ul/browse/".length);

  assert.equal(deepLink.origin, "https://phantom.app");
  assert.equal(
    decodeURIComponent(encodedTarget),
    `${FLOW_FINANCE_ORIGIN}/burn?amount=1000#confirm`
  );
  assert.equal(deepLink.searchParams.get("ref"), FLOW_FINANCE_ORIGIN);
});

test("rejects external Phantom browse targets", () => {
  assert.throws(
    () => buildPhantomBrowseUrl("https://malicious.example/token-gate"),
    /must stay on the Flow-Finance Adventures website/
  );
});

test("identifies a compact or touch-first browser without relying on user-agent calls", () => {
  assert.equal(isLikelyMobileWalletBrowser({ innerWidth: 390 }), true);
  assert.equal(
    isLikelyMobileWalletBrowser({ innerWidth: 1440, navigator: { maxTouchPoints: 0 } }),
    false
  );
  assert.equal(
    isLikelyMobileWalletBrowser({
      innerWidth: 1024,
      navigator: { maxTouchPoints: 5 },
    }),
    true
  );
  assert.equal(
    isLikelyMobileWalletBrowser({
      innerWidth: 1440,
      navigator: { maxTouchPoints: 5 },
      matchMedia: () => ({ matches: false }),
    }),
    false
  );
  assert.equal(
    isLikelyMobileWalletBrowser({
      innerWidth: 1366,
      navigator: { maxTouchPoints: 5 },
      matchMedia: () => ({ matches: true }),
    }),
    true
  );
});

test("normalizes common Phantom connection failures", () => {
  assert.equal(
    getSolanaWalletErrorMessage({ code: 4001, message: "User rejected" }),
    "Wallet connection was cancelled."
  );
  assert.equal(
    getSolanaWalletErrorMessage({ code: -32002, message: "Request pending" }),
    "A wallet request is already open. Approve or close it, then retry."
  );
  assert.equal(
    getSolanaWalletErrorMessage({ code: 4100 }),
    "This site is not authorized in the wallet. Reconnect and approve access."
  );
});
