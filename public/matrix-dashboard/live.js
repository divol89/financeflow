(function () {
  const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
  const WSOL_MINT = "So11111111111111111111111111111111111111112";

  const DEXSCREENER_TOKEN_URL = "https://api.dexscreener.com/latest/dex/tokens";
  const SOLANA_RPC_FALLBACKS = ["https://solana-rpc.publicnode.com", "https://api.mainnet-beta.solana.com"];
  const SIGNATURE_PAGE_LIMIT = 24;
  const SIGNATURE_PAGE_COUNT = 1;
  const MAX_TRANSACTION_FETCH = 24;
  const MAX_RECENT_TRADES = 80;
  const TX_SAMPLE_TIMEOUT_MS = 14_000;
  const HOLDER_SAMPLE_TIMEOUT_MS = 8_000;
  const MAX_ACTIVE_WALLET_ROWS = 36;
  const MAX_WALLET_ROWS = 48;
  const MAX_TOP_HOLDERS = 24;
  const MAX_CACHE_ITEMS = 360;
  const WHALE_SOL_THRESHOLD = 100;
  const WATCH_SOL_THRESHOLD = 25;
  const HOLDER_WHALE_SOL_THRESHOLD = 100;
  const SOL_PRICE_CACHE_MS = 60_000;

  const txCache = new Map();
  const providerState = new Map();
  const solPriceCache = { priceUsd: 0, expiresAt: 0 };

  function localRpcProxyUrl() {
    if (window.location.protocol === "http:" || window.location.protocol === "https:") {
      return `${window.location.origin}/api/solana/rpc`;
    }
    return "http://127.0.0.1:8787/api/solana/rpc";
  }

  function rpcEndpoints() {
    return [localRpcProxyUrl(), ...SOLANA_RPC_FALLBACKS];
  }

  function isLocalRpcProxy(endpoint) {
    return endpoint.endsWith("/api/solana/rpc");
  }

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function withTimeout(promise, ms, label) {
    return Promise.race([
      promise,
      new Promise((_, reject) => window.setTimeout(() => reject(new Error(`${label} timeout after ${Math.round(ms / 1000)}s`)), ms)),
    ]);
  }

  function nowMs() {
    return Date.now();
  }

  function provider(provider) {
    if (!providerState.has(provider)) {
      providerState.set(provider, {
        name: provider,
        cooldownUntil: 0,
        consecutive429: 0,
        lastError: null,
        lastOk: null,
      });
    }
    return providerState.get(provider);
  }

  function compact(value, digits = 1) {
    if (!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat("en-US", {
      notation: Math.abs(value) >= 1000 ? "compact" : "standard",
      maximumFractionDigits: Math.abs(value) >= 1000 ? digits : 2,
    }).format(value);
  }

  function compactUsd(value) {
    if (!Number.isFinite(value)) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: Math.abs(value) >= 1000 ? "compact" : "standard",
      maximumFractionDigits: Math.abs(value) >= 1000 ? 1 : 2,
    }).format(value);
  }

  function compactSol(value) {
    const numeric = Number(value) || 0;
    return `${compact(numeric, Math.abs(numeric) >= 100 ? 1 : 2)} SOL`;
  }

  function usdToSol(usdValue, solPriceUsd) {
    const price = Number(solPriceUsd) || 0;
    if (price <= 0) return 0;
    return (Number(usdValue) || 0) / price;
  }

  function solNotionalLabel(usdValue, thresholds) {
    const sol = usdToSol(usdValue, thresholds.solPriceUsd);
    if (!thresholds.solPriceUsd) return `${compactUsd(usdValue)}; SOL price unavailable`;
    return `${compactSol(sol)} eq / ${compactUsd(usdValue)}`;
  }

  function whaleThresholdLabel(thresholds) {
    if (!thresholds.solPriceUsd) return `>=${thresholds.whaleSol} SOL whale / SOL price unavailable`;
    return `>=${thresholds.whaleSol} SOL whale (${compactUsd(thresholds.whaleUsd)} eq)`;
  }

  function pairScore(pair) {
    const liquidity = Number(pair.liquidity?.usd ?? 0);
    const volume = Number(pair.volume?.h24 ?? 0);
    const txns = Number(pair.txns?.h24?.buys ?? 0) + Number(pair.txns?.h24?.sells ?? 0);
    return volume * 3 + liquidity * 0.5 + txns * 12;
  }

  function signedCompact(value, suffix = "") {
    const sign = value > 0 ? "+" : "";
    return `${sign}${compact(value)}${suffix}`;
  }

  function signedUsd(value) {
    const numeric = Number(value) || 0;
    const sign = numeric > 0 ? "+" : numeric < 0 ? "-" : "";
    return `${sign}${compactUsd(Math.abs(numeric))}`;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function amount(raw) {
    const value = Number(raw?.uiTokenAmount?.uiAmountString ?? raw?.uiTokenAmount?.uiAmount ?? 0);
    return Number.isFinite(value) ? value : 0;
  }

  function firstSigner(transaction) {
    const keys = transaction?.transaction?.message?.accountKeys ?? [];
    const signer = keys.find((key) => key.signer);
    return typeof signer?.pubkey === "string" ? signer.pubkey : String(signer?.pubkey ?? "unknown");
  }

  function signerSet(transaction) {
    const keys = transaction?.transaction?.message?.accountKeys ?? [];
    return new Set(
      keys
        .filter((key) => key.signer)
        .map((key) => (typeof key.pubkey === "string" ? key.pubkey : String(key.pubkey))),
    );
  }

  async function guardedFetch(providerName, url, options = {}, timeoutMs = 12_000) {
    const state = provider(providerName);
    if (state.cooldownUntil > nowMs()) {
      const seconds = Math.ceil((state.cooldownUntil - nowMs()) / 1000);
      throw new Error(`${providerName} cooldown ${seconds}s`);
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        cache: "no-store",
        mode: "cors",
        signal: controller.signal,
      });

      if (response.status === 429) {
        const retryAfter = Number(response.headers.get("Retry-After") ?? 20);
        state.consecutive429 += 1;
        state.cooldownUntil = nowMs() + Math.max(5, retryAfter) * 1000;
        state.lastError = `429 retry-after ${retryAfter}s`;
        throw new Error(`${providerName} 429`);
      }

      if (!response.ok) {
        state.lastError = `${response.status} ${response.statusText}`.trim();
        throw new Error(`${providerName} ${state.lastError}`);
      }

      state.consecutive429 = 0;
      state.cooldownUntil = 0;
      state.lastOk = new Date().toISOString();
      state.lastError = null;
      return response;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function fetchDexPairs(mint) {
    const response = await guardedFetch("dexscreener", `${DEXSCREENER_TOKEN_URL}/${mint}`);
    const json = await response.json();
    const pairs = (json.pairs ?? [])
      .filter((pair) => pair.chainId === "solana")
      .filter((pair) => pair.baseToken?.address === mint || pair.quoteToken?.address === mint)
      .sort((a, b) => pairScore(b) - pairScore(a));

    if (!pairs.length) {
      throw new Error("No Solana pair found for token mint");
    }
    return pairs;
  }

  async function fetchSolUsdPrice() {
    if (solPriceCache.priceUsd > 0 && solPriceCache.expiresAt > nowMs()) {
      return solPriceCache.priceUsd;
    }

    try {
      const pairs = await fetchDexPairs(WSOL_MINT);
      const bestPair = pairs.find((pair) => Number(pair.priceUsd ?? 0) > 0);
      const priceUsd = Number(bestPair?.priceUsd ?? 0);
      if (priceUsd > 0) {
        solPriceCache.priceUsd = priceUsd;
        solPriceCache.expiresAt = nowMs() + SOL_PRICE_CACHE_MS;
        return priceUsd;
      }
    } catch {
      // Keep the tracker usable if SOL/USD conversion is temporarily unavailable.
    }

    return solPriceCache.priceUsd;
  }

  function selectPair(pairs, mint) {
    const liquidUsdcPair = pairs.find(
      (pair) =>
        (pair.baseToken?.address === mint && pair.quoteToken?.address === USDC_MINT) ||
        (pair.quoteToken?.address === mint && pair.baseToken?.address === USDC_MINT),
    );
    return liquidUsdcPair ?? pairs[0];
  }

  function pairMeta(pair, mint) {
    const target = pair.baseToken?.address === mint ? pair.baseToken : pair.quoteToken;
    const quote = pair.baseToken?.address === mint ? pair.quoteToken : pair.baseToken;
    return {
      pair,
      target,
      quote,
      priceUsd: Number(pair.priceUsd ?? 0),
      poolLabel: `${pair.dexId ?? "dex"} ${target?.symbol ?? "TOKEN"}/${quote?.symbol ?? "QUOTE"}`.toUpperCase(),
    };
  }

  async function rpcCall(method, params, options = {}) {
    let lastError = null;
    const endpoints = options.fallbackToPublic === false ? [localRpcProxyUrl()] : rpcEndpoints();
    for (const endpoint of endpoints) {
      try {
        const proxy = isLocalRpcProxy(endpoint);
        const response = await guardedFetch(
          `rpc:${new URL(endpoint).hostname}${proxy ? ":proxy" : ""}`,
          endpoint,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: proxy
              ? JSON.stringify({ method, params })
              : JSON.stringify({ jsonrpc: "2.0", id: `${method}-${Date.now()}`, method, params }),
          },
          proxy ? 30_000 : 14_000,
        );
        const json = await response.json();
        if (!proxy && json.error) {
          const message = json.error.message || JSON.stringify(json.error);
          if (String(message).toLowerCase().includes("too many requests")) {
            const state = provider(`rpc:${new URL(endpoint).hostname}`);
            state.consecutive429 += 1;
            state.cooldownUntil = nowMs() + 20_000;
          }
          throw new Error(`${method}: ${message}`);
        }
        return proxy ? json : json.result;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError ?? new Error(`${method} failed`);
  }

  async function getTransaction(signature) {
    if (txCache.has(signature)) return txCache.get(signature);
    const tx = await rpcCall("getTransaction", [
      signature,
      { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 },
    ]);
    txCache.set(signature, tx);
    if (txCache.size > MAX_CACHE_ITEMS) {
      const keys = [...txCache.keys()].slice(0, txCache.size - MAX_CACHE_ITEMS);
      keys.forEach((key) => txCache.delete(key));
    }
    return tx;
  }

  async function fetchRecentTransactions(watchAddress) {
    const signatures = [];
    let before = null;

    for (let page = 0; page < SIGNATURE_PAGE_COUNT; page += 1) {
      try {
        const params = { limit: SIGNATURE_PAGE_LIMIT };
        if (before) params.before = before;
        const pageSignatures = await rpcCall("getSignaturesForAddress", [watchAddress, params]);
        signatures.push(...pageSignatures);
        before = pageSignatures.at(-1)?.signature ?? null;
        if (!before || pageSignatures.length < SIGNATURE_PAGE_LIMIT) break;
        await sleep(120);
      } catch (error) {
        if (!signatures.length) throw error;
        break;
      }
    }

    const clean = signatures.filter((item) => !item.err).slice(0, MAX_TRANSACTION_FETCH);
    const transactions = [];

    for (let index = 0; index < clean.length; index += 4) {
      const batch = clean.slice(index, index + 4);
      const settled = await Promise.allSettled(
        batch.map(async (signatureInfo) => ({
          signatureInfo,
          transaction: await getTransaction(signatureInfo.signature),
        })),
      );

      settled.forEach((result) => {
        if (result.status === "fulfilled" && result.value.transaction) {
          transactions.push(result.value);
        }
      });

      if (index + 4 < clean.length) await sleep(160);
    }

    return transactions;
  }

  async function fetchTokenSupply(mint, options = {}) {
    try {
      const supply = await rpcCall("getTokenSupply", [mint], options);
      return Number(supply?.value?.uiAmountString ?? supply?.value?.uiAmount ?? 0);
    } catch {
      return 0;
    }
  }

  async function fetchTopTokenHolders(mint, priceUsd, tokenSymbol, ignoredOwners = new Set()) {
    try {
      const holderRpcOptions = { fallbackToPublic: false };
      const [largest, supply] = await Promise.all([
        rpcCall("getTokenLargestAccounts", [mint], holderRpcOptions),
        fetchTokenSupply(mint, holderRpcOptions),
      ]);
      const accounts = (largest?.value ?? []).slice(0, MAX_TOP_HOLDERS);
      const accountAddresses = accounts.map((account) => account.address);
      if (!accountAddresses.length) return [];

      const accountInfo = await rpcCall("getMultipleAccounts", [accountAddresses, { encoding: "jsonParsed" }], holderRpcOptions);
      return accounts
        .map((account, index) => {
          const parsedInfo = accountInfo?.value?.[index]?.data?.parsed?.info;
          const owner = parsedInfo?.owner;
          if (!owner || ignoredOwners.has(owner)) return null;
          const tokenAmount = parsedInfo?.tokenAmount ?? account;
          const uiAmount = Number(tokenAmount.uiAmountString ?? tokenAmount.uiAmount ?? account.uiAmountString ?? 0);
          if (!Number.isFinite(uiAmount) || uiAmount <= 0) return null;
          const holderUsd = uiAmount * priceUsd;
          const holderSharePct = supply > 0 ? (uiAmount / supply) * 100 : 0;
          return {
            address: owner,
            holderRank: index + 1,
            holderToken: uiAmount,
            holderUsd,
            holderSharePct,
            tokenSymbol,
            tags: ["holder"],
          };
        })
        .filter(Boolean);
    } catch {
      return [];
    }
  }

  function tokenAmountByMintAndOwner(balances, mint, owner) {
    const balance = balances.find((item) => item.mint === mint && item.owner === owner);
    return balance ? amount(balance) : null;
  }

  function indexedBalanceDeltas(transaction, targetMint, quoteMint) {
    const pre = transaction.meta?.preTokenBalances ?? [];
    const post = transaction.meta?.postTokenBalances ?? [];
    const byIndex = new Map();

    function touch(balance, side) {
      const key = balance.accountIndex;
      if (!byIndex.has(key)) byIndex.set(key, {});
      byIndex.get(key)[side] = balance;
    }

    pre.forEach((balance) => touch(balance, "pre"));
    post.forEach((balance) => touch(balance, "post"));

    const owners = new Map();
    byIndex.forEach(({ pre: preBalance, post: postBalance }) => {
      const mint = postBalance?.mint ?? preBalance?.mint;
      if (![targetMint, quoteMint, WSOL_MINT, USDC_MINT].includes(mint)) return;

      const owner = postBalance?.owner ?? preBalance?.owner;
      if (!owner) return;

      if (!owners.has(owner)) owners.set(owner, { owner, targetDelta: 0, quoteDelta: 0 });
      const item = owners.get(owner);
      const delta = amount(postBalance) - amount(preBalance);
      if (mint === targetMint) item.targetDelta += delta;
      if (mint === quoteMint || mint === WSOL_MINT || mint === USDC_MINT) item.quoteDelta += delta;
    });

    return [...owners.values()];
  }

  function summarizeGenericTrade(signatureInfo, transaction, context) {
    const preTarget = tokenAmountByMintAndOwner(transaction.meta?.preTokenBalances ?? [], context.targetMint, context.poolOwner);
    const postTarget = tokenAmountByMintAndOwner(transaction.meta?.postTokenBalances ?? [], context.targetMint, context.poolOwner);
    if (preTarget !== null && postTarget !== null) {
      const poolTargetDelta = postTarget - preTarget;
      if (Math.abs(poolTargetDelta) > 0.000001) {
        const tokenAmount = Math.abs(poolTargetDelta);
        return buildTrade({
          signatureInfo,
          transaction,
          side: poolTargetDelta < 0 ? "buy" : "sell",
          tokenAmount,
          quoteAmount: 0,
          quoteUsd: tokenAmount * context.priceUsd,
          priceUsd: context.priceUsd,
          tokenSymbol: context.tokenSymbol,
          wallet: firstSigner(transaction),
        });
      }
    }

    const signers = signerSet(transaction);
    const deltas = indexedBalanceDeltas(transaction, context.targetMint, context.quoteMint);
    const candidates = deltas
      .filter((item) => Math.abs(item.targetDelta) > 0.000001)
      .filter((item) => signers.has(item.owner));

    const selected = candidates[0];
    if (!selected) return null;

    const side = selected.targetDelta > 0 ? "buy" : "sell";
    const tokenAmount = Math.abs(selected.targetDelta);
    const quoteAmount = Math.abs(selected.quoteDelta);
    return buildTrade({
      signatureInfo,
      transaction,
      side,
      tokenAmount,
      quoteAmount,
      quoteUsd: tokenAmount * context.priceUsd,
      priceUsd: context.priceUsd,
      tokenSymbol: context.tokenSymbol,
      wallet: selected.owner,
    });
  }

  function buildTrade({ signatureInfo, transaction, side, tokenAmount, quoteAmount, quoteUsd, priceUsd, tokenSymbol, wallet }) {
    const blockTime = transaction.blockTime ?? signatureInfo.blockTime ?? Math.floor(Date.now() / 1000);
    const quoteUsdValue = Number.isFinite(quoteUsd) && quoteUsd > 0 ? quoteUsd : tokenAmount * priceUsd;
    return {
      signature: signatureInfo.signature,
      slot: signatureInfo.slot,
      blockTime,
      isoTime: new Date(blockTime * 1000).toISOString(),
      hourUtc: new Date(blockTime * 1000).getUTCHours(),
      wallet,
      side,
      tokenAmount,
      tokenSymbol,
      quoteUsd: quoteUsdValue,
      priceUsd: tokenAmount > 0 ? quoteUsdValue / tokenAmount : priceUsd,
      feeLamports: transaction.meta?.fee ?? null,
    };
  }

  function whaleThresholds(pair, solPriceUsd = 0) {
    const price = Number(solPriceUsd) || 0;
    return {
      solPriceUsd: price,
      whaleSol: WHALE_SOL_THRESHOLD,
      candidateSol: WATCH_SOL_THRESHOLD,
      holderSol: HOLDER_WHALE_SOL_THRESHOLD,
      whaleUsd: price > 0 ? WHALE_SOL_THRESHOLD * price : Number.POSITIVE_INFINITY,
      candidateUsd: price > 0 ? WATCH_SOL_THRESHOLD * price : Number.POSITIVE_INFINITY,
      holderUsd: price > 0 ? HOLDER_WHALE_SOL_THRESHOLD * price : Number.POSITIVE_INFINITY,
      priceSource: price > 0 ? "dexscreener-sol" : "unavailable",
    };
  }

  function walletSolStats(wallet, thresholds) {
    const volumeUsd = wallet.volumeUsd ?? ((wallet.buyUsd ?? 0) + (wallet.sellUsd ?? 0));
    const netUsd = (wallet.buyUsd ?? 0) - (wallet.sellUsd ?? 0);
    const holderUsd = wallet.holderUsd ?? 0;
    return {
      buySol: usdToSol(wallet.buyUsd ?? 0, thresholds.solPriceUsd),
      sellSol: usdToSol(wallet.sellUsd ?? 0, thresholds.solPriceUsd),
      volumeSol: usdToSol(volumeUsd, thresholds.solPriceUsd),
      netSol: usdToSol(netUsd, thresholds.solPriceUsd),
      holderSol: usdToSol(holderUsd, thresholds.solPriceUsd),
      volumeUsd,
      netUsd,
      holderUsd,
    };
  }

  function tradeTierLabel(prefix, buySol, sellSol) {
    if (buySol > sellSol * 1.15) return `${prefix} BUY`;
    if (sellSol > buySol * 1.15) return `${prefix} SELL`;
    return `${prefix} MIX`;
  }

  function whaleTierForWallet(wallet, thresholds) {
    const stats = walletSolStats(wallet, thresholds);
    const { buySol, sellSol, volumeSol, holderSol, volumeUsd, holderUsd } = stats;
    const hasSolPrice = thresholds.solPriceUsd > 0;
    const holderTagged = wallet.tags?.includes("holder") || holderUsd > 0;

    if (holderTagged && holderSol >= thresholds.holderSol) {
      return {
        tier: "whale",
        label: "HOLDER",
        reason: holderUsd ? `${solNotionalLabel(holderUsd, thresholds)} holder balance` : "top holder account",
      };
    }

    if (hasSolPrice && (buySol >= thresholds.whaleSol || sellSol >= thresholds.whaleSol)) {
      return {
        tier: "whale",
        label: tradeTierLabel("WHALE", buySol, sellSol),
        reason: `${compactSol(buySol)} bought / ${compactSol(sellSol)} sold; ${solNotionalLabel(volumeUsd, thresholds)} parsed volume`,
      };
    }

    if (holderTagged && holderSol >= thresholds.candidateSol) {
      return {
        tier: "candidate",
        label: "HOLDER WATCH",
        reason: `${solNotionalLabel(holderUsd, thresholds)} holder balance below ${thresholds.whaleSol} SOL`,
      };
    }

    if (hasSolPrice && (buySol >= thresholds.candidateSol || sellSol >= thresholds.candidateSol || volumeSol >= thresholds.candidateSol)) {
      return {
        tier: "candidate",
        label: tradeTierLabel("WATCH", buySol, sellSol),
        reason: `${compactSol(buySol)} bought / ${compactSol(sellSol)} sold; below ${thresholds.whaleSol} SOL per-side whale threshold`,
      };
    }

    return {
      tier: "noise",
      label: holderTagged ? "HOLDER" : "SMALL",
      reason: `${solNotionalLabel(holderTagged ? holderUsd : volumeUsd, thresholds)} below ${thresholds.whaleSol} SOL whale threshold`,
    };
  }

  function classifyWallet(wallet, thresholds = whaleThresholds(null, 0)) {
    const stats = walletSolStats(wallet, thresholds);
    const { buySol, sellSol, volumeSol, holderSol } = stats;
    const hasSolPrice = thresholds.solPriceUsd > 0;
    if (wallet.tags?.includes("holder")) {
      if (holderSol >= thresholds.holderSol) return "whale holder";
      if (holderSol >= thresholds.candidateSol) return "holder watch";
      return "holder";
    }
    if (hasSolPrice && (buySol >= thresholds.whaleSol || sellSol >= thresholds.whaleSol) && wallet.trades >= 1) {
      return buySol >= sellSol ? "whale accumulation" : "whale distribution";
    }
    if (hasSolPrice && (buySol >= thresholds.candidateSol || sellSol >= thresholds.candidateSol || volumeSol >= thresholds.candidateSol) && wallet.trades >= 1) {
      return buySol >= sellSol ? "watch accumulation" : "watch distribution";
    }
    if (wallet.buys > wallet.sells && wallet.buyUsd > wallet.sellUsd * 1.25) return "accumulation";
    if (wallet.sells > wallet.buys && wallet.sellUsd > wallet.buyUsd * 1.25) return "distribution";
    return "rotation";
  }

  function formatUtcHour(hour) {
    return `${String(hour).padStart(2, "0")}:00`;
  }

  function formatUtcDateTime(blockTime) {
    return new Date(blockTime * 1000).toLocaleString("en-GB", { hour12: false, timeZone: "UTC" }) + " UTC";
  }

  function buildSideHourStats(sideTrades) {
    const byHour = new Map();
    sideTrades.forEach((trade) => {
      if (!byHour.has(trade.hourUtc)) {
        byHour.set(trade.hourUtc, { hour: trade.hourUtc, label: formatUtcHour(trade.hourUtc), count: 0, amount: 0, usd: 0 });
      }
      const item = byHour.get(trade.hourUtc);
      item.count += 1;
      item.amount += trade.tokenAmount;
      item.usd += trade.quoteUsd;
    });

    return [...byHour.values()].sort((a, b) => b.count - a.count || b.usd - a.usd || a.hour - b.hour);
  }

  function formatHabitualHours(hourStats) {
    return hourStats.length ? hourStats.slice(0, 3).map((item) => `${item.label} (${item.count})`).join(" / ") : "n/a";
  }

  function averageGapMinutes(walletTrades) {
    if (walletTrades.length < 2) return 0;
    const ascending = [...walletTrades].sort((a, b) => a.blockTime - b.blockTime);
    const gaps = ascending.slice(1).map((trade, index) => trade.blockTime - ascending[index].blockTime);
    const averageSeconds = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
    return Math.max(1, Math.round(averageSeconds / 60));
  }

  function tradeView(trade, thresholds = null) {
    return {
      side: trade.side,
      amount: trade.tokenAmount,
      usd: trade.quoteUsd,
      solEq: thresholds ? usdToSol(trade.quoteUsd, thresholds.solPriceUsd) : 0,
      price: trade.priceUsd,
      hourUtc: trade.hourUtc,
      hourLabel: formatUtcHour(trade.hourUtc),
      time: formatUtcDateTime(trade.blockTime),
      isoTime: trade.isoTime,
      signature: trade.signature,
    };
  }

  function largestTrade(sideTrades) {
    return [...sideTrades].sort((a, b) => b.quoteUsd - a.quoteUsd)[0] ?? null;
  }

  function buildWalletDetails(walletRows, trades, tokenSymbol, currentPrice, thresholds) {
    return walletRows.reduce((details, wallet) => {
      const walletTrades = trades
        .filter((trade) => trade.wallet === wallet.address)
        .sort((a, b) => b.blockTime - a.blockTime);

      if (!walletTrades.length && wallet.tags?.includes("holder")) {
        const holderRank = wallet.holderRank ?? 0;
        const holderToken = wallet.holderToken ?? wallet.netIo ?? 0;
        const holderUsd = wallet.holderUsd ?? holderToken * currentPrice;
        const holderSol = usdToSol(holderUsd, thresholds.solPriceUsd);
        const holderSharePct = wallet.holderSharePct ?? 0;
        const followScore = wallet.score ?? clamp(82 - holderRank, 55, 96);
        details[wallet.address] = {
          address: wallet.address,
          tokenSymbol,
          holderRank,
          holderToken,
          holderUsd,
          holderSharePct,
          whaleTier: wallet.whaleTier ?? "whale",
          whaleLabel: wallet.whaleLabel ?? "HOLDER",
          whaleReason: wallet.whaleReason ?? `${solNotionalLabel(holderUsd, thresholds)} holder balance`,
          followScore,
          verdict: "VERIFY HOLDER",
          verdictTone: "warning",
          primaryPattern: "whale holder",
          signals: ["WHALE HOLDER", "NO RECENT TRADE"],
          buys: 0,
          sells: 0,
          buySellRatio: 0,
          buyToken: 0,
          sellToken: 0,
          netToken: holderToken,
          buyUsd: 0,
          sellUsd: 0,
          volumeUsd: holderUsd,
          buySol: 0,
          sellSol: 0,
          volumeSol: holderSol,
          avgBuy: 0,
          avgSell: 0,
          avgSizeUsd: 0,
          estimatedEdgeUsd: 0,
          realizedEdgeUsd: 0,
          openEdgeUsd: 0,
          activeHours: [],
          hourVector: Array.from({ length: 24 }, (_, hour) => ({ hour, buys: 0, sells: 0 })),
          spreadMinutes: 0,
          avgMinutesBetweenTrades: 0,
          buyHours: [],
          sellHours: [],
          habitualBuyHours: "n/a",
          habitualSellHours: "n/a",
        largestBuy: null,
        largestSell: null,
          firstSeenTime: "n/a",
          lastSeenTime: "n/a",
          sampleLabel: `holder #${holderRank}`,
          netUsdPressure: 0,
          activityBias: "top holder",
          patternNotes: [
            `Top holder rank #${holderRank} from getTokenLargestAccounts.`,
            `Balance ${compact(holderToken)} ${tokenSymbol}, approximately ${solNotionalLabel(holderUsd, thresholds)} at current pair price.`,
            holderSharePct ? `Approx holder share ${holderSharePct.toFixed(3)}% of supply.` : "Supply share unavailable from public RPC.",
            whaleThresholdLabel(thresholds),
            "No recent buy/sell was parsed for this owner in the current live trade window.",
          ],
          lastAction: "HOLD",
          lastActionTime: "n/a",
          summary: "Large holder detected from token-holder RPC, not necessarily an active trader in the current window. Verify on explorer before following.",
          trades: [],
          buyTrades: [],
          sellTrades: [],
        };
        return details;
      }

      const buys = walletTrades.filter((trade) => trade.side === "buy");
      const sells = walletTrades.filter((trade) => trade.side === "sell");
      const buyToken = buys.reduce((sum, trade) => sum + trade.tokenAmount, 0);
      const sellToken = sells.reduce((sum, trade) => sum + trade.tokenAmount, 0);
      const buyUsd = buys.reduce((sum, trade) => sum + trade.quoteUsd, 0);
      const sellUsd = sells.reduce((sum, trade) => sum + trade.quoteUsd, 0);
      const volumeUsd = buyUsd + sellUsd;
      const buySol = usdToSol(buyUsd, thresholds.solPriceUsd);
      const sellSol = usdToSol(sellUsd, thresholds.solPriceUsd);
      const volumeSol = usdToSol(volumeUsd, thresholds.solPriceUsd);
      const avgBuy = buyToken > 0 ? buyUsd / buyToken : 0;
      const avgSell = sellToken > 0 ? sellUsd / sellToken : 0;
      const avgSizeUsd = walletTrades.length ? volumeUsd / walletTrades.length : 0;
      const netToken = buyToken - sellToken;
      const pairedToken = Math.min(buyToken, sellToken);
      const realizedEdgeUsd = pairedToken > 0 && avgBuy > 0 && avgSell > 0 ? pairedToken * (avgSell - avgBuy) : 0;
      const openEdgeUsd = netToken > 0 && avgBuy > 0 ? netToken * (currentPrice - avgBuy) : 0;
      const estimatedEdgeUsd = realizedEdgeUsd + openEdgeUsd;
      const buySellRatio = sells.length ? buys.length / sells.length : buys.length || 0;
      const firstBlock = Math.min(...walletTrades.map((trade) => trade.blockTime));
      const lastBlock = Math.max(...walletTrades.map((trade) => trade.blockTime));
      const spreadMinutes = Number.isFinite(firstBlock) ? Math.max(1, Math.round((lastBlock - firstBlock) / 60)) : 0;
      const avgMinutesBetweenTrades = averageGapMinutes(walletTrades);
      const buyHourStats = buildSideHourStats(buys);
      const sellHourStats = buildSideHourStats(sells);
      const largestBuy = largestTrade(buys);
      const largestSell = largestTrade(sells);
      const hourCounts = new Map();

      walletTrades.forEach((trade) => {
        hourCounts.set(trade.hourUtc, (hourCounts.get(trade.hourUtc) ?? 0) + 1);
      });

      const activeHours = [...hourCounts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0] - b[0])
        .map(([hour]) => `${String(hour).padStart(2, "0")}:00`);
      const hourVector = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        buys: buys.filter((trade) => trade.hourUtc === hour).length,
        sells: sells.filter((trade) => trade.hourUtc === hour).length,
      }));
      const lastTrade = walletTrades[0];
      const edgeBonus = estimatedEdgeUsd > 0 ? Math.min(18, estimatedEdgeUsd / 12) : Math.max(-16, estimatedEdgeUsd / 10);
      const repeatBonus = buys.length >= 3 ? 8 : buys.length >= 2 ? 4 : 0;
      const profitTakerBonus = avgSell > avgBuy && sells.length ? 8 : 0;
      const sellDominant = sells.length > buys.length && sellUsd >= buyUsd * 0.85;
      const distributionPenalty = sellUsd > buyUsd * 1.35 ? -18 : sellDominant ? -14 : 0;
      const weakEdgePenalty = estimatedEdgeUsd < 0 && netToken <= Math.max(1, buyToken * 0.1) ? -10 : 0;
      const tier = whaleTierForWallet({ ...wallet, buyUsd, sellUsd, volumeUsd }, thresholds);
      const whaleTier = wallet.whaleTier ?? tier.tier;
      const whaleLabel = wallet.whaleLabel ?? tier.label;
      const whaleReason = wallet.whaleReason ?? tier.reason;
      const whaleBonus = whaleTier === "whale" ? 10 : whaleTier === "candidate" ? 4 : 0;
      const followScore = Math.round(
        clamp(
          38 +
            walletTrades.length * 6 +
            Math.min(18, volumeUsd / 120) +
            edgeBonus +
            repeatBonus +
            profitTakerBonus +
            whaleBonus +
            distributionPenalty +
            weakEdgePenalty,
          0,
          99,
        ),
      );
      const followReady = followScore >= 75 && estimatedEdgeUsd > 0 && netToken > 0 && buys.length >= sells.length;
      const verdict = followReady ? "FOLLOW CANDIDATE" : followScore >= 55 ? "WATCH" : "AVOID";
      const verdictTone = followScore >= 75 ? "positive" : followScore >= 58 ? "warning" : "negative";
      const signals = [];

      if (whaleTier === "whale") signals.push("WHALE");
      if (whaleTier === "candidate") signals.push("WATCH");
      if (followReady) signals.push("SMART FOLLOW");
      if (netToken > 0 && buys.length >= sells.length) signals.push("ACCUMULATION");
      if (netToken < 0 && sells.length >= buys.length) signals.push("DISTRIBUTION");
      if (buys.length >= 3) signals.push("REPEATED BUYER");
      if (avgSell > avgBuy && sells.length) signals.push("PROFIT TAKER");
      if (sellDominant && !signals.includes("PROFIT TAKER")) signals.push("ROTATION SELLER");
      if (followScore < 45 || estimatedEdgeUsd < -50) signals.push("AVOID");
      if (!signals.length) signals.push("NEUTRAL");

      const patternNotes = [
        `Sample ${walletTrades.length} tx over ${spreadMinutes} min from public RPC.`,
      ];
      if (buyHourStats[0]?.count > 1) {
        patternNotes.push(`Buy cluster repeats around ${buyHourStats[0].label} UTC.`);
      }
      if (sellHourStats[0]?.count > 1) {
        patternNotes.push(`Sell cluster repeats around ${sellHourStats[0].label} UTC.`);
      }
      if (avgMinutesBetweenTrades) {
        patternNotes.push(`Average gap between parsed trades is ${avgMinutesBetweenTrades} min.`);
      }
      if (avgSell > avgBuy && sells.length && buys.length) {
        patternNotes.push(`Average sell is above average buy, indicating realized edge in this window.`);
      }
      if (netToken > 0 && estimatedEdgeUsd > 0) {
        patternNotes.push(`Still net long with positive open edge at current price.`);
      }
      if (whaleTier !== "noise") {
        patternNotes.push(`${whaleLabel}: ${whaleReason}. Threshold ${thresholds.whaleSol} SOL whale / ${thresholds.candidateSol} SOL watch.`);
      }
      if (sellUsd > buyUsd * 1.35) {
        patternNotes.push(`Sell notional dominates; avoid copy-buying without fresh confirmation.`);
      }
      if (buys.length === 1 && sells.length === 0) {
        patternNotes.push(`Single detected buy; pattern confidence is low until more history appears.`);
      }

      const primaryPattern = signals.includes("SMART FOLLOW")
        ? "smart follow"
        : signals.includes("PROFIT TAKER")
          ? "profit taker"
          : signals.includes("ACCUMULATION")
            ? "accumulation"
            : signals.includes("DISTRIBUTION")
              ? "distribution"
              : wallet.pattern;

      details[wallet.address] = {
        address: wallet.address,
        tokenSymbol,
        followScore,
        verdict,
        verdictTone,
        primaryPattern,
        whaleTier,
        whaleLabel,
        whaleReason,
        signals,
        buys: buys.length,
        sells: sells.length,
        buySellRatio,
        buyToken,
        sellToken,
        netToken,
        buyUsd,
        sellUsd,
        volumeUsd,
        buySol,
        sellSol,
        volumeSol,
        avgBuy,
        avgSell,
        avgSizeUsd,
        estimatedEdgeUsd,
        realizedEdgeUsd,
        openEdgeUsd,
        activeHours,
        hourVector,
        spreadMinutes,
        avgMinutesBetweenTrades,
        buyHours: buyHourStats,
        sellHours: sellHourStats,
        habitualBuyHours: formatHabitualHours(buyHourStats),
        habitualSellHours: formatHabitualHours(sellHourStats),
        largestBuy: largestBuy ? tradeView(largestBuy, thresholds) : null,
        largestSell: largestSell ? tradeView(largestSell, thresholds) : null,
        firstSeenTime: Number.isFinite(firstBlock) ? formatUtcDateTime(firstBlock) : "n/a",
        lastSeenTime: Number.isFinite(lastBlock) ? formatUtcDateTime(lastBlock) : "n/a",
        sampleLabel: `${walletTrades.length} tx / ${spreadMinutes} min`,
        netUsdPressure: buyUsd - sellUsd,
        activityBias: buyUsd > sellUsd * 1.2 ? "buy pressure" : sellUsd > buyUsd * 1.2 ? "sell pressure" : "mixed rotation",
        patternNotes,
        lastAction: lastTrade ? lastTrade.side.toUpperCase() : "NONE",
        lastActionTime: lastTrade ? formatUtcDateTime(lastTrade.blockTime) : "n/a",
        summary:
          verdict === "FOLLOW CANDIDATE"
            ? `Positive edge ${signedUsd(estimatedEdgeUsd)} with repeated ${tokenSymbol} activity in this whale-focused parsed window.`
            : verdict === "WATCH"
              ? `Useful whale/watch activity, but edge/consistency is not strong enough to copy blindly.`
              : `Weak, small, or negative edge in the current parsed window; avoid chasing this wallet.`,
        trades: walletTrades.map((trade) => tradeView(trade, thresholds)),
        buyTrades: buys.map((trade) => tradeView(trade, thresholds)),
        sellTrades: sells.map((trade) => tradeView(trade, thresholds)),
      };
      return details;
    }, {});
  }

  function mergeHolderRows(activeRows, topHolders, thresholds) {
    const byAddress = new Map(activeRows.map((wallet) => [wallet.address, wallet]));

    topHolders.forEach((holder) => {
      const holderScore = Math.round(clamp(92 - holder.holderRank, 62, 96));
      const existing = byAddress.get(holder.address);
      if (existing) {
        existing.holderRank = holder.holderRank;
        existing.holderToken = holder.holderToken;
        existing.holderUsd = holder.holderUsd;
        existing.holderSharePct = holder.holderSharePct;
        existing.volumeUsd = Math.max(existing.volumeUsd, holder.holderUsd);
        existing.score = Math.max(existing.score, holderScore);
        existing.tags = [...new Set([...existing.tags, "holder"])];
        const tier = whaleTierForWallet(existing, thresholds);
        existing.whaleTier = tier.tier;
        existing.whaleLabel = tier.label;
        existing.whaleReason = tier.reason;
        existing.tags = [
          ...new Set([
            ...existing.tags,
            tier.tier === "whale" ? "whale" : null,
            tier.tier === "candidate" ? "candidate" : null,
          ].filter(Boolean)),
        ];
        return;
      }

      const tier = whaleTierForWallet({ ...holder, buyUsd: 0, sellUsd: 0, volumeUsd: holder.holderUsd }, thresholds);
      const tags = [
        "holder",
        tier.tier === "whale" ? "whale" : null,
        tier.tier === "candidate" ? "candidate" : null,
      ].filter(Boolean);
      byAddress.set(holder.address, {
        address: holder.address,
        buys: 0,
        sells: 0,
        buyUsd: 0,
        sellUsd: 0,
        buyToken: 0,
        sellToken: 0,
        volumeUsd: holder.holderUsd,
        buySol: 0,
        sellSol: 0,
        volumeSol: usdToSol(holder.holderUsd, thresholds.solPriceUsd),
        netIo: holder.holderToken,
        hours: `holder #${holder.holderRank}`,
        activityLabel: `holder #${holder.holderRank}`,
        lastSeenTime: "Holder snapshot from public RPC; no recent trade parsed.",
        pattern: tier.tier === "whale" ? "whale holder" : tier.tier === "candidate" ? "holder watch" : "holder",
        score: holderScore,
        holderRank: holder.holderRank,
        holderToken: holder.holderToken,
        holderUsd: holder.holderUsd,
        holderSharePct: holder.holderSharePct,
        whaleTier: tier.tier,
        whaleLabel: tier.label,
        whaleReason: tier.reason,
        tags,
      });
    });

    return [...byAddress.values()]
      .sort((a, b) => {
        const bUsd = Math.max(b.volumeUsd ?? 0, b.holderUsd ?? 0);
        const aUsd = Math.max(a.volumeUsd ?? 0, a.holderUsd ?? 0);
        return bUsd - aUsd || (b.trades ?? 0) - (a.trades ?? 0) || b.score - a.score;
      })
      .slice(0, MAX_WALLET_ROWS);
  }

  function aggregateTrades(trades, tokenSymbol, priceUsd, pair, topHolders = [], solPriceUsd = 0) {
    const thresholds = whaleThresholds(pair, solPriceUsd);
    const totals = {
      buys: 0,
      sells: 0,
      buyUsd: 0,
      sellUsd: 0,
      buyToken: 0,
      sellToken: 0,
    };
    const wallets = new Map();
    const hourly = Array.from({ length: 24 }, (_, hour) => [hour, 0, 0]);

    trades.forEach((trade) => {
      const isBuy = trade.side === "buy";
      if (isBuy) {
        totals.buys += 1;
        totals.buyUsd += trade.quoteUsd;
        totals.buyToken += trade.tokenAmount;
        hourly[trade.hourUtc][1] += 1;
      } else {
        totals.sells += 1;
        totals.sellUsd += trade.quoteUsd;
        totals.sellToken += trade.tokenAmount;
        hourly[trade.hourUtc][2] += 1;
      }

      if (!wallets.has(trade.wallet)) {
        wallets.set(trade.wallet, {
          address: trade.wallet,
          buys: 0,
          sells: 0,
          buyUsd: 0,
          sellUsd: 0,
          buyToken: 0,
          sellToken: 0,
          firstHour: trade.hourUtc,
          lastHour: trade.hourUtc,
          firstBlock: trade.blockTime,
          lastBlock: trade.blockTime,
          trades: 0,
          tags: [],
        });
      }

      const wallet = wallets.get(trade.wallet);
      wallet.trades += 1;
      wallet.firstHour = Math.min(wallet.firstHour, trade.hourUtc);
      wallet.lastHour = Math.max(wallet.lastHour, trade.hourUtc);
      wallet.firstBlock = Math.min(wallet.firstBlock, trade.blockTime);
      wallet.lastBlock = Math.max(wallet.lastBlock, trade.blockTime);
      if (isBuy) {
        wallet.buys += 1;
        wallet.buyUsd += trade.quoteUsd;
        wallet.buyToken += trade.tokenAmount;
      } else {
        wallet.sells += 1;
        wallet.sellUsd += trade.quoteUsd;
        wallet.sellToken += trade.tokenAmount;
      }
    });

    const activeWalletCount = wallets.size;
    const activeRows = [...wallets.values()]
      .map((wallet) => {
        const netToken = wallet.buyToken - wallet.sellToken;
        const volumeUsd = wallet.buyUsd + wallet.sellUsd;
        const buySol = usdToSol(wallet.buyUsd, thresholds.solPriceUsd);
        const sellSol = usdToSol(wallet.sellUsd, thresholds.solPriceUsd);
        const volumeSol = usdToSol(volumeUsd, thresholds.solPriceUsd);
        const pattern = classifyWallet(wallet, thresholds);
        const score = Math.min(99, Math.round(42 + wallet.trades * 8 + Math.min(32, volumeUsd / 120)));
        const tier = whaleTierForWallet({ ...wallet, volumeUsd }, thresholds);
        const tags = [
          pattern,
          tier.tier === "whale" ? "whale" : null,
          tier.tier === "candidate" ? "candidate" : null,
          pattern.includes("buy") || pattern.includes("accumulation") ? "accumulation" : null,
          pattern.includes("sell") || pattern.includes("distribution") ? "distribution" : null,
        ].filter(Boolean);
        return {
          address: wallet.address,
          buys: wallet.buys,
          sells: wallet.sells,
          volumeUsd,
          buySol,
          sellSol,
          volumeSol,
          netIo: netToken,
          hours: `${wallet.trades} tx · ${formatUtcHour(wallet.lastHour)} UTC`,
          activityLabel: `${wallet.trades} tx · last ${new Date(wallet.lastBlock * 1000).toLocaleTimeString("en-GB", { hour12: false, timeZone: "UTC" })} UTC`,
          firstSeenTime: formatUtcDateTime(wallet.firstBlock),
          lastSeenTime: formatUtcDateTime(wallet.lastBlock),
          pattern,
          score,
          whaleTier: tier.tier,
          whaleLabel: tier.label,
          whaleReason: tier.reason,
          tags: [...new Set(tags)],
        };
      })
      .sort((a, b) => {
        const tierRank = { whale: 3, candidate: 2, noise: 1 };
        return (tierRank[b.whaleTier] ?? 0) - (tierRank[a.whaleTier] ?? 0) || b.volumeUsd - a.volumeUsd;
      })
      .slice(0, MAX_ACTIVE_WALLET_ROWS);
    const walletRows = mergeHolderRows(activeRows, topHolders, thresholds);
    const walletDetails = buildWalletDetails(walletRows, trades, tokenSymbol, priceUsd, thresholds);

    walletRows.forEach((wallet) => {
      const detail = walletDetails[wallet.address];
      if (!detail) return;
      wallet.score = detail.followScore;
      wallet.pattern = detail.primaryPattern;
      wallet.tags = [
        ...new Set([
          ...wallet.tags,
          wallet.whaleTier === "whale" ? "whale" : null,
          wallet.whaleTier === "candidate" ? "candidate" : null,
          detail.primaryPattern,
          detail.signals.includes("WHALE") || detail.signals.includes("WHALE HOLDER") ? "whale" : null,
          detail.signals.includes("ACCUMULATION") ? "accumulation" : null,
          detail.signals.includes("DISTRIBUTION") ? "distribution" : null,
        ].filter(Boolean)),
      ];
    });

    const netToken = totals.buyToken - totals.sellToken;
    const netUsd = totals.buyUsd - totals.sellUsd;
    const holderOnlyCount = walletRows.filter((wallet) => wallet.tags.includes("holder") && !wallet.buys && !wallet.sells).length;
    const trackedWallets = walletRows.length;
    const whaleRows = walletRows.filter((wallet) => wallet.whaleTier === "whale" || wallet.tags.includes("whale"));
    const whaleBuyRows = whaleRows.filter((wallet) => (wallet.buySol ?? 0) >= thresholds.whaleSol);
    const whaleSellRows = whaleRows.filter((wallet) => (wallet.sellSol ?? 0) >= thresholds.whaleSol);
    const candidateRows = walletRows.filter((wallet) => wallet.whaleTier === "candidate" || wallet.tags.includes("candidate"));
    const whaleVolumeUsd = whaleRows.reduce((sum, wallet) => sum + Math.max(wallet.volumeUsd ?? 0, wallet.holderUsd ?? 0), 0);
    const whaleVolumeSol = usdToSol(whaleVolumeUsd, thresholds.solPriceUsd);
    const whaleNetToken = whaleRows.reduce((sum, wallet) => sum + (wallet.netIo ?? 0), 0);
    const whaleNetUsd = whaleRows.reduce((sum, wallet) => sum + ((wallet.buyUsd ?? 0) - (wallet.sellUsd ?? 0)), 0);
    const whaleNetSol = usdToSol(whaleNetUsd, thresholds.solPriceUsd);
    const watchVolumeUsd = candidateRows.reduce((sum, wallet) => sum + Math.max(wallet.volumeUsd ?? 0, wallet.holderUsd ?? 0), 0);
    const watchVolumeSol = usdToSol(watchVolumeUsd, thresholds.solPriceUsd);
    const peakHour = hourly
      .map(([hour, buys, sells]) => ({ hour, total: buys + sells }))
      .sort((a, b) => b.total - a.total)[0]?.hour;
    const confidence = Math.min(92, Math.round(35 + trades.length * 1.15 + Math.min(22, trackedWallets * 1.6)));
    const volumeUsd = Number(pair.volume?.h24 ?? totals.buyUsd + totals.sellUsd);
    const txns = pair.txns ?? {};

    return {
      totals,
      wallets: walletRows,
      walletDetails,
      hourly,
      kpis: [
        { label: "Ballenas foco", value: String(whaleRows.length), delta: `${whaleBuyRows.length} buy / ${whaleSellRows.length} sell >=${thresholds.whaleSol} SOL`, tone: whaleRows.length ? "positive" : "warning" },
        { label: "Whale flow", value: `${signedCompact(whaleNetToken, ` ${tokenSymbol}`)}`, delta: thresholds.solPriceUsd ? signedCompact(whaleNetSol, " SOL eq") : "SOL price unavailable", tone: whaleNetToken >= 0 ? "positive" : "negative" },
        { label: "Whale volume", value: thresholds.solPriceUsd ? compactSol(whaleVolumeSol) : compactUsd(whaleVolumeUsd), delta: `${compactSol(watchVolumeSol)} watch / ${whaleThresholdLabel(thresholds)}`, tone: whaleVolumeSol >= thresholds.whaleSol ? "positive" : "warning" },
        { label: "Muestra live", value: `${totals.buys}/${totals.sells}`, delta: `${activeWalletCount} signers parsed`, tone: "warning" },
        { label: "Volumen 24h", value: compactUsd(volumeUsd), delta: `${compactUsd(Number(pair.liquidity?.usd ?? 0))} liq`, tone: "positive" },
        { label: "Confianza", value: `${confidence}/100`, delta: peakHour === undefined ? "syncing" : `${String(peakHour).padStart(2, "0")}:00 UTC peak`, tone: whaleRows.length ? "positive" : "warning" },
      ],
      whaleStats: {
        whales: whaleRows.length,
        buyWhales: whaleBuyRows.length,
        sellWhales: whaleSellRows.length,
        candidates: candidateRows.length,
        holderOnly: holderOnlyCount,
        volumeUsd: whaleVolumeUsd,
        volumeSol: whaleVolumeSol,
        watchVolumeUsd,
        watchVolumeSol,
        netToken: whaleNetToken,
        netUsd: whaleNetUsd,
        netSol: whaleNetSol,
        thresholds,
      },
    };
  }

  function buildPatterns(aggregate, tokenSymbol) {
    const { totals, wallets, hourly, whaleStats } = aggregate;
    const netUsd = totals.buyUsd - totals.sellUsd;
    const topWallet = wallets.find((wallet) => wallet.whaleTier === "whale") ?? wallets.find((wallet) => wallet.whaleTier === "candidate") ?? wallets[0];
    const peak = hourly
      .map(([hour, buy, sell]) => ({ hour, buy, sell, total: buy + sell }))
      .sort((a, b) => b.total - a.total)[0] ?? { hour: 0, buy: 0, sell: 0 };

    const whaleNetUsd = whaleStats?.netUsd ?? netUsd;
    const whaleNetSol = whaleStats?.netSol ?? 0;
    const thresholds = whaleStats?.thresholds ?? whaleThresholds(null, 0);
    const pressureTone = Math.abs(whaleNetSol) < 1 ? "watch" : whaleNetSol > 0 ? "buy" : "sell";
    const walletTone =
      topWallet?.whaleTier === "candidate" || topWallet?.pattern?.includes("watch")
        ? "watch"
        : topWallet?.pattern === "distribution"
          ? "sell"
          : topWallet?.pattern === "rotation"
            ? "watch"
            : "buy";

    return [
      {
        title: "Whale pressure",
        value: thresholds.solPriceUsd ? signedCompact(whaleNetSol, " SOL eq") : signedCompact(whaleNetUsd, " USD eq"),
        copy: `${whaleStats?.buyWhales ?? 0} buy-side and ${whaleStats?.sellWhales ?? 0} sell-side wallets >=${thresholds.whaleSol} SOL. Watch: ${whaleStats?.candidates ?? 0} wallets / ${compactSol(whaleStats?.watchVolumeSol ?? 0)}.`,
        tone: pressureTone,
      },
      {
        title: "Wallet foco",
        value: topWallet ? topWallet.whaleLabel ?? `${topWallet.buys}B/${topWallet.sells}S` : "syncing",
        copy: topWallet
          ? `${topWallet.address.slice(0, 4)}...${topWallet.address.slice(-4)} / ${topWallet.whaleReason ?? `${compactUsd(topWallet.volumeUsd)} parsed volume`}.`
          : "Waiting for whale/watch attribution from RPC/indexer.",
        tone: walletTone,
      },
      {
        title: "Cluster activo RPC",
        value: `${String(peak.hour).padStart(2, "0")}:00 UTC`,
        copy: `${peak.buy} buys and ${peak.sell} sells in the strongest parsed UTC hour from the recent RPC sample, not a full 24h index.`,
        tone: peak.buy >= peak.sell ? "buy" : "sell",
      },
      {
        title: "Risk read",
        value: tokenSymbol,
        copy: `Whale means >=${thresholds.whaleSol} SOL equivalent; holder coverage still requires dedicated RPC or indexer.`,
        tone: "watch",
      },
    ];
  }

  function buildSignals(aggregate, pairMetaResult, trades) {
    const { totals, wallets, whaleStats } = aggregate;
    const netUsd = totals.buyUsd - totals.sellUsd;
    const scoreBase = Math.min(92, Math.round(40 + trades.length * 1.2));
    const whaleNetUsd = whaleStats?.netUsd ?? netUsd;
    const whaleNetSol = whaleStats?.netSol ?? 0;
    const thresholds = whaleStats?.thresholds ?? whaleThresholds(null, 0);
    const pressureScore = Math.min(96, Math.max(12, Math.round(scoreBase + Math.min(20, Math.abs(whaleNetSol) * 1.5))));
    const topWallet = wallets.find((wallet) => wallet.whaleTier === "whale") ?? wallets.find((wallet) => wallet.whaleTier === "candidate") ?? wallets[0];

    return [
      {
        score: pressureScore,
        title: whaleNetUsd >= 0 ? "Whale accumulation" : "Whale distribution",
        meta: `${pairMetaResult.poolLabel}`,
        copy: thresholds.solPriceUsd
          ? `${signedCompact(whaleNetSol, " SOL eq")} from wallets with buy or sell side >=${thresholds.whaleSol} SOL; ${whaleStats?.candidates ?? 0} watch wallets are below whale threshold.`
          : "SOL price unavailable; whale classification is locked until conversion returns.",
      },
      {
        score: Math.min(90, Math.round(35 + (whaleStats?.whales ?? 0) * 12 + (whaleStats?.candidates ?? 0) * 5)),
        title: "Whale coverage",
        meta: `${whaleStats?.buyWhales ?? 0} buy / ${whaleStats?.sellWhales ?? 0} sell / ${whaleStats?.candidates ?? 0} watch`,
        copy: topWallet ? `Top focus ${topWallet.address.slice(0, 4)}...${topWallet.address.slice(-4)}.` : "Waiting for whale attribution.",
      },
      {
        score: Math.min(88, Math.round(Number(pairMetaResult.pair.txns?.h1?.buys ?? 0) + Number(pairMetaResult.pair.txns?.h1?.sells ?? 0))),
        title: "DexScreener 1h activity",
        meta: "live pair API",
        copy: `${pairMetaResult.pair.txns?.h1?.buys ?? 0} buys / ${pairMetaResult.pair.txns?.h1?.sells ?? 0} sells in pair feed.`,
      },
      {
        score: 0,
        title: "Execution policy",
        meta: "Risk gate",
        copy: "Dashboard is visual. Hermes/backend controls strategy and any wallet execution through risk gates.",
      },
    ];
  }

  function buildEvents(trades, tokenSymbol) {
    return trades.slice(0, 12).map((trade) => ({
      side: trade.side,
      title: trade.side === "buy" ? `Buy ${tokenSymbol}` : `Sell ${tokenSymbol}`,
      value: `${trade.side === "buy" ? "+" : "-"}${compact(trade.tokenAmount)} ${tokenSymbol}`,
      wallet: `${trade.wallet.slice(0, 4)}...${trade.wallet.slice(-4)}`,
      time: new Date(trade.blockTime * 1000).toLocaleTimeString("en-GB", { hour12: false, timeZone: "UTC" }) + " UTC",
    }));
  }

  function buildBotState(snapshotMeta, parsedTrades) {
    return {
      mode: "DRY_RUN",
      runtime: [
        { label: "Data feed", value: snapshotMeta.providerLabel, tone: snapshotMeta.degraded ? "warning" : "positive" },
        { label: "Parsed txs", value: String(parsedTrades), tone: parsedTrades ? "positive" : "warning" },
        { label: "Refresh", value: "75 sec", tone: "positive" },
        { label: "Risk gate", value: "live locked", tone: "negative" },
        { label: "Route", value: "Jupiter + Raydium next", tone: "warning" },
        { label: "Signer", value: "disabled in UI", tone: "warning" },
      ],
      risk: [
        { label: "Live execution", value: "blocked", state: "blocked" },
        { label: "Provider abuse guard", value: "browser cooldown", state: "locked" },
        { label: "Public RPC", value: snapshotMeta.degraded ? "degraded" : "sample only", state: snapshotMeta.degraded ? "blocked" : "locked" },
        { label: "Max trade", value: "requires backend", state: "locked" },
        { label: "Approval", value: "dashboard gate", state: "locked" },
        { label: "Hermes execute", value: "blocked", state: "blocked" },
      ],
      hermes: [
        { channel: "inbound.recommendation", status: "standby", permission: "recommend only" },
        { channel: "inbound.quote_request", status: "standby", permission: "shared limiter" },
        { channel: "outbound.provider_event", status: "ready", permission: "observe" },
        { channel: "outbound.wallet_signal", status: "ready", permission: "observe" },
        { channel: "execute.trade", status: "blocked", permission: "risk + dashboard gate" },
      ],
      hermesStatus: "READY",
    };
  }

  function buildEmptyLiveData(mint, message, pair) {
    const tokenSymbol = pair?.baseToken?.address === mint ? pair.baseToken.symbol : pair?.quoteToken?.symbol ?? "TOKEN";
    const buyCount = Number(pair?.txns?.h24?.buys ?? 0);
    const sellCount = Number(pair?.txns?.h24?.sells ?? 0);
    const volumeUsd = Number(pair?.volume?.h24 ?? 0);
    const liquidityUsd = Number(pair?.liquidity?.usd ?? 0);
    const priceUsd = Number(pair?.priceUsd ?? 0);
    const netTx = buyCount - sellCount;
    const realPairDataAvailable = Boolean(pair);
    return {
      totals: {
        buys: buyCount,
        sells: sellCount,
        buyUsd: buyCount + sellCount > 0 ? volumeUsd * (buyCount / (buyCount + sellCount)) : 0,
        sellUsd: buyCount + sellCount > 0 ? volumeUsd * (sellCount / (buyCount + sellCount)) : 0,
      },
      whaleStats: {
        whales: 0,
        buyWhales: 0,
        sellWhales: 0,
        candidates: 0,
        holderOnly: 0,
        volumeUsd: 0,
        volumeSol: 0,
        watchVolumeUsd: 0,
        watchVolumeSol: 0,
        netToken: 0,
        netUsd: 0,
        netSol: 0,
        thresholds: whaleThresholds(pair, 0),
      },
      token: {
        symbol: tokenSymbol,
        name: pair?.baseToken?.address === mint ? pair.baseToken.name : pair?.quoteToken?.name ?? "custom mint",
        mint,
        pool: pair ? `${pair.dexId} ${pair.baseToken?.symbol}/${pair.quoteToken?.symbol}`.toUpperCase() : "No pool resolved",
        window: realPairDataAvailable ? `market live ${new Date().toLocaleTimeString("en-GB", { hour12: false })}` : "live degraded",
      },
      kpis: [
        { label: "Precio real", value: priceUsd ? compactUsd(priceUsd) : "n/a", delta: "DexScreener live", tone: realPairDataAvailable ? "positive" : "warning" },
        { label: "Volumen 24h", value: compactUsd(volumeUsd), delta: `${compactUsd(liquidityUsd)} liq`, tone: realPairDataAvailable ? "positive" : "warning" },
        { label: "Tx 24h", value: `${buyCount}/${sellCount}`, delta: "buys/sells reales", tone: buyCount >= sellCount ? "positive" : "negative" },
        { label: "Net tx", value: signedCompact(netTx), delta: "DexScreener direction", tone: netTx >= 0 ? "positive" : "negative" },
        { label: "Whales RPC", value: "0", delta: message, tone: "warning" },
        { label: "Confianza", value: realPairDataAvailable ? "45/100" : "0/100", delta: realPairDataAvailable ? "market-only" : "degraded", tone: realPairDataAvailable ? "warning" : "negative" },
      ],
      wallets: [],
      hourly: Array.from({ length: 24 }, (_, hour) => [hour, 0, 0]),
      patterns: [{ title: realPairDataAvailable ? "Market-only live" : "Live source degraded", value: realPairDataAvailable ? compactUsd(volumeUsd) : "blocked", copy: `${message}. Market data is real; wallet attribution waits for RPC/indexer response.`, tone: "watch" }],
      signals: [{ score: realPairDataAvailable ? 45 : 0, title: "No whale execution signal", meta: realPairDataAvailable ? "real market data" : "degraded", copy: "No trade should be executed without normalized wallet flow." }],
      events: [],
      walletDetails: {},
      bot: buildBotState({ providerLabel: realPairDataAvailable ? "DEXSCREENER LIVE / RPC DEGRADED" : "degraded", degraded: true }, 0),
      source: { degraded: true, message, marketOnly: realPairDataAvailable },
    };
  }

  async function loadTokenSnapshot(mint) {
    let pairContext = null;
    try {
      const pairs = await fetchDexPairs(mint);
      pairContext = pairMeta(selectPair(pairs, mint), mint);
      const watchAddress = pairContext.pair.pairAddress;
      const ignoredHolderOwners = new Set([pairContext.pair.pairAddress].filter(Boolean));
      let transactions = [];
      let transactionError = null;
      try {
        transactions = await withTimeout(fetchRecentTransactions(watchAddress), TX_SAMPLE_TIMEOUT_MS, "wallet tx scan");
      } catch (error) {
        transactionError = error;
      }
      const [solPriceUsd, topHolders] = await Promise.all([
        fetchSolUsdPrice(),
        withTimeout(
          fetchTopTokenHolders(
            mint,
            pairContext.priceUsd,
            pairContext.target?.symbol ?? "TOKEN",
            ignoredHolderOwners,
          ),
          HOLDER_SAMPLE_TIMEOUT_MS,
          "top holder scan",
        ).catch(() => []),
      ]);
      const genericContext = {
        targetMint: mint,
        quoteMint: pairContext.quote?.address,
        poolOwner: pairContext.pair.pairAddress,
        tokenSymbol: pairContext.target?.symbol ?? "TOKEN",
        priceUsd: pairContext.priceUsd,
      };

      const trades = transactions
        .map(({ signatureInfo, transaction }) => summarizeGenericTrade(signatureInfo, transaction, genericContext))
        .filter(Boolean)
        .sort((a, b) => b.blockTime - a.blockTime)
        .slice(0, MAX_RECENT_TRADES);

      const aggregate = aggregateTrades(
        trades,
        pairContext.target?.symbol ?? "TOKEN",
        pairContext.priceUsd,
        pairContext.pair,
        topHolders,
        solPriceUsd,
      );

      const sourceLabel = transactionError
        ? "DEXSCREENER LIVE / RPC DEGRADED"
        : "LIVE RPC PAIR";
      return {
        token: {
          symbol: pairContext.target?.symbol ?? "TOKEN",
          name: pairContext.target?.name ?? "custom mint",
          mint,
          pool: pairContext.poolLabel,
          window: `live ${new Date().toLocaleTimeString("en-GB", { hour12: false })}`,
        },
        kpis: aggregate.kpis,
        wallets: aggregate.wallets,
        walletDetails: aggregate.walletDetails,
        hourly: aggregate.hourly,
        patterns: buildPatterns(aggregate, pairContext.target?.symbol ?? "TOKEN"),
        signals: buildSignals(aggregate, pairContext, trades),
        events: buildEvents(trades, pairContext.target?.symbol ?? "TOKEN"),
        bot: buildBotState({ providerLabel: sourceLabel, degraded: Boolean(transactionError) }, trades.length),
        source: {
          degraded: Boolean(transactionError),
          message: transactionError?.message ?? null,
          providerLabel: sourceLabel,
          pairAddress: pairContext.pair.pairAddress,
          watchAddress,
          parsedTrades: trades.length,
          topHolders: topHolders.length,
          updatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      return buildEmptyLiveData(mint, error.message || "Live request failed", pairContext?.pair);
    }
  }

  window.LiveTracker = {
    loadTokenSnapshot,
    providerState: () => [...providerState.values()],
  };
})();
