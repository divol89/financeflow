(function () {
  const fixtures = window.TRACKER_FIXTURES;
  const state = {
    data: fixtures.io,
    filter: "whale",
    botMode: fixtures.io.bot.mode,
    refreshTimer: null,
    syncInFlight: false,
    activeRequestId: 0,
    activeMint: fixtures.ioMint,
    selectedWalletAddress: null,
    botBackend: null,
    hermesCapabilities: null,
    pendingApprovalId: null,
    backendWasOnline: false,
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
    botModeBadge: document.getElementById("botModeBadge"),
    botRuntime: document.getElementById("botRuntime"),
    riskGateList: document.getElementById("riskGateList"),
    hermesStatus: document.getElementById("hermesStatus"),
    hermesBridge: document.getElementById("hermesBridge"),
    botActionLog: document.getElementById("botActionLog"),
    clock: document.getElementById("signalClock"),
    canvas: document.getElementById("matrixRain"),
  };

  const base58Pattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  const REFRESH_MS = 75_000;
  function isLocalRuntime() {
    const host = window.location.hostname;
    return window.location.protocol === "file:" || host === "127.0.0.1" || host === "localhost";
  }

  const BOT_API_URL = window.TRACKER_CONFIG?.botApiUrl ?? (isLocalRuntime() ? "http://127.0.0.1:8787" : "");
  const WSOL_MINT = "So11111111111111111111111111111111111111112";
  const FOCUS_WHALE_SOL = 30;
  const WATCH_SOL = 10;
  const LOOKBACK_HOURS = 24;

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
    els.scanButton.disabled = isLoading;
    els.scanButton.textContent = isLoading ? "Sync" : "Scan";
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
    return (state.data.wallets || []).filter(walletMatchesFilter);
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
      state.selectedWalletAddress = null;
      els.walletTable.innerHTML = emptyRow(
        state.filter === "whale"
          ? `No hay compras o ventas de ballenas >=${FOCUS_WHALE_SOL} SOL en las ultimas ${LOOKBACK_HOURS}h. No se muestran trades viejos para rellenar.`
          : `No wallets match this ${LOOKBACK_HOURS}h fresh-trade filter.`,
      );
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
            <td class="delta ${Number(wallet.buySol || 0) >= FOCUS_WHALE_SOL ? "positive" : Number(wallet.buySol || 0) >= WATCH_SOL ? "warning" : ""}">${formatSol(wallet.buySol)}</td>
            <td>${wallet.sells}</td>
            <td class="delta ${Number(wallet.sellSol || 0) >= FOCUS_WHALE_SOL ? "negative" : Number(wallet.sellSol || 0) >= WATCH_SOL ? "warning" : ""}">${formatSol(wallet.sellSol)}</td>
            <td>${formatUsd(wallet.volumeUsd)}</td>
            <td class="${wallet.netIo >= 0 ? "delta positive" : "delta negative"}">${formatSigned(wallet.netIo)}</td>
            <td><span class="pill ${wallet.whaleTier === "whale" ? "whale" : wallet.whaleTier === "candidate" ? "watch" : ""}" title="${wallet.whaleReason || ""}">${wallet.whaleLabel || wallet.whaleTier || "n/a"}</span></td>
            <td>${wallet.hours}</td>
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
        ${metric("SOL compra eq", formatSol(detail.buySol), Number(detail.buySol || 0) >= FOCUS_WHALE_SOL ? "positive" : Number(detail.buySol || 0) >= WATCH_SOL ? "warning" : "")}
        ${metric("SOL venta eq", formatSol(detail.sellSol), Number(detail.sellSol || 0) >= FOCUS_WHALE_SOL ? "negative" : Number(detail.sellSol || 0) >= WATCH_SOL ? "warning" : "")}
        ${Number(detail.volumeSol || 0) ? metric("SOL eq volume", formatSol(detail.volumeSol), detail.volumeSol >= FOCUS_WHALE_SOL ? "positive" : "warning") : ""}
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
          <div class="hour-cell" style="--buy-alpha:${buyAlpha}; --sell-alpha:${sellAlpha}">
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
      els.events.innerHTML = `<article class="event-item"><div class="event-copy">No fresh whale swaps >=${FOCUS_WHALE_SOL} SOL in the last ${LOOKBACK_HOURS}h.</div></article>`;
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

  function botTone(mode) {
    if (mode === "OFF" || mode === "LIVE_LOCKED" || mode === "LOCKED") return "negative";
    if (mode === "ARMED" || mode === "DRY_RUN" || mode === "LIVE_ARMED") return "warning";
    return "positive";
  }

  function renderBotControl() {
    const bot = state.data.bot || fixtures.io.bot;
    const backend = state.botBackend;
    const strategy = backend?.strategy;
    const mode = backend?.mode || state.botMode;
    const runtime = backend
      ? [
          { label: "Backend", value: "online", tone: "positive" },
          { label: "Mode", value: mode.toLowerCase(), tone: backend.dryRun ? "warning" : backend.liveTradingEnabled ? "positive" : "negative" },
          { label: "Wallet", value: backend.walletReady ? shorten(backend.publicKey) : "not ready", tone: backend.walletReady ? "positive" : "negative" },
          { label: "Strategy", value: strategy?.enabled ? strategy.phase : "disabled", tone: strategy?.enabled ? "warning" : "negative" },
          { label: "TP", value: strategy ? `${formatUsd(strategy.takeProfitStableUi)} USDT` : "n/a", tone: "positive" },
          { label: "Rebuy", value: strategy ? `${strategy.rebuyPullbackPct}% dip` : "n/a", tone: "warning" },
          { label: "Live", value: backend.liveTradingEnabled ? "armed" : "locked", tone: backend.liveTradingEnabled ? "warning" : "negative" },
          { label: "Approval", value: backend.requireManualApproval ? "required" : "blocked", tone: backend.requireManualApproval ? "positive" : "negative" },
          { label: "Emergency", value: backend.emergencyStopped ? "active" : "clear", tone: backend.emergencyStopped ? "negative" : "positive" },
        ]
      : [
          { label: "Backend", value: "offline", tone: "negative" },
          ...bot.runtime.slice(1),
        ];
    els.botModeBadge.className = `status-chip ${botTone(mode)}`;
    els.botModeBadge.textContent = mode.replace("_", " ");
    document.querySelectorAll(".mode-button").forEach((button) => {
      button.classList.toggle("active", button.dataset.botMode === state.botMode);
    });

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
  }

  function renderRiskControls() {
    const bot = state.data.bot || fixtures.io.bot;
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
    const bot = state.data.bot || fixtures.io.bot;
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
    const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
    els.botActionLog.innerHTML = `<div class="${tone}">${time} / ${message}</div>`;
  }

  async function botApi(path, options = {}) {
    if (!BOT_API_URL) {
      throw new Error("Hosted dashboard is read-only; local bot backend is not connected");
    }

    const response = await fetch(`${BOT_API_URL}${path}`, {
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
      const [status, capabilities] = await Promise.all([
        botApi("/api/bot/status"),
        botApi("/api/hermes/capabilities"),
      ]);
      state.botBackend = status;
      state.hermesCapabilities = capabilities;
      state.backendWasOnline = true;
      renderBotControl();
      renderRiskControls();
      renderHermesBridge();
    } catch (error) {
      state.botBackend = null;
      state.hermesCapabilities = null;
      renderBotControl();
      renderRiskControls();
      renderHermesBridge();
      if (!silent && state.backendWasOnline) pushActionLog(`backend offline: ${error.message}`, "negative");
      state.backendWasOnline = false;
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
      const liveData = await window.LiveTracker.loadTokenSnapshot(mint);
      if (requestId !== state.activeRequestId) return;

      state.data = liveData;
      state.botMode = liveData.bot?.mode ?? state.botMode;
      renderAll();
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
    const normalized = mint.trim();
    if (!base58Pattern.test(normalized)) {
      els.input.classList.add("invalid");
      setStatus("INVALID MINT", "error");
      return;
    }

    els.input.classList.remove("invalid");
    state.activeMint = normalized;
    state.activeRequestId += 1;
    stopRefresh();

    state.data = {
      ...fixtures.io,
      token: {
        symbol: normalized === fixtures.ioMint ? "IO" : "TOKEN",
        name: normalized === fixtures.ioMint ? "io.net" : "custom mint",
        mint: normalized,
        pool: "Resolving live Solana pair",
        window: `last ${LOOKBACK_HOURS}h / whale >=${FOCUS_WHALE_SOL} SOL`,
      },
      kpis: [
        { label: "Ballenas foco", value: "...", delta: "RPC sync", tone: "warning" },
        { label: "Whale flow", value: "...", delta: "RPC sync", tone: "warning" },
        { label: "Whale volume", value: "...", delta: "RPC sync", tone: "warning" },
        { label: "Muestra 24h", value: "...", delta: "RPC sync", tone: "warning" },
        { label: "Volumen par 24h", value: "...", delta: "DexScreener", tone: "warning" },
        { label: "Confianza", value: "...", delta: "building", tone: "warning" },
      ],
      wallets: [],
      walletDetails: {},
      hourly: Array.from({ length: 24 }, (_, hour) => [hour, 0, 0]),
      patterns: [{ title: "Live sync", value: "running", copy: "Resolving pair and parsing recent on-chain swaps.", tone: "watch" }],
      signals: [{ score: 0, title: "Syncing", meta: "live", copy: "No signal until provider data is parsed." }],
      events: [],
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
    els.form.addEventListener("submit", (event) => {
      event.preventDefault();
      scanToken(els.input.value);
    });

    els.walletTable.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      const row = event.target.closest("tr[data-wallet-address]");
      if (!row) return;
      state.selectedWalletAddress = row.dataset.walletAddress;
      renderWallets();
      renderWalletDetail();
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
  tickClock();
  setInterval(tickClock, 1000);
  startMatrixRain();
  scanToken(els.input.value);
  refreshBotBackendStatus();
  setInterval(() => refreshBotBackendStatus(), 10_000);
})();
