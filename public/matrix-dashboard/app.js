(function () {
  const DEFAULT_MINT = "BZLbGTNCSFfoth2GYDtwr7e4imWzpR5jqcUuGEwr646K";
  const state = {
    data: buildInitialData(DEFAULT_MINT),
    filter: "whale",
    botMode: "DRY_RUN",
    refreshTimer: null,
    syncInFlight: false,
    activeRequestId: 0,
    activeMint: DEFAULT_MINT,
    selectedWalletAddress: null,
    botBackend: null,
    botCockpit: null,
    hermesCapabilities: null,
    pendingApprovalId: null,
    backendWasOnline: false,
    whaleActivity: null,
    whaleActivityLoading: false,
    watcherState: null,
    topHolders: null,
  };

  const els = {
    form: document.getElementById("scanForm"),
    input: document.getElementById("tokenInput"),
    scanButton: document.getElementById("scanButton"),
    status: document.getElementById("systemStatus"),
    tokenTitle: document.getElementById("tokenTitle"),
    tokenMint: document.getElementById("tokenMint"),
    focusPool: document.getElementById("focusPool"),
    windowLabel: document.getElementById("windowLabel"),
    kpis: document.getElementById("kpiGrid"),
    walletTable: document.getElementById("walletTable"),
    walletDetail: document.getElementById("walletDetail"),
    walletDetailTitle: document.getElementById("walletDetailTitle"),
    walletVerdict: document.getElementById("walletVerdict"),
    heatmap: document.getElementById("hourHeatmap"),
    patterns: document.getElementById("patternList"),
    signals: document.getElementById("signalFeed"),
    events: document.getElementById("eventStream"),
    flowVerdict: document.getElementById("flowVerdict"),
    flowNetValue: document.getElementById("flowNetValue"),
    flowNarrative: document.getElementById("flowNarrative"),
    flowSellBar: document.getElementById("flowSellBar"),
    flowBuyBar: document.getElementById("flowBuyBar"),
    flowSellLabel: document.getElementById("flowSellLabel"),
    flowBuyLabel: document.getElementById("flowBuyLabel"),
    flowStats: document.getElementById("flowStats"),
    backendWhaleFeed: document.getElementById("backendWhaleFeed"),
    topMoneyWallets: document.getElementById("topMoneyWallets"),
    flowWindowLabel: document.getElementById("flowWindowLabel"),
    whaleRefreshButton: document.getElementById("whaleRefreshButton"),
    botModeBadge: document.getElementById("botModeBadge"),
    botRuntime: document.getElementById("botRuntime"),
    botWalletCockpit: document.getElementById("botWalletCockpit"),
    botTradeTape: document.getElementById("botTradeTape"),
    topHolderPanel: document.getElementById("topHolderPanel"),
    riskGateList: document.getElementById("riskGateList"),
    hermesStatus: document.getElementById("hermesStatus"),
    hermesBridge: document.getElementById("hermesBridge"),
    botActionLog: document.getElementById("botActionLog"),
    clock: document.getElementById("signalClock"),
    canvas: document.getElementById("matrixRain"),
  };

  const base58Pattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  const REFRESH_MS = 75_000;
  const BOT_API_FALLBACK_URL = "http://127.0.0.1:8787";
  const WSOL_MINT = "So11111111111111111111111111111111111111112";
  const SCAN_TIMEOUT_MS = 24_000;

  function buildBotShell() {
    return {
      mode: "DRY_RUN",
      runtime: [
        { label: "Data feed", value: "waiting", tone: "warning" },
        { label: "Parsed txs", value: "0", tone: "warning" },
        { label: "Refresh", value: "manual", tone: "warning" },
        { label: "Trading", value: "locked", tone: "negative" },
        { label: "Route", value: "Jupiter read-only", tone: "warning" },
        { label: "Signer", value: "not exposed", tone: "warning" },
      ],
      risk: [
        { label: "Live execution", value: "blocked", state: "blocked" },
        { label: "Market data", value: "allowed", state: "locked" },
        { label: "Wallet scanner", value: "on demand", state: "locked" },
        { label: "Max trade", value: "backend gated", state: "locked" },
        { label: "Approval", value: "dashboard gate", state: "locked" },
        { label: "Hermes execute", value: "blocked", state: "blocked" },
      ],
      hermes: [
        { channel: "observe", status: "ready", permission: "market events" },
        { channel: "request_quote", status: "standby", permission: "risk gated" },
        { channel: "execute.trade", status: "blocked", permission: "manual only" },
      ],
      hermesStatus: "STANDBY",
    };
  }

  function buildInitialData(mint) {
    return {
      totals: { buys: 0, sells: 0, buyUsd: 0, sellUsd: 0 },
      whaleStats: { whales: 0, buyWhales: 0, sellWhales: 0, candidates: 0, holderOnly: 0, volumeSol: 0, watchVolumeSol: 0, netToken: 0, netUsd: 0, netSol: 0, thresholds: { solPriceUsd: 0 } },
      token: { symbol: "TOKEN", name: "esperando scan real", mint, pool: "Sin datos hardcoded", window: "esperando buscar" },
      kpis: [
        { label: "Precio real", value: "--", delta: "pulsa Buscar", tone: "warning" },
        { label: "Volumen 24h", value: "--", delta: "DexScreener", tone: "warning" },
        { label: "Tx 24h", value: "--", delta: "real feed", tone: "warning" },
        { label: "Whales RPC", value: "--", delta: "on-chain", tone: "warning" },
        { label: "Wallets", value: "--", delta: "no fixture", tone: "warning" },
        { label: "Confianza", value: "--", delta: "waiting", tone: "warning" },
      ],
      wallets: [],
      walletDetails: {},
      hourly: Array.from({ length: 24 }, (_, hour) => [hour, 0, 0]),
      patterns: [{ title: "Esperando búsqueda real", value: "no fixture", copy: "Introduce un mint y pulsa Buscar para consultar DexScreener + RPC; no se precargan wallets inventadas.", tone: "watch" }],
      signals: [{ score: 0, title: "Sin señal", meta: "waiting", copy: "El dashboard no genera señales desde datos hardcoded." }],
      events: [],
      bot: buildBotShell(),
    };
  }

  function formatUsd(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2,
    }).format(Number(value) || 0);
  }

  function formatSigned(value) {
    const prefix = value > 0 ? "+" : "";
    return `${prefix}${new Intl.NumberFormat("en-US", {
      notation: Math.abs(value) >= 1000 ? "compact" : "standard",
      maximumFractionDigits: Math.abs(value) >= 1000 ? 1 : 2,
    }).format(Number(value) || 0)}`;
  }

  function formatCompact(value) {
    return new Intl.NumberFormat("en-US", {
      notation: Math.abs(value) >= 1000 ? "compact" : "standard",
      maximumFractionDigits: Math.abs(value) >= 1000 ? 1 : 2,
    }).format(Number(value) || 0);
  }

  function formatSol(value) {
    return `${formatCompact(value)} SOL`;
  }

  function formatPrice(value) {
    const numeric = Number(value) || 0;
    if (!numeric) return "$0";
    return `$${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: numeric < 0.01 ? 6 : 4,
      minimumFractionDigits: numeric < 0.01 ? 4 : 2,
    }).format(numeric)}`;
  }

  function shorten(address) {
    if (!address || address.length < 12) return address || "unknown";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  function botApiBaseUrl() {
    if (window.TRACKER_CONFIG?.botApiUrl) return window.TRACKER_CONFIG.botApiUrl.replace(/\/$/, "");
    if (window.location.protocol === "file:") return BOT_API_FALLBACK_URL;
    // In Vercel/Next the cockpit is served from /matrix-dashboard inside an iframe.
    // Browsers cannot reach the Mac's 127.0.0.1 from production, so all bot reads
    // must go through the Next.js read-only proxy at /api/io-bot.
    if (window.location.pathname.startsWith("/matrix-dashboard")) return `${window.location.origin}/api/io-bot`;
    if (["127.0.0.1", "localhost"].includes(window.location.hostname) && window.location.port !== "8787") return BOT_API_FALLBACK_URL;
    return `${window.location.origin}/api/io-bot`;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function percent(part, total) {
    const denominator = Math.max(1, Number(total) || 0);
    return clamp((Number(part) || 0) / denominator, 0.04, 0.96) * 100;
  }

  function walletExplorerUrl(address, explorer = "solscan") {
    const encoded = encodeURIComponent(address);
    if (explorer === "solanafm") return `https://solana.fm/address/${encoded}`;
    if (explorer === "explorer") return `https://explorer.solana.com/address/${encoded}`;
    return `https://solscan.io/account/${encoded}`;
  }

  function txExplorerUrl(signature) {
    return `https://solscan.io/tx/${encodeURIComponent(signature)}`;
  }

  function renderWalletExplorerLinks(address, compact = false) {
    return `
      <div class="${compact ? "wallet-scan-mini" : "wallet-explorer-actions"}" aria-label="Solana wallet explorers">
        <a href="${walletExplorerUrl(address)}" target="_blank" rel="noopener noreferrer" title="Abrir wallet en Solscan">Solscan</a>
        <a href="${walletExplorerUrl(address, "solanafm")}" target="_blank" rel="noopener noreferrer" title="Abrir wallet en SolanaFM">SolanaFM</a>
        <a href="${walletExplorerUrl(address, "explorer")}" target="_blank" rel="noopener noreferrer" title="Abrir wallet en Solana Explorer">Explorer</a>
      </div>
    `;
  }

  function setStatus(text, tone) {
    els.status.className = `system-status ${tone || ""}`.trim();
    els.status.innerHTML = `<span class="pulse"></span><span>${text}</span>`;
  }

  function setLoading(isLoading) {
    if (els.scanButton) {
      els.scanButton.disabled = isLoading;
      els.scanButton.textContent = isLoading ? "Sync" : "Buscar";
    }
  }

  function renderTokenMeta() {
    const token = state.data.token;
    els.tokenTitle.textContent = `${token.symbol} / ${token.name}`;
    els.tokenMint.textContent = token.mint;
    els.focusPool.textContent = token.pool;
    els.windowLabel.textContent = token.window;
  }

  function renderKpis() {
    els.kpis.innerHTML = state.data.kpis
      .map(
        (item) => `
          <article class="panel kpi-card">
            <span class="label">${item.label}</span>
            <strong class="value">${item.value}</strong>
            <span class="delta ${item.tone || ""}">${item.delta}</span>
          </article>
        `,
      )
      .join("");
  }

  function walletMatchesFilter(wallet) {
    if (state.filter === "all") return true;
    if (state.filter === "whale") return wallet.tags.includes("whale") || wallet.whaleTier === "whale";
    if (state.filter === "candidate") return wallet.tags.includes("candidate") || wallet.whaleTier === "candidate";
    return wallet.tags.includes(state.filter) || wallet.pattern === state.filter;
  }

  function patternTone(pattern) {
    if (pattern.includes("whale")) return "whale";
    if (pattern.includes("distribution") || pattern.includes("sell")) return "sell";
    if (pattern.includes("watch")) return "watch";
    if (pattern.includes("holder") || pattern.includes("pool")) return "watch";
    if (pattern.includes("rotation")) return "watch";
    return "buy";
  }

  function emptyRow(message) {
    return `<tr><td class="empty-cell" colspan="13">${message}</td></tr>`;
  }

  function filteredWalletRows() {
    const wallets = state.data.wallets || [];
    if (state.whaleActivity?.status === "provider_required") return [];
    const rows = wallets.filter(walletMatchesFilter);
    // If the whale filter is empty but the RPC sample did find real wallets,
    // show the live sample instead of a blank table. The tier column still says SMALL/WATCH/WHALE.
    if (!rows.length && wallets.length && state.filter === "whale") return wallets;
    return rows;
  }

  function ensureSelectedWallet(rows = state.data.wallets || []) {
    if (state.selectedWalletAddress && (state.data.wallets || []).some((wallet) => wallet.address === state.selectedWalletAddress)) {
      return;
    }
    state.selectedWalletAddress = rows[0]?.address || null;
  }

  function renderWallets() {
    const rows = filteredWalletRows();
    if (!rows.length) {
      const emptyMessage = state.whaleActivity?.status === "provider_required"
        ? "No hay discovery profesional configurado. Configura BIRDEYE_API_KEY o HELIUS_API_KEY; no se muestran muestras RPC como ballenas."
        : state.filter === "whale"
          ? "No wallets with buy or sell side >=100 SOL detected in the current live window. Use Watch for 25-99 SOL or All to inspect smaller signers."
          : "No wallets match this filter in the current live window";
      els.walletTable.innerHTML = emptyRow(emptyMessage);
      return;
    }

    if (!rows.some((wallet) => wallet.address === state.selectedWalletAddress)) {
      state.selectedWalletAddress = rows[0].address;
    }

    els.walletTable.innerHTML = rows
      .map((wallet, index) => {
        const tone = patternTone(wallet.pattern);
        return `
          <tr class="${wallet.address === state.selectedWalletAddress ? "selected-row" : ""}" data-wallet-address="${wallet.address}" title="${wallet.address}">
            <td class="rank">${index + 1}</td>
            <td class="wallet-address">
              <a class="wallet-address-link" href="${walletExplorerUrl(wallet.address)}" target="_blank" rel="noopener noreferrer" title="Abrir wallet en Solscan">${shorten(wallet.address)}</a>
            </td>
            <td>${wallet.buys}</td>
            <td class="delta ${Number(wallet.buySol || 0) >= 100 ? "positive" : Number(wallet.buySol || 0) >= 25 ? "warning" : ""}">${formatSol(wallet.buySol)}</td>
            <td>${wallet.sells}</td>
            <td class="delta ${Number(wallet.sellSol || 0) >= 100 ? "negative" : Number(wallet.sellSol || 0) >= 25 ? "warning" : ""}">${formatSol(wallet.sellSol)}</td>
            <td>${formatUsd(wallet.volumeUsd)}</td>
            <td class="${wallet.netIo >= 0 ? "delta positive" : "delta negative"}">${formatSigned(wallet.netIo)}</td>
            <td><span class="pill ${wallet.whaleTier === "whale" ? "whale" : wallet.whaleTier === "candidate" ? "watch" : ""}" title="${wallet.whaleReason || ""}">${wallet.whaleLabel || wallet.whaleTier || "n/a"}</span></td>
            <td title="${wallet.lastSeenTime || wallet.whaleReason || ""}">${wallet.activityLabel || wallet.hours || "n/a"}</td>
            <td><span class="pill ${tone}">${wallet.pattern}</span></td>
            <td>${wallet.score}</td>
            <td>${renderWalletExplorerLinks(wallet.address, true)}</td>
          </tr>
        `;
      })
      .join("");
  }

  function metric(label, value, tone = "") {
    return `
      <div class="wallet-metric">
        <span>${label}</span>
        <strong class="${tone}">${value}</strong>
      </div>
    `;
  }

  function formatSignedUsd(value) {
    const numeric = Number(value) || 0;
    const sign = numeric > 0 ? "+" : numeric < 0 ? "-" : "";
    return `${sign}${formatUsd(Math.abs(numeric))}`;
  }

  function formatMinutes(value) {
    const numeric = Number(value) || 0;
    return numeric ? `${numeric} min` : "n/a";
  }

  function renderHourChips(hours, side) {
    if (!hours?.length) return `<span class="wallet-hour-chip empty">n/a</span>`;
    return hours
      .slice(0, 5)
      .map(
        (item) => `
          <span class="wallet-hour-chip ${side}">
            <strong>${item.label}</strong>
            <em>${item.count}x / ${formatUsd(item.usd)}</em>
          </span>
        `,
      )
      .join("");
  }

  function renderTradeRows(trades, side) {
    if (!trades?.length) {
      return `<div class="wallet-trade-empty">Sin ${side === "buy" ? "compras" : "ventas"} en la ventana actual.</div>`;
    }

    return trades
      .slice(0, 8)
      .map(
        (trade) => `
          <div class="wallet-trade ${trade.side} wallet-${trade.side}-row" title="${trade.signature}">
            <span>${trade.side.toUpperCase()}</span>
            <strong>${formatCompact(trade.amount)} ${state.data.token.symbol}</strong>
            <em>${formatUsd(trade.usd)} / ${formatSol(trade.solEq)} eq @ ${formatPrice(trade.price)}</em>
            <code>${trade.time}</code>
            <a class="wallet-tx-link" href="${txExplorerUrl(trade.signature)}" target="_blank" rel="noopener noreferrer" title="Abrir transaccion en Solscan">TX</a>
          </div>
        `,
      )
      .join("");
  }

  function renderLargestTrade(label, trade, tone) {
    return `
      <div class="wallet-extreme ${tone}">
        <span>${label}</span>
        <strong>${trade ? `${formatCompact(trade.amount)} ${state.data.token.symbol}` : "n/a"}</strong>
        <em>${trade ? `${formatUsd(trade.usd)} / ${trade.time}` : "n/a"}</em>
      </div>
    `;
  }

  function renderPatternNotes(notes) {
    return (notes?.length ? notes : ["Sin patron repetido claro en la ventana actual."])
      .map((note) => `<li>${note}</li>`)
      .join("");
  }

  function renderHourVector(detail) {
    const maxValue = Math.max(1, ...detail.hourVector.map((item) => item.buys + item.sells));
    return detail.hourVector
      .map((item) => {
        const height = Math.max(4, Math.round(((item.buys + item.sells) / maxValue) * 34));
        return `
          <div class="wallet-hour" title="${String(item.hour).padStart(2, "0")}:00 UTC / B ${item.buys} / S ${item.sells}">
            <i style="height:${height}px" class="${item.buys >= item.sells ? "buy" : "sell"}"></i>
            <span>${String(item.hour).padStart(2, "0")}</span>
          </div>
        `;
      })
      .join("");
  }

  function renderWalletDetail() {
    const details = state.data.walletDetails || {};
    const address = state.selectedWalletAddress;
    const detail = address ? details[address] : null;

    if (!detail) {
      els.walletDetailTitle.textContent = "Sin wallet seleccionada";
      els.walletVerdict.className = "status-chip warning";
      els.walletVerdict.textContent = "WAIT";
      els.walletDetail.innerHTML = `
        <div class="wallet-detail-empty">
          <strong>Sin wallet atribuida</strong>
          <span>Ventana live sin signer suficiente.</span>
        </div>
      `;
      return;
    }

    const edgeTone = detail.estimatedEdgeUsd >= 0 ? "positive" : "negative";
    const buyTrades = detail.buyTrades || detail.trades.filter((trade) => trade.side === "buy");
    const sellTrades = detail.sellTrades || detail.trades.filter((trade) => trade.side === "sell");
    const pressureTone = detail.netUsdPressure >= 0 ? "positive" : "negative";
    els.walletDetailTitle.textContent = shorten(detail.address);
    els.walletVerdict.className = `status-chip ${detail.verdictTone}`;
    els.walletVerdict.textContent = detail.verdict;

    els.walletDetail.innerHTML = `
      <div class="wallet-detail-identity">
        <div>
          <span class="eyebrow">Address</span>
          <code>${detail.address}</code>
          ${renderWalletExplorerLinks(detail.address)}
        </div>
        <div class="follow-score ${detail.verdictTone}">
          <span>Follow score</span>
          <strong>${detail.followScore}</strong>
        </div>
      </div>

      <div class="wallet-metric-grid">
        ${metric("Whale tier", detail.whaleLabel || detail.whaleTier || "n/a", detail.whaleTier === "whale" ? "positive" : detail.whaleTier === "candidate" ? "warning" : "")}
        ${metric("Whale reason", detail.whaleReason || "n/a", detail.whaleTier === "whale" ? "positive" : "warning")}
        ${metric("SOL compra eq", formatSol(detail.buySol), Number(detail.buySol || 0) >= 100 ? "positive" : Number(detail.buySol || 0) >= 25 ? "warning" : "")}
        ${metric("SOL venta eq", formatSol(detail.sellSol), Number(detail.sellSol || 0) >= 100 ? "negative" : Number(detail.sellSol || 0) >= 25 ? "warning" : "")}
        ${Number(detail.volumeSol || 0) ? metric("SOL eq volume", formatSol(detail.volumeSol), detail.volumeSol >= 100 ? "positive" : "warning") : ""}
        ${metric("PnL / edge est.", formatSignedUsd(detail.estimatedEdgeUsd), edgeTone)}
        ${metric("Buy/Sell ratio", `${detail.buySellRatio.toFixed(2)}x`, detail.buySellRatio >= 1 ? "positive" : "negative")}
        ${metric("Compras", `${detail.buys} / ${formatCompact(detail.buyToken)} ${detail.tokenSymbol}`, "positive")}
        ${metric("Ventas", `${detail.sells} / ${formatCompact(detail.sellToken)} ${detail.tokenSymbol}`, detail.sells > detail.buys ? "negative" : "warning")}
        ${metric("Avg buy", formatPrice(detail.avgBuy), "positive")}
        ${metric("Avg sell", formatPrice(detail.avgSell), detail.avgSell > detail.avgBuy ? "positive" : "warning")}
        ${metric("Realized edge", formatSignedUsd(detail.realizedEdgeUsd), detail.realizedEdgeUsd >= 0 ? "positive" : "negative")}
        ${metric("Open edge", formatSignedUsd(detail.openEdgeUsd), detail.openEdgeUsd >= 0 ? "positive" : "negative")}
        ${detail.holderToken ? metric("Holder balance", `${formatCompact(detail.holderToken)} ${detail.tokenSymbol}`, "warning") : ""}
        ${detail.holderRank ? metric("Holder rank", `#${detail.holderRank} / ${Number(detail.holderSharePct || 0).toFixed(3)}%`, "warning") : ""}
        ${metric("Net USD pressure", formatSignedUsd(detail.netUsdPressure), pressureTone)}
        ${metric("Avg size", formatUsd(detail.avgSizeUsd), "")}
        ${metric("Net token", `${formatSigned(detail.netToken)} ${detail.tokenSymbol}`, detail.netToken >= 0 ? "positive" : "negative")}
        ${metric("Buy hours", detail.habitualBuyHours || "n/a", "positive")}
        ${metric("Sell hours", detail.habitualSellHours || "n/a", detail.sells ? "negative" : "")}
        ${metric("Cadencia", formatMinutes(detail.avgMinutesBetweenTrades), "")}
        ${metric("Sample", detail.sampleLabel || `${detail.trades.length} tx`, "")}
        ${metric("Bias", detail.activityBias || "n/a", pressureTone)}
        ${metric("Ultima accion", `${detail.lastAction} / ${detail.lastActionTime}`, detail.lastAction === "BUY" ? "positive" : "negative")}
      </div>

      <div class="wallet-signal-row">
        ${detail.signals.map((signal) => `<span class="wallet-signal ${signalTone(signal)}">${signal}</span>`).join("")}
      </div>

      <div class="wallet-summary ${detail.verdictTone}">
        ${detail.summary}
      </div>

      <div class="wallet-section-grid">
        <section class="wallet-subsection">
          <div class="wallet-subsection-head">
            <span>Compras habituales</span>
            <strong>${buyTrades.length} buys</strong>
          </div>
          <div class="wallet-hour-chip-row">${renderHourChips(detail.buyHours, "buy")}</div>
        </section>
        <section class="wallet-subsection">
          <div class="wallet-subsection-head">
            <span>Ventas habituales</span>
            <strong>${sellTrades.length} sells</strong>
          </div>
          <div class="wallet-hour-chip-row">${renderHourChips(detail.sellHours, "sell")}</div>
        </section>
        <section class="wallet-subsection">
          <div class="wallet-subsection-head">
            <span>Extremos</span>
            <strong>${detail.firstSeenTime} -> ${detail.lastSeenTime}</strong>
          </div>
          <div class="wallet-extreme-grid">
            ${renderLargestTrade("Mayor compra", detail.largestBuy, "buy")}
            ${renderLargestTrade("Mayor venta", detail.largestSell, "sell")}
          </div>
        </section>
        <section class="wallet-subsection">
          <div class="wallet-subsection-head">
            <span>Indicadores de patron</span>
            <strong>${detail.primaryPattern}</strong>
          </div>
          <ul class="wallet-pattern-notes">${renderPatternNotes(detail.patternNotes)}</ul>
        </section>
      </div>

      <div class="wallet-hour-strip">
        ${renderHourVector(detail)}
      </div>

      <div class="wallet-ledger-grid">
        <section class="wallet-ledger-section">
          <div class="wallet-ledger-head">
            <span>Compras detectadas</span>
            <strong>${formatCompact(detail.buyToken)} ${detail.tokenSymbol}</strong>
          </div>
          <div class="wallet-trade-list">${renderTradeRows(buyTrades, "buy")}</div>
        </section>
        <section class="wallet-ledger-section">
          <div class="wallet-ledger-head">
            <span>Ventas detectadas</span>
            <strong>${formatCompact(detail.sellToken)} ${detail.tokenSymbol}</strong>
          </div>
          <div class="wallet-trade-list">${renderTradeRows(sellTrades, "sell")}</div>
        </section>
      </div>
    `;
  }

  function signalTone(signal) {
    if (signal.includes("AVOID") || signal.includes("DISTRIBUTION")) return "negative";
    if (signal.includes("WATCH") || signal.includes("PROFIT")) return "warning";
    return "positive";
  }

  function renderHeatmap() {
    const maxValue = Math.max(1, ...state.data.hourly.flatMap((hour) => [hour[1], hour[2]]));
    els.heatmap.innerHTML = state.data.hourly
      .map(([hour, buy, sell]) => {
        const buyAlpha = Math.min(0.58, (buy / maxValue) * 0.58).toFixed(2);
        const sellAlpha = Math.min(0.5, (sell / maxValue) * 0.5).toFixed(2);
        const label = buy >= sell ? `B ${buy}` : `S ${sell}`;
        return `
          <div class="hour-cell" style="--buy-alpha:${buyAlpha}; --sell-alpha:${sellAlpha}" title="UTC hour from parsed recent RPC sample, not full 24h history">
            <strong>${String(hour).padStart(2, "0")}:00</strong>
            <span>${label}</span>
          </div>
        `;
      })
      .join("");
  }

  function renderPatterns() {
    els.patterns.innerHTML = state.data.patterns
      .map(
        (item) => `
          <article class="pattern-item">
            <div class="pattern-top">
              <span class="pattern-title">${item.title}</span>
              <span class="pattern-value">${item.value}</span>
            </div>
            <span class="pattern-copy">${item.copy}</span>
            <span class="pill ${item.tone}">${item.tone}</span>
          </article>
        `,
      )
      .join("");
  }

  function renderSignals() {
    els.signals.innerHTML = state.data.signals
      .map(
        (item) => `
          <article class="signal-item">
            <strong class="signal-score">${item.score}</strong>
            <div>
              <div class="pattern-title">${item.title}</div>
              <div class="signal-copy">${item.copy}</div>
            </div>
            <span class="signal-meta">${item.meta}</span>
          </article>
        `,
      )
      .join("");
  }

  function renderEvents() {
    if (!state.data.events.length) {
      els.events.innerHTML = `<article class="event-item"><div class="event-copy">Waiting for parsed live swaps from RPC.</div></article>`;
      return;
    }

    els.events.innerHTML = state.data.events
      .map(
        (item) => `
          <article class="event-item ${item.side}">
            <div class="event-top">
              <span class="event-title">${item.title}</span>
              <span class="event-value">${item.value}</span>
            </div>
            <div class="event-copy">${item.wallet} / ${item.time}</div>
          </article>
        `,
      )
      .join("");
  }

  function flowStat(label, value, tone = "") {
    return `
      <div class="flow-stat ${tone}">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `;
  }

  function renderBackendWhaleFeed() {
    if (state.whaleActivityLoading) {
      els.backendWhaleFeed.innerHTML = `<div class="flow-empty">Consultando discovery profesional de whales...</div>`;
      return;
    }

    if (!state.whaleActivity) {
      const indexedWallets = (state.data.wallets || []).filter((wallet) => wallet.tags?.includes("indexed"));
      if (indexedWallets.length) {
        els.backendWhaleFeed.innerHTML = indexedWallets
          .slice(0, 5)
          .map((wallet) => `
            <article class="backend-whale-item ${wallet.netIo < 0 ? "sell" : "buy"}">
              <strong>${wallet.netIo < 0 ? "SELL" : "BUY"} ${formatUsd(Math.abs(wallet.netIo || wallet.volumeUsd || 0))}</strong>
              <span>${shorten(wallet.address)} / birdeye</span>
              <em class="${wallet.netIo < 0 ? "negative" : "positive"}">${wallet.pattern || "indexed wallet"} / score ${wallet.score ?? "--"}</em>
            </article>
          `)
          .join("");
        return;
      }
      els.backendWhaleFeed.innerHTML = `<div class="flow-empty">Discovery pendiente. Pulsa Buscar para consultar proveedor indexado real.</div>`;
      return;
    }

    if (state.whaleActivity.status === "provider_required") {
      els.backendWhaleFeed.innerHTML = `<div class="flow-empty">Provider required: configura BIRDEYE_API_KEY o HELIUS_API_KEY. No voy a inventar whales con muestra RPC.</div>`;
      return;
    }

    if (state.whaleActivity.quality === "degraded") {
      els.backendWhaleFeed.innerHTML = `<div class="flow-empty">Muestra RPC degradada: datos reales pero no accionables para seguir whales.</div>`;
      return;
    }

    const events = state.whaleActivity.events || [];
    if (!events.length) {
      els.backendWhaleFeed.innerHTML = `<div class="flow-empty">No se encontraron compras/ventas whale sobre el umbral ${formatUsd(state.whaleActivity.minUsd || 0)} en el proveedor indexado.</div>`;
      return;
    }

    els.backendWhaleFeed.innerHTML = events
      .slice(0, 5)
      .map((event) => {
        const tone = event.side === "sell" ? "negative" : event.side === "buy" ? "positive" : "warning";
        return `
          <article class="backend-whale-item ${event.side}">
            <strong>${event.side.toUpperCase()} ${formatUsd(event.quoteAmountUsd ?? event.stableAmount ?? 0)}</strong>
            <span>${shorten(event.wallet)} / ${event.source || "indexed"}</span>
            <em class="${tone}">${event.confidence ? `${event.confidence}% confidence` : event.reason || "indexed whale trade"}</em>
          </article>
        `;
      })
      .join("");
  }

  function renderMoneyFlow() {
    const totals = state.data.totals || {};
    const whaleStats = state.data.whaleStats || {};
    const buyUsd = Number(totals.buyUsd ?? 0);
    const sellUsd = Number(totals.sellUsd ?? 0);
    const totalFlowUsd = Math.max(1, buyUsd + sellUsd);
    const whaleNetUsd = Number(whaleStats.netUsd ?? buyUsd - sellUsd);
    const whaleNetSol = Number(whaleStats.netSol ?? 0);
    const whaleVolumeSol = Number(whaleStats.volumeSol ?? 0);
    const candidateVolumeSol = Number(whaleStats.watchVolumeSol ?? 0);
    const buyWhales = Number(whaleStats.buyWhales ?? 0);
    const sellWhales = Number(whaleStats.sellWhales ?? 0);
    const dominant = whaleNetUsd >= 0 ? "buy" : "sell";
    const tone = Math.abs(whaleNetUsd) < 1 ? "warning" : dominant === "buy" ? "positive" : "negative";
    const bias = dominant === "buy" ? "entrada neta / acumulacion" : "salida neta / distribucion";

    els.flowVerdict.className = `status-chip ${tone}`;
    els.flowVerdict.textContent = Math.abs(whaleNetUsd) < 1 ? "NEUTRAL" : dominant === "buy" ? "ACCUMULATION" : "DISTRIBUTION";
    els.flowNetValue.className = tone;
    els.flowNetValue.textContent = whaleStats.thresholds?.solPriceUsd ? `${formatSigned(whaleNetSol)} SOL eq` : formatSignedUsd(whaleNetUsd);
    els.flowNarrative.textContent = `${bias}: ${buyWhales} wallets comprando vs ${sellWhales} vendiendo. Volumen ballena ${formatSol(whaleVolumeSol)}; watch-list ${formatSol(candidateVolumeSol)}.`;
    els.flowSellBar.style.width = `${percent(sellUsd, totalFlowUsd)}%`;
    els.flowBuyBar.style.width = `${percent(buyUsd, totalFlowUsd)}%`;
    els.flowSellLabel.textContent = `Sell ${formatUsd(sellUsd)}`;
    els.flowBuyLabel.textContent = `Buy ${formatUsd(buyUsd)}`;
    els.flowWindowLabel.textContent = state.data.token?.window || "live";

    els.flowStats.innerHTML = [
      flowStat("Compras parseadas", formatUsd(buyUsd), "positive"),
      flowStat("Ventas parseadas", formatUsd(sellUsd), "negative"),
      flowStat("Ballenas", `${whaleStats.whales ?? 0}`, (whaleStats.whales ?? 0) ? "positive" : "warning"),
      flowStat("Watch wallets", `${whaleStats.candidates ?? 0}`, "warning"),
      flowStat("Holders top", `${whaleStats.holderOnly ?? 0}`, "warning"),
      flowStat("Net token", `${formatSigned(whaleStats.netToken ?? 0)} ${state.data.token?.symbol || "TOKEN"}`, tone),
    ].join("");

    const wallets = [...(state.data.wallets || [])]
      .sort((a, b) => Math.abs((b.buyUsd ?? 0) - (b.sellUsd ?? 0)) - Math.abs((a.buyUsd ?? 0) - (a.sellUsd ?? 0)))
      .slice(0, 5);

    els.topMoneyWallets.innerHTML = wallets.length
      ? wallets
          .map((wallet, index) => {
            const net = Number(wallet.buyUsd ?? 0) - Number(wallet.sellUsd ?? 0);
            const walletTone = net >= 0 ? "positive" : "negative";
            return `
              <article class="top-money-wallet ${walletTone}" data-wallet-address="${wallet.address}">
                <span>#${index + 1} ${shorten(wallet.address)}</span>
                <strong>${formatSignedUsd(net)}</strong>
                <em>${wallet.whaleLabel || wallet.pattern || "wallet"} / score ${wallet.score ?? "--"}</em>
              </article>
            `;
          })
          .join("")
      : `<div class="flow-empty">Sin wallets con flujo suficiente en esta ventana.</div>`;

    renderBackendWhaleFeed();
  }

  function botTone(mode) {
    if (mode === "OFF" || mode === "LIVE_LOCKED" || mode === "LOCKED") return "negative";
    if (mode === "ARMED" || mode === "DRY_RUN" || mode === "LIVE_ARMED") return "warning";
    return "positive";
  }

  function renderBotControl() {
    const bot = state.data.bot || buildBotShell();
    const backend = state.botBackend;
    const cockpit = state.botCockpit;
    const strategy = cockpit?.strategy || backend?.strategy;
    const mode = backend?.mode || state.botMode;
    const watcher = state.watcherState;
    const runtime = backend
      ? [
          { label: "Backend", value: "online", tone: "positive" },
          { label: "Hermes auto", value: "interno", tone: "positive" },
          { label: "Watcher", value: watcher?.updatedAt ? "live" : "syncing", tone: watcher?.updatedAt ? "positive" : "warning" },
          { label: "Wallet", value: backend.walletReady ? shorten(backend.publicKey) : "not ready", tone: backend.walletReady ? "positive" : "negative" },
          { label: "Strategy", value: strategy?.enabled ? strategy.phase : "disabled", tone: strategy?.enabled ? "warning" : "negative" },
          { label: "Last action", value: strategy?.lastAction || "waiting", tone: "warning" },
          { label: "Rebuy caja", value: strategy ? `${formatUsd(strategy.rebuyTrancheStableUi)} tranche` : "n/a", tone: "positive" },
          { label: "Emergency", value: backend.emergencyStopped ? "active" : "clear", tone: backend.emergencyStopped ? "negative" : "positive" },
        ]
      : [
          { label: "Backend", value: "offline", tone: "negative" },
          { label: "Hermes auto", value: "esperando backend", tone: "warning" },
        ];
    els.botModeBadge.className = `status-chip ${backend ? "positive" : "warning"}`;
    els.botModeBadge.textContent = backend ? "AUTO INFO" : "SYNCING";

    els.botRuntime.innerHTML = runtime
      .map(
        (item) => `
          <div class="runtime-item">
            <span>${item.label}</span>
            <strong class="${item.tone || ""}">${item.value}</strong>
          </div>
        `,
      )
      .join("");
    renderBotWalletCockpit();
    renderBotTradeTape();
    renderTopHolders();
  }

  function formatTokenAmount(value, symbol) {
    const numeric = Number(value) || 0;
    const maxDigits = symbol === "IO" ? 3 : symbol === "SOL" ? 5 : 2;
    return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: maxDigits }).format(numeric)} ${symbol}`;
  }

  function renderBotWalletCockpit() {
    const cockpit = state.botCockpit;
    if (!els.botWalletCockpit) return;
    if (!cockpit?.balances) {
      els.botWalletCockpit.innerHTML = `
        <article class="balance-card warning"><span>Wallet cockpit</span><strong>syncing</strong><em>esperando backend</em></article>
      `;
      return;
    }
    const balances = cockpit.balances;
    const strategy = cockpit.strategy || {};
    const sellTrigger = state.watcherState?.nearestTrigger?.side === "sell" ? state.watcherState.nearestTrigger : null;
    const nextSellTone = sellTrigger?.reached ? "positive" : sellTrigger?.price ? "warning" : "negative";
    const triggerLabel = sellTrigger?.name?.includes("trailing_pullback")
      ? "Trailing sell pullback"
      : sellTrigger?.name?.includes("arm_trailing")
        ? "Arm trailing sell"
        : "Next sell level";
    const nextSellMeta = sellTrigger?.price
      ? `${sellTrigger.reached ? "TARGET ALCANZADO" : `${Number(sellTrigger.distancePct ?? 0).toFixed(2)}% ${sellTrigger.direction || "from target"}`} · IO ahora ${formatPrice(state.watcherState?.price)}`
      : "watcher sin target sell activo";
    const trailingMeta = strategy.trailingTakeProfitEnabled
      ? (strategy.trailingArmed
          ? `armado · high ${formatPrice(strategy.trailingHighWaterStablePerTargetUi)} · pullback ${Number(strategy.trailingPullbackPct || 0).toFixed(2)}%`
          : `activo · arma en +${Number(strategy.takeProfitBps || 0) / 100}% y luego vende en pullback ${Number(strategy.trailingPullbackPct || 0).toFixed(2)}%`)
      : "OFF · venta fija al target";
    const livePrice = Number(state.watcherState?.price || 0);
    const avgEntry = Number(strategy.averageEntryStablePerTargetUi || 0);
    const trackedIo = Number(strategy.positionUi || balances.io?.uiAmount || 0);
    const solUi = Number(balances.sol?.uiAmount || 0);
    const minSolReserve = Number(balances.sol?.minLamports || strategy.minSolFeeReserveLamports || 0) / 1e9;
    const solFeeExcess = solUi - minSolReserve;
    const liveTrailingProfit = livePrice > 0 && avgEntry > 0 && trackedIo > 0 ? (livePrice - avgEntry) * trackedIo : 0;
    const trailingBufferPrice = sellTrigger?.price && livePrice ? livePrice - Number(sellTrigger.price) : 0;
    const trailingBufferUsdc = trailingBufferPrice && trackedIo ? trailingBufferPrice * trackedIo : 0;
    const trailingBufferPct = sellTrigger?.price ? (Math.abs(trailingBufferPrice) / Number(sellTrigger.price)) * 100 : 0;
    const liveProfitMeta = livePrice && avgEntry
      ? `IO ${formatPrice(livePrice)} vs avg ${formatPrice(avgEntry)} · ${trailingBufferPrice >= 0 ? "+" : ""}${trailingBufferPct.toFixed(2)}% del stop`
      : "esperando precio live y coste medio";
    const cards = [
      { label: triggerLabel, symbol: "PRICE", value: sellTrigger?.price || 0, tone: nextSellTone, meta: nextSellMeta, priority: true },
      { label: "Profit trailing live", symbol: "USDC", value: liveTrailingProfit, tone: liveTrailingProfit > 0 ? "positive" : liveTrailingProfit < 0 ? "negative" : "warning", meta: liveProfitMeta },
      { label: "Buffer antes de vender", symbol: "USDC", value: trailingBufferUsdc, tone: trailingBufferPrice > 0 ? "positive" : trailingBufferPrice < 0 ? "negative" : "warning", meta: sellTrigger?.price ? `${trailingBufferPrice >= 0 ? "encima" : "debajo"} del stop por ${formatPrice(Math.abs(trailingBufferPrice))}` : "sin trailing stop activo" },
      { label: "Beneficio vendido", symbol: "USDC", value: strategy.realizedProfitStableUi, tone: Number(strategy.realizedProfitStableUi || 0) > 0 ? "positive" : "warning", meta: `${Number(strategy.sellStepsCompleted || 0)} sells · USDC ganado realizado` },
      { label: "Última venta", symbol: "USDC", value: strategy.lastExitStableUi, tone: Number(strategy.lastExitStableUi || 0) > 0 ? "positive" : "warning", meta: `${formatTokenAmount(strategy.lastExitTargetUi, "IO")} vendido` },
      { label: "Trailing sell", symbol: "TEXT", value: strategy.trailingTakeProfitEnabled ? (strategy.trailingArmed ? "ARMED" : "ON") : "OFF", tone: strategy.trailingTakeProfitEnabled ? "positive" : "negative", meta: trailingMeta },
      { label: "SOL fees restantes", symbol: "SOL", value: solUi, tone: balances.sol?.feeReserveOk ? "positive" : "negative", meta: `${balances.sol?.feeReserveOk ? "OK" : "BAJO"} · reserva min ${formatTokenAmount(minSolReserve, "SOL")} · libre ${formatTokenAmount(solFeeExcess, "SOL")}` },
      { label: "USDC caja", symbol: "USDC", value: balances.usdc?.uiAmount, tone: Number(balances.usdc?.uiAmount || 0) > 0 ? "positive" : "warning", meta: `${balances.usdc?.accountCount || 0} token acct` },
      { label: "IO inventario", symbol: "IO", value: balances.io?.uiAmount, tone: Number(balances.io?.uiAmount || 0) > 0 ? "positive" : "warning", meta: `tracked ${formatTokenAmount(strategy.positionUi ?? ((strategy.positionAmount || 0) / 10 ** 8), "IO")}` },
    ];
    els.botWalletCockpit.innerHTML = cards
      .map((card) => `
        <article class="balance-card ${card.tone} ${card.priority ? "sell-target-card" : ""}">
          <span>${card.label}</span>
          <strong>${card.symbol === "PRICE" ? formatPrice(card.value) : card.symbol === "TEXT" ? card.value : formatTokenAmount(card.value, card.symbol)}</strong>
          <em>${card.meta}</em>
        </article>
      `)
      .join("");
  }

  function renderBotTradeTape() {
    const cockpit = state.botCockpit;
    if (!els.botTradeTape) return;
    const trades = (cockpit?.trades || [])
      .filter((trade) => trade.status === "recorded" || trade.type === "execution.swap_succeeded")
      .slice(0, 8);
    if (!trades.length) {
      els.botTradeTape.innerHTML = `
        <div class="trade-tape-head"><span class="eyebrow">Actividad automática Hermes</span><strong>Sin swaps nuevos</strong></div>
        <div class="trade-row warning"><span>auto</span><strong>Watcher activo</strong><em>esperando trigger real</em></div>
      `;
      return;
    }
    const rows = trades.map((trade) => {
      const sideTone = trade.side === "buy" ? "positive" : trade.side === "sell" ? "negative" : "warning";
      const decimals = trade.side === "sell" ? 8 : 6;
      const symbol = trade.side === "sell" ? "IO" : "USDC";
      const amount = trade.amount ? Number(trade.amount) / 10 ** decimals : 0;
      const outAmount = trade.outAmount ? Number(trade.outAmount) / (trade.side === "sell" ? 1e6 : 1e8) : 0;
      const profitUsdc = trade.realizedProfitStableAmount ? Number(trade.realizedProfitStableAmount) / 1e6 : null;
      const route = trade.side === "sell" ? "IO → USDC" : trade.side === "buy" ? "USDC → IO" : "strategy";
      const detail = trade.side === "sell"
        ? `${amount ? formatCompact(amount) : ""} IO → ${outAmount ? formatTokenAmount(outAmount, "USDC") : "USDC"}${profitUsdc !== null ? ` · +${profitUsdc.toFixed(4)} USDC profit` : ""}`
        : `${amount ? formatTokenAmount(amount, "USDC") : ""}${outAmount ? ` → ${formatTokenAmount(outAmount, "IO")}` : ""}`;
      return `
        <div class="trade-row ${sideTone}" title="${trade.reason || trade.type}">
          <span>${new Date(trade.ts).toLocaleTimeString("en-GB", { hour12: false })}</span>
          <strong>${route}</strong>
          <em>${detail} · ${trade.action || trade.type}</em>
        </div>
      `;
    }).join("");
    els.botTradeTape.innerHTML = `
      <div class="trade-tape-head"><span class="eyebrow">Swaps automáticos reales</span><strong>${trades.length} swaps</strong></div>
      ${rows}
    `;
  }

  function renderTopHolders() {
    if (!els.topHolderPanel) return;
    const holders = state.topHolders?.holders || [];
    if (!holders.length) {
      els.topHolderPanel.innerHTML = `
        <div class="trade-tape-head"><span class="eyebrow">Top 15 holders IO</span><strong>syncing</strong></div>
        <div class="holder-empty">Esperando RPC para las wallets con más tokens.</div>
      `;
      return;
    }
    els.topHolderPanel.innerHTML = `
      <div class="trade-tape-head"><span class="eyebrow">Top 15 wallets acumulando IO</span><strong>${holders.length} wallets</strong></div>
      <div class="holder-list">
        ${holders.map((holder) => `
          <article class="holder-row">
            <span>#${holder.rank}</span>
            <a href="${walletExplorerUrl(holder.owner)}" target="_blank" rel="noopener noreferrer">${shorten(holder.owner)}</a>
            <strong>${formatCompact(holder.amountUi)} IO</strong>
            <em>${Number(holder.sharePct || 0) > 0 ? `${Number(holder.sharePct || 0).toFixed(3)}%` : "—"}</em>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderRiskControls() {
    const bot = state.data.bot || buildBotShell();
    const backend = state.botBackend;
    const riskItems = backend
      ? [
          { label: "Live execution", value: backend.liveTradingEnabled ? "armed" : "blocked", state: backend.liveTradingEnabled ? "locked" : "blocked" },
          { label: "Dry run", value: backend.dryRun ? "active" : "off", state: backend.dryRun ? "locked" : "blocked" },
          { label: "Max slippage", value: `${backend.risk.maxSlippageBps / 100}%`, state: "locked" },
          { label: "Max trade", value: `${formatUsd(backend.risk.maxTradeUsd)}`, state: "locked" },
          { label: "Max exit", value: `${formatUsd(backend.risk.maxExitTradeUsd)}`, state: "locked" },
          { label: "Allowed mints", value: String(backend.risk.allowedMints.length), state: "locked" },
          { label: "Provider health", value: `${backend.providerState.length} tracked`, state: "locked" },
        ]
      : bot.risk;
    els.riskGateList.innerHTML = riskItems
      .map(
        (item) => `
          <div class="risk-item ${item.state}">
            <span>${item.label}</span>
            <strong>${item.value}</strong>
          </div>
        `,
      )
      .join("");
  }

  function renderHermesBridge() {
    const bot = state.data.bot || buildBotShell();
    const capabilities = state.hermesCapabilities;
    const hermesRows = capabilities
      ? [
          { channel: "observe", status: capabilities.permissions.observe ? "ready" : "blocked", permission: "market events" },
          { channel: "request_quote", status: capabilities.permissions.requestQuote ? "ready" : "blocked", permission: "shared limiter" },
          { channel: "request_swap_intent", status: capabilities.permissions.requestSwapIntent ? "ready" : "blocked", permission: "risk gated" },
          { channel: "approve.execute", status: capabilities.permissions.execute ? "ready" : "blocked", permission: "dashboard only" },
          { channel: "sign.transaction", status: capabilities.permissions.signTransaction ? "ready" : "blocked", permission: "never exposed" },
        ]
      : bot.hermes;
    const hermesReady = capabilities?.status === "ready";
    els.hermesStatus.textContent = capabilities?.status?.toUpperCase() || bot.hermesStatus || "STANDBY";
    els.hermesStatus.className = `status-chip ${hermesReady ? "positive" : "warning"}`;
    els.hermesBridge.innerHTML = hermesRows
      .map(
        (item) => `
          <div class="hermes-row ${item.status}">
            <code>${item.channel}</code>
            <span>${item.status}</span>
            <strong>${item.permission}</strong>
          </div>
        `,
      )
      .join("");
  }

  function pushActionLog(message, tone = "warning") {
    if (!els.botActionLog) return;
    const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
    els.botActionLog.innerHTML = `<div class="${tone}">${time} / ${message}</div>`;
  }

  async function botApi(path, options = {}) {
    const response = await fetch(`${botApiBaseUrl()}${path}`, {
      method: options.method || "GET",
      headers: { "Content-Type": "application/json" },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(json.error || `${response.status} ${response.statusText}`);
    }
    return json;
  }

  async function refreshBotBackendStatus(silent = true) {
    try {
      const [status, cockpit, capabilities, watcherState, topHolders] = await Promise.all([
        botApi("/api/bot/status"),
        botApi("/api/bot/cockpit"),
        botApi("/api/hermes/capabilities"),
        botApi("/api/bot/watcher-state"),
        botApi("/api/bot/top-holders").catch((error) => ({ status: "degraded", error: error.message, holders: [] })),
      ]);
      state.botBackend = status;
      state.botCockpit = cockpit;
      state.hermesCapabilities = capabilities;
      state.watcherState = watcherState;
      state.topHolders = topHolders;
      state.backendWasOnline = true;
      renderBotControl();
      renderRiskControls();
      renderHermesBridge();
    } catch (error) {
      state.botBackend = null;
      state.botCockpit = null;
      state.hermesCapabilities = null;
      state.watcherState = null;
      state.topHolders = null;
      renderBotControl();
      renderRiskControls();
      renderHermesBridge();
      if (!silent && state.backendWasOnline) pushActionLog(`backend offline: ${error.message}`, "negative");
      state.backendWasOnline = false;
    }
  }

  function activeWhaleWallets(limit = 6) {
    return [...(state.data.wallets || [])]
      .filter((wallet) => wallet.address && (wallet.whaleTier === "whale" || wallet.whaleTier === "candidate" || wallet.tags?.includes("whale") || wallet.tags?.includes("candidate")))
      .sort((a, b) => Math.max(b.buySol || 0, b.sellSol || 0) - Math.max(a.buySol || 0, a.sellSol || 0))
      .slice(0, limit)
      .map((wallet) => wallet.address);
  }

  function applyWhaleDiscovery(discovery) {
    if (discovery?.status === "provider_required") {
      state.data.wallets = [];
      state.data.walletDetails = {};
      state.data.whaleStats = { ...(state.data.whaleStats || {}), whales: 0, buyWhales: 0, sellWhales: 0, candidates: 0, netUsd: 0, volumeSol: 0, watchVolumeSol: 0 };
      state.data.kpis = [
        { label: "Whale discovery", value: "API KEY FALTA", delta: "Birdeye o Helius requerido", tone: "negative" },
        { label: "Market data", value: state.data.token?.priceUsd ? formatPrice(state.data.token.priceUsd) : "OK parcial", delta: "DexScreener/RPC publico", tone: "warning" },
        { label: "Whales reales", value: "0", delta: "no provider = no wallets", tone: "negative" },
        { label: "Hardcoded", value: "NO", delta: "bloqueado", tone: "positive" },
        { label: "Siguiente paso", value: "BIRDEYE_API_KEY", delta: "reiniciar backend", tone: "warning" },
        { label: "Trading", value: "DRY RUN", delta: "no ejecutar sin datos", tone: "warning" },
      ];
      state.data.patterns = [{ title: "Provider requerido", value: "no fake whales", copy: "Configura BIRDEYE_API_KEY o HELIUS_API_KEY para descubrir wallets whale reales por token. La muestra RPC queda bloqueada para decisiones.", tone: "watch" }];
      state.data.signals = [{ score: 0, title: "Falta API de whale discovery", meta: "provider_required", copy: "El dashboard tiene market/RPC parcial, pero no puede descubrir wallets profesionales sin indexer enriquecido." }];
      return;
    }
    if (discovery?.quality !== "professional" || !discovery.wallets?.length) return;
    const rows = discovery.wallets.map((wallet, index) => ({
      address: wallet.wallet,
      buys: wallet.buyUsd > 0 ? 1 : 0,
      sells: wallet.sellUsd > 0 ? 1 : 0,
      buyUsd: wallet.buyUsd,
      sellUsd: wallet.sellUsd,
      buySol: 0,
      sellSol: 0,
      volumeUsd: wallet.buyUsd + wallet.sellUsd,
      holdingsUsd: 0,
      netIo: wallet.netUsd,
      whaleTier: "whale",
      whaleLabel: "WHALE",
      whaleReason: wallet.reason,
      activityLabel: wallet.lastSeen ? `indexed · ${new Date(wallet.lastSeen).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })} UTC` : "indexed",
      lastSeenTime: wallet.lastSeen ? new Date(wallet.lastSeen).toLocaleString("en-GB", { hour12: false, timeZone: "UTC" }) + " UTC" : "Indexed provider event; exact local time unavailable.",
      hours: wallet.lastSeen ? `indexed · ${new Date(wallet.lastSeen).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })} UTC` : "indexed",
      pattern: wallet.netUsd >= 0 ? "indexed accumulation" : "indexed distribution",
      score: wallet.confidence ?? 80,
      tags: ["whale", "indexed"],
      rank: index + 1,
    }));
    state.data.wallets = rows;
    state.data.walletDetails = Object.fromEntries(rows.map((wallet) => [wallet.address, { ...wallet, trades: [] }]));
    state.data.totals = {
      buys: discovery.events.filter((event) => event.side === "buy").length,
      sells: discovery.events.filter((event) => event.side === "sell").length,
      buyUsd: rows.reduce((sum, wallet) => sum + Number(wallet.buyUsd || 0), 0),
      sellUsd: rows.reduce((sum, wallet) => sum + Number(wallet.sellUsd || 0), 0),
    };
    state.data.whaleStats = {
      ...(state.data.whaleStats || {}),
      whales: rows.length,
      buyWhales: rows.filter((wallet) => wallet.buyUsd > wallet.sellUsd).length,
      sellWhales: rows.filter((wallet) => wallet.sellUsd > wallet.buyUsd).length,
      candidates: 0,
      holderOnly: 0,
      netUsd: rows.reduce((sum, wallet) => sum + Number(wallet.netIo || 0), 0),
      volumeSol: 0,
      watchVolumeSol: 0,
      netToken: 0,
    };
  }

  async function refreshBackendWhaleActivity(silent = true) {
    if (state.whaleActivityLoading) return;
    state.whaleActivityLoading = true;
    renderBackendWhaleFeed();
    try {
      state.whaleActivity = await botApi("/api/bot/whales/discover", {
        method: "POST",
        body: { mint: state.activeMint },
      });
      applyWhaleDiscovery(state.whaleActivity);
      renderAll();
    } catch (error) {
      state.whaleActivity = null;
      if (!silent) pushActionLog(`whale backend feed unavailable: ${error.message}`, "warning");
      renderMoneyFlow();
    } finally {
      state.whaleActivityLoading = false;
      renderMoneyFlow();
    }
  }

  function buildSwapIntent() {
    const detail = state.selectedWalletAddress ? state.data.walletDetails?.[state.selectedWalletAddress] : null;
    return {
      inputMint: WSOL_MINT,
      outputMint: state.activeMint,
      amount: "1000000",
      slippageBps: 50,
      estimatedUsd: 1,
      sourceSignal: {
        wallet: detail?.address || "dashboard",
        followScore: detail?.followScore || 0,
        pattern: detail?.primaryPattern || "manual quote",
        reason: detail?.summary || "dashboard manual dry-run",
      },
    };
  }

  async function requestBotQuote() {
    const result = await botApi("/api/bot/quote", {
      method: "POST",
      body: buildSwapIntent(),
    });
    pushActionLog(`quote ${result.order.router || "router"} out ${formatCompact(result.order.outAmount || 0)}`, "positive");
  }

  async function requestBotSwapIntent() {
    const result = await botApi("/api/bot/swap-intent", {
      method: "POST",
      body: buildSwapIntent(),
    });
    if (result.approval?.id) state.pendingApprovalId = result.approval.id;
    pushActionLog(result.status.replaceAll("_", " "), result.status === "dry_run_ready" ? "warning" : "positive");
  }

  async function requestStrategyStep() {
    if (!state.botBackend?.strategy?.enabled) {
      return requestBotSwapIntent();
    }

    const result = await botApi("/api/bot/strategy/prepare-next", {
      method: "POST",
      body: {},
    });
    if (result.prepared?.approval?.id) state.pendingApprovalId = result.prepared.approval.id;
    if (result.prepared?.status) {
      pushActionLog(`strategy ${result.evaluation.action} / ${result.prepared.status.replaceAll("_", " ")}`, "warning");
      return result;
    }
    pushActionLog(`strategy ${result.evaluation.action}: ${result.evaluation.reason || "no action"}`, "warning");
    return result;
  }

  function renderAll() {
    ensureSelectedWallet();
    renderTokenMeta();
    renderKpis();
    renderWallets();
    renderWalletDetail();
    renderHeatmap();
    renderPatterns();
    renderSignals();
    renderEvents();
    renderMoneyFlow();
    renderBotControl();
    renderRiskControls();
    renderHermesBridge();
  }

  function stopRefresh() {
    if (state.refreshTimer) window.clearInterval(state.refreshTimer);
    state.refreshTimer = null;
  }

  async function loadLiveSnapshot(mint, requestId, manual = false) {
    if (!window.LiveTracker) {
      setStatus("LIVE ENGINE MISSING", "error");
      return;
    }

    if (state.syncInFlight) return;
    state.syncInFlight = true;
    setLoading(true);
    setStatus(manual ? "LIVE RESYNC" : "LIVE SYNCING", "syncing");
    try {
      const liveData = await Promise.race([
        window.LiveTracker.loadTokenSnapshot(mint),
        new Promise((_, reject) => window.setTimeout(() => reject(new Error(`scan timeout after ${Math.round(SCAN_TIMEOUT_MS / 1000)}s`)), SCAN_TIMEOUT_MS)),
      ]);
      if (requestId !== state.activeRequestId) return;

      state.data = liveData;
      state.botMode = liveData.bot?.mode ?? state.botMode;
      state.whaleActivity = null;
      renderAll();
      refreshBackendWhaleActivity(true);
      setStatus(liveData.source?.degraded ? "LIVE DEGRADED" : "LIVE ON-CHAIN", liveData.source?.degraded ? "degraded" : "live");
      if (liveData.source?.message) pushActionLog(liveData.source.message, "warning");
    } catch (error) {
      if (requestId !== state.activeRequestId) return;
      setStatus("LIVE ERROR", "error");
      pushActionLog(error.message || "live sync failed", "negative");
    } finally {
      state.syncInFlight = false;
      if (requestId === state.activeRequestId) setLoading(false);
    }
  }

  function scanToken(mint) {
    const normalized = (mint || state.activeMint).trim();
    if (!base58Pattern.test(normalized)) {
      if (els.input) els.input.classList.add("invalid");
      setStatus("INVALID MINT", "error");
      return;
    }

    if (els.input) els.input.classList.remove("invalid");
    state.activeMint = normalized;
    state.activeRequestId += 1;
    stopRefresh();

    state.data = {
      ...buildInitialData(normalized),
      token: {
        symbol: "TOKEN",
        name: "resolviendo desde feeds reales",
        mint: normalized,
        pool: "Resolving live Solana pair",
        window: "live syncing",
      },
      kpis: [
        { label: "Precio real", value: "...", delta: "DexScreener", tone: "warning" },
        { label: "Volumen 24h", value: "...", delta: "DexScreener", tone: "warning" },
        { label: "Tx 24h", value: "...", delta: "pair feed", tone: "warning" },
        { label: "Whales RPC", value: "...", delta: "on-chain scan", tone: "warning" },
        { label: "Wallets", value: "...", delta: "RPC/indexer", tone: "warning" },
        { label: "Confianza", value: "...", delta: "building", tone: "warning" },
      ],
      patterns: [{ title: "Live sync", value: "running", copy: "Resolving real pair and parsing recent on-chain swaps. No fixture data is used.", tone: "watch" }],
      signals: [{ score: 0, title: "Syncing", meta: "live", copy: "No signal until provider data is parsed." }],
    };
    state.selectedWalletAddress = null;
    renderAll();

    const requestId = state.activeRequestId;
    loadLiveSnapshot(normalized, requestId, true);
    state.refreshTimer = window.setInterval(() => {
      loadLiveSnapshot(normalized, requestId, false);
    }, REFRESH_MS);
  }

  function bindEvents() {
    if (els.form) {
      els.form.addEventListener("submit", (event) => {
        event.preventDefault();
        scanToken(els.input?.value || state.activeMint);
      });
    }

    els.walletTable.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      const row = event.target.closest("tr[data-wallet-address]");
      if (!row) return;
      state.selectedWalletAddress = row.dataset.walletAddress;
      renderWallets();
      renderWalletDetail();
    });

    els.topMoneyWallets.addEventListener("click", (event) => {
      const card = event.target.closest("[data-wallet-address]");
      if (!card) return;
      state.selectedWalletAddress = card.dataset.walletAddress;
      renderWallets();
      renderWalletDetail();
    });

    els.whaleRefreshButton.addEventListener("click", () => {
      refreshBackendWhaleActivity(false);
    });

    document.querySelectorAll(".segment").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".segment").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        state.filter = button.dataset.filter;
        renderWallets();
        renderWalletDetail();
      });
    });

    document.querySelectorAll(".mode-button").forEach((button) => {
      button.addEventListener("click", () => {
        const requestedMode = button.dataset.botMode;
        if (requestedMode === "LIVE_LOCKED") {
          state.botMode = "LIVE_LOCKED";
          renderBotControl();
          pushActionLog("live trading locked until backend authorization", "negative");
          return;
        }

        state.botMode = requestedMode;
        renderBotControl();
        pushActionLog(`mode set to ${requestedMode}`, requestedMode === "OFF" ? "negative" : "warning");
      });
    });

    document.querySelectorAll("[data-bot-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.botAction;
        if (action === "emergency-stop") {
          state.botMode = "OFF";
          renderBotControl();
          botApi("/api/bot/emergency-stop", { method: "POST", body: { actor: "dashboard" } })
            .then(() => {
              pushActionLog("backend emergency stop active", "negative");
              refreshBotBackendStatus();
            })
            .catch((error) => pushActionLog(`emergency stop local only: ${error.message}`, "negative"));
          return;
        }
        if (action === "approve") {
          if (!state.pendingApprovalId) {
            pushActionLog("no pending approval from backend", "warning");
            return;
          }
          botApi(`/api/bot/approvals/${state.pendingApprovalId}/approve`, { method: "POST", body: { actor: "dashboard" } })
            .then(() => pushActionLog(`approval ${state.pendingApprovalId} ready`, "positive"))
            .catch((error) => pushActionLog(`approval failed: ${error.message}`, "negative"));
          return;
        }
        if (action === "quote") {
          requestBotQuote().catch((error) => pushActionLog(`quote blocked: ${error.message}`, "negative"));
          return;
        }
        requestStrategyStep().catch((error) => pushActionLog(`strategy blocked: ${error.message}`, "negative"));
      });
    });
  }

  function tickClock() {
    const now = new Date();
    els.clock.textContent = now.toLocaleTimeString("en-GB", { hour12: false });
  }

  function startMatrixRain() {
    const canvas = els.canvas;
    const ctx = canvas.getContext("2d");
    const glyphs = "010101IOBUYSELLSOL";
    const fontSize = 14;
    let width = 0;
    let height = 0;
    let drops = [];

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      drops = Array.from({ length: Math.ceil(width / fontSize) }, () => Math.random() * -60);
    }

    function draw() {
      ctx.fillStyle = "rgba(2, 6, 4, 0.12)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(0, 255, 138, 0.72)";
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((drop, index) => {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = index * fontSize;
        const y = drop * fontSize;
        ctx.fillText(char, x, y);
        if (y > height && Math.random() > 0.975) drops[index] = 0;
        drops[index] += 1;
      });
      window.requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();
  }

  bindEvents();
  renderAll();
  tickClock();
  setInterval(tickClock, 1000);
  startMatrixRain();
  setStatus("LOCAL WATCHER LIVE", "live");
  refreshBotBackendStatus();
  setInterval(() => refreshBotBackendStatus(), 3_000);
})();
