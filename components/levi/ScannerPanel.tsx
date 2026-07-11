import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  CheckCircle2,
  History,
  Loader2,
  Search,
  ShieldAlert,
  UserRoundSearch,
} from "lucide-react";
import type { LeviAccessState, LeviScanMode, LeviScanReport } from "@/types/levi";
import { readJsonResponse } from "@/lib/levi/fetchJson";
import { notifyLeviAuthStateChange } from "@/lib/levi/authEvents";
import { mergeScanReports } from "@/lib/levi/scanner/mergeReports";
import {
  SCANNER_PAGE_COOLDOWN_MS,
  scannerRetryDelay,
} from "@/lib/levi/scanner/retry";
import { useLeviAuth } from "@/hooks/useLeviAuth";
import { LeviAuthPanel } from "./LeviAuthPanel";
import { ScanResult } from "./ScanResult";

interface ScanResponse {
  access?: LeviAccessState;
  report?: LeviScanReport;
  code?: string;
  retryAfterMs?: number;
  error?: string;
}

interface ScanProgress {
  stage: "loading" | "complete" | "paused";
  inspected: number;
  target: number;
  batches: number;
  statusText?: string;
}

class ScannerRequestError extends Error {
  status: number;
  retryAfterMs: number;

  constructor(status: number, message: string, retryAfterMs = 0) {
    super(message);
    this.name = "ScannerRequestError";
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

function combineScannerReports(
  current: LeviScanReport | null,
  incoming: LeviScanReport
): LeviScanReport {
  if (!current) return incoming;
  const currentPages = current.scanCoverage.loadedPageIndexes || [];
  const incomingPages = incoming.scanCoverage.loadedPageIndexes || [];
  const incomingContainsCurrent =
    current.scanId &&
    current.scanId === incoming.scanId &&
    currentPages.every((page) => incomingPages.includes(page));
  return incomingContainsCurrent ? incoming : mergeScanReports(current, incoming);
}

function waitForScanner(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Scanner request aborted", "AbortError"));
      return;
    }
    const handleAbort = () => {
      window.clearTimeout(timeout);
      reject(new DOMException("Scanner request aborted", "AbortError"));
    };
    const timeout = window.setTimeout(() => {
      signal.removeEventListener("abort", handleAbort);
      resolve();
    }, ms);
    signal.addEventListener("abort", handleAbort, { once: true });
  });
}

