import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { History, Search, ShieldAlert, UserRoundSearch } from "lucide-react";
import type { LeviAccessState, LeviScanMode, LeviScanReport } from "@/types/levi";
import { readJsonResponse } from "@/lib/levi/fetchJson";
import { mergeScanReports } from "@/lib/levi/scanner/mergeReports";
import { LeviAuthPanel } from "./LeviAuthPanel";
import { ScanResult } from "./ScanResult";

interface ScanResponse {
  access?: LeviAccessState;
  report?: LeviScanReport;
  error?: string;
}

export function ScannerPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<LeviScanMode>("token");
  const [wallet, setWallet] = useState("");
  const [tokenMint, setTokenMint] = useState("");
  const [report, setReport] = useState<LeviScanReport | null>(null);
  const [access, setAccess] = useState<LeviAccessState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

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

  const requestScan = async (cursor?: string) => {
    const response = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode,
        wallet,
        tokenMint: mode === "token" ? tokenMint.trim() : undefined,
        cursor,
      }),
    });
    const payload = await readJsonResponse<ScanResponse>(
      response,
      "Scanner is temporarily unavailable. Try again in a moment."
    );
    if (!response.ok || !payload.report) {
      throw new Error(payload.error || "Unable to scan wallet");
    }
    if (payload.access) setAccess(payload.access);
    return payload.report;
  };

  const handleScan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setReport(null);
    setIsScanning(true);
    try {
      setReport(await requestScan());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to scan wallet");
    } finally {
      setIsScanning(false);
    }
  };

  const handleExtend = async () => {
    const cursor = report?.scanCoverage.nextCursor;
    if (!report || !cursor) return;
    setError(null);
    setIsExtending(true);
    try {
      const older = await requestScan(cursor);
      setReport(mergeScanReports(report, older));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load an older window");
    } finally {
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
                Separate observed swaps from transfers and review exactly what the loaded window can prove.
              </p>
            </div>
          </div>

          <div className="levi-segmented-control mt-5" aria-label="Scanner mode">
            <button
              type="button"
              className={mode === "token" ? "is-active" : ""}
              onClick={() => {
                setMode("token");
                setReport(null);
              }}
            >
              <Search className="h-4 w-4" />
              Wallet + token
            </button>
            <button
              type="button"
              className={mode === "creator" ? "is-active" : ""}
              onClick={() => {
                setMode("creator");
                setReport(null);
              }}
            >
              <UserRoundSearch className="h-4 w-4" />
              Creator history
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            <label className="levi-field-label">
              Wallet under analysis
              <input
                value={wallet}
                onChange={(event) => setWallet(event.target.value)}
                placeholder="Solana wallet address"
                className="levi-form-input"
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
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>
            ) : null}
            <button
              type="submit"
              disabled={isScanning || !formReady}
              className="levi-primary-button disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
            >
              <Search className="h-4 w-4" />
              {isScanning ? "Reading Solana..." : "Run evidence scan"}
            </button>
          </div>

          {access ? (
            <p className="levi-scanner-access-note">
              <History className="h-4 w-4" />
              {access.tier === "full"
                ? "Full access can inspect older windows on demand."
                : "Basic access includes the latest observed window."}
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
          canExtend={Boolean(access?.limits.canExtendScanHistory)}
          isExtending={isExtending}
          onExtend={handleExtend}
        />
      ) : null}
    </section>
  );
}