export function ScannerPanel() {
  const router = useRouter();
  const auth = useLeviAuth();
  const activeRequest = useRef<AbortController | null>(null);
  const [mode, setMode] = useState<LeviScanMode>("token");
  const [wallet, setWallet] = useState("");
  const [tokenMint, setTokenMint] = useState("");
  const [report, setReport] = useState<LeviScanReport | null>(null);
  const [access, setAccess] = useState<LeviAccessState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [progress, setProgress] = useState<ScanProgress | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    const queryWallet = Array.isArray(router.query.wallet)
      ? router.query.wallet[0]
      : router.query.wallet;
    const queryToken = Array.isArray(router.query.token)
      ? router.query.token[0]
      : router.query.token;
    if (queryWallet) setWallet(queryWallet);
    if (queryToken) {
      setTokenMint(queryToken);
      setMode("token");
    }
  }, [router.isReady, router.query.token, router.query.wallet]);

  useEffect(() => {
    return () => activeRequest.current?.abort();
  }, []);

  const requestScan = async (input: {
    cursor?: string;
    scanId?: string;
    signal: AbortSignal;
  }) => {
    const response = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode,
        wallet,
        tokenMint: mode === "token" ? tokenMint.trim() : undefined,
        cursor: input.cursor,
        scanId: input.scanId,
      }),
      signal: input.signal,
    });
    const payload = await readJsonResponse<ScanResponse>(
      response,
      "Scanner is temporarily unavailable. Try again in a moment."
    );
    if (!response.ok || !payload.report) {
      if (response.status === 401) {
        await auth.refresh({ showErrors: false });
        notifyLeviAuthStateChange(auth.walletAddress);
      }
      throw new ScannerRequestError(
        response.status,
        payload.error || "Unable to scan wallet",
        payload.retryAfterMs ||
          Math.max(0, Number(response.headers.get("Retry-After") || 0) * 1_000)
      );
    }
    if (payload.access) setAccess(payload.access);
    return { report: payload.report, access: payload.access || null };
  };

  const requestScanWithRetry = async (input: {
    cursor?: string;
    scanId?: string;
    signal: AbortSignal;
  }) => {
    for (let attempt = 0; ; attempt += 1) {
      try {
        return await requestScan(input);
      } catch (reason) {
        if (!(reason instanceof ScannerRequestError)) throw reason;
        const waitMs = scannerRetryDelay({
          status: reason.status,
          attempt,
          retryAfterMs: reason.retryAfterMs,
        });
        if (waitMs === null) throw reason;
        setProgress((current) =>
          current
            ? {
                ...current,
                stage: "loading",
                statusText: `Public RPC cooling down. Retrying this batch in ${Math.ceil(waitMs / 1_000)}s.`,
              }
            : current
        );
        await waitForScanner(waitMs, input.signal);
      }
    }
    throw new Error("Unable to load scanner batch");
  };

  const handleScan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth.session) {
      setError("Sign Access above before running an on-chain scan.");
      return;
    }
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setError(null);
    setReport(null);
    setProgress({
      stage: "loading",
      inspected: 0,
      target: auth.access?.limits.scanLimit || 0,
      batches: 0,
    });
    setIsScanning(true);
    let accumulated: LeviScanReport | null = null;
    try {
      let cursor: string | undefined;
      let scanId: string | undefined;

      while (!controller.signal.aborted) {
        const payload = await requestScanWithRetry({
          cursor,
          scanId,
          signal: controller.signal,
        });
        accumulated = combineScannerReports(accumulated, payload.report);
        scanId = accumulated.scanId;
        setReport(accumulated);
        const coverage = accumulated.scanCoverage;
        const target =
          payload.access?.limits.scanLimit || coverage.tierWindowLimit || 0;
        setProgress({
          stage: coverage.initialWindowComplete ? "complete" : "loading",
          inspected: coverage.selectedSignatures,
          target,
          batches: coverage.loadedPageIndexes?.length || 1,
          statusText: undefined,
        });

        cursor = coverage.nextCursor || undefined;
        if (coverage.initialWindowComplete || !cursor) break;
        setProgress((current) =>
          current
            ? {
                ...current,
                statusText: "Waiting briefly before the next blockchain batch.",
              }
            : current
        );
        await waitForScanner(SCANNER_PAGE_COOLDOWN_MS, controller.signal);
      }
    } catch (reason) {
      if (controller.signal.aborted) return;
      const message =
        reason instanceof ScannerRequestError && reason.status === 401
          ? accumulated
            ? "Your signed session expired. Sign Access again; the loaded blockchain batches remain visible."
            : "Your signed session expired. Sign Access again to run this scan."
          : reason instanceof Error
            ? reason.message
            : "Unable to scan wallet";
      setError(
        accumulated
          ? `Partial result retained after ${accumulated.scanCoverage.loadedTransactions} transaction(s). ${message}`
          : message
      );
      setProgress((current) =>
        accumulated && current ? { ...current, stage: "paused" } : null
      );
    } finally {
      if (activeRequest.current === controller) activeRequest.current = null;
      setIsScanning(false);
    }
  };

  const handleExtend = async () => {
    const cursor = report?.scanCoverage.nextCursor;
    if (!report || !cursor) return;
    if (!auth.session) {
      setError("Your signed session expired. Sign Access again to extend this scan.");
      return;
    }
    const controller = new AbortController();
    activeRequest.current = controller;
    setError(null);
    setIsExtending(true);
    try {
      const payload = await requestScanWithRetry({
        cursor,
        scanId: report.scanId,
        signal: controller.signal,
      });
      const extended = combineScannerReports(report, payload.report);
      setReport(extended);
      setProgress({
        stage: "complete",
        inspected: extended.scanCoverage.selectedSignatures,
        target: extended.scanCoverage.tierWindowLimit || 0,
        batches: extended.scanCoverage.loadedPageIndexes?.length || 1,
        statusText: undefined,
      });
    } catch (reason) {
      if (!controller.signal.aborted) {
        setError(
          reason instanceof ScannerRequestError && reason.status === 401
            ? "Your signed session expired. Sign Access again; the current report remains available."
            : reason instanceof Error
              ? reason.message
              : "Unable to load an older window"
        );
      }
    } finally {
      if (activeRequest.current === controller) activeRequest.current = null;
      setIsExtending(false);
    }
  };

  const formReady =
    wallet.trim().length >= 32 &&
    (mode === "creator" || tokenMint.trim().length >= 32);

  return (
    <section id="scanner" className="levi-scanner">
      <div className="levi-scanner-shell levi-scanner-shell-v2">
        <LeviAuthPanel compact />

        <form onSubmit={handleScan} className="levi-scanner-form">
          <div className="flex items-start gap-3">
            <div className="levi-scanner-icon">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="levi-scanner-title">Inspect wallet behavior</h2>
              <p className="levi-scanner-copy">
                Read how a user wallet or creator is moving in one token, with verified trades kept separate from transfers.
              </p>
            </div>
          </div>

          <div className="levi-segmented-control mt-5" aria-label="Scanner mode">
            <button
              type="button"
              disabled={isScanning || isExtending}
              className={mode === "token" ? "is-active" : ""}
              onClick={() => {
                setMode("token");
                setReport(null);
                setProgress(null);
              }}
            >
              <Search className="h-4 w-4" />
              User wallet + token
            </button>
            <button
              type="button"
              disabled={isScanning || isExtending}
              className={mode === "creator" ? "is-active" : ""}
              onClick={() => {
                setMode("creator");
                setReport(null);
                setProgress(null);
              }}
            >
              <UserRoundSearch className="h-4 w-4" />
              Creator behavior
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            <label className="levi-field-label">
              {mode === "token" ? "User wallet to inspect" : "Creator wallet to inspect"}
              <input
                value={wallet}
                onChange={(event) => setWallet(event.target.value)}
                placeholder="Solana wallet address"
                className="levi-form-input"
                disabled={isScanning || isExtending}
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            {mode === "token" ? (
              <label className="levi-field-label">
                Token mint
                <input
                  value={tokenMint}
                  onChange={(event) => setTokenMint(event.target.value)}
                  placeholder="Token contract address"
                  className="levi-form-input"
                  disabled={isScanning || isExtending}
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>
            ) : null}
            <button
              type="submit"
              disabled={
                isScanning ||
                !formReady ||
                auth.isLoading ||
                !auth.session
              }
              className="levi-primary-button disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
            >
              <Search className="h-4 w-4" />
              {isScanning
                ? `Reading batch ${(progress?.batches || 0) + 1}...`
                : "Run evidence scan"}
            </button>
          </div>

          {!auth.isLoading && !auth.session ? (
            <p className="levi-scanner-session-note">
              Sign Access above to verify wallet ownership. The inspected wallet can be any public Solana user or creator address.
            </p>
          ) : null}

          {progress ? (
            <div
              className={`levi-scan-progress is-${progress.stage}`}
              role="status"
              aria-live="polite"
            >
              <div>
                <span>
                  {progress.stage === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {progress.statusText || (progress.stage === "loading"
                    ? "Reading blockchain batches"
                    : progress.stage === "paused"
                      ? "Partial result retained"
                      : "Initial on-chain window complete")}
                </span>
                <strong>
                  {progress.inspected}
                  {progress.target > 0 ? ` / ${progress.target}` : ""} signature slots
                </strong>
              </div>
              <div className="levi-scan-progress-track">
                <span
                  style={{
                    width: `${
                      progress.target > 0
                        ? Math.min(100, (progress.inspected / progress.target) * 100)
                        : progress.stage === "complete"
                          ? 100
                          : 8
                    }%`,
                  }}
                />
              </div>
              <small>
                Results appear after each bounded RPC request. Completed batches are not discarded if a later request pauses.
              </small>
            </div>
          ) : null}

          {access ? (
            <p className="levi-scanner-access-note">
              <History className="h-4 w-4" />
              {access.tier === "full"
                ? "Full access loads the latest 40 signature slots progressively and can extend older history on demand."
                : "Basic access loads up to 20 signature slots progressively."}
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 border-l border-red-400/60 bg-red-950/30 px-3 py-2 text-sm text-red-100" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </div>

      {report ? (
        <ScanResult
          report={report}
          canExtend={
            !isScanning && Boolean(access?.limits.canExtendScanHistory)
          }
          isExtending={isExtending}
          onExtend={handleExtend}
        />
      ) : null}
    </section>
  );
}
