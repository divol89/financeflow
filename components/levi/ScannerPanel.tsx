import { FormEvent, useState } from "react";
import { Search, ShieldAlert } from "lucide-react";
import type { LeviAccessState, LeviScanReport } from "@/types/levi";
import { readJsonResponse } from "@/lib/levi/fetchJson";
import { LeviAuthPanel } from "./LeviAuthPanel";
import { ScanResult } from "./ScanResult";

interface ScanResponse {
  access?: LeviAccessState;
  report?: LeviScanReport;
  error?: string;
}

export function ScannerPanel() {
  const [wallet, setWallet] = useState("");
  const [tokenMint, setTokenMint] = useState("");
  const [report, setReport] = useState<LeviScanReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setReport(null);
    setIsScanning(true);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet,
          tokenMint: tokenMint.trim() || undefined,
        }),
      });
      const payload = await readJsonResponse<ScanResponse>(
        response,
        "Scanner is temporarily unavailable. Try again in a moment."
      );

      if (!response.ok || !payload.report) {
        throw new Error(payload.error || "Unable to scan wallet");
      }

      setReport(payload.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to scan wallet");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <section id="scanner" className="levi-scanner">
      <div className="levi-scanner-shell">
        <LeviAuthPanel />

        <form onSubmit={handleScan} className="levi-scanner-form">
          <div className="flex items-start gap-3">
            <div className="levi-scanner-icon">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="levi-scanner-title">Scan a Solana creator wallet</h2>
              <p className="levi-scanner-copy">
                Enter a wallet to inspect recent mint creation, possible creator-side sell signals, and optional activity for one token.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <input
              value={wallet}
              onChange={(event) => setWallet(event.target.value)}
              placeholder="Creator wallet address"
              className="levi-form-input"
            />
            <input
              value={tokenMint}
              onChange={(event) => setTokenMint(event.target.value)}
              placeholder="Specific token mint to rank biggest moves (optional)"
              className="levi-form-input"
            />
            <button
              type="submit"
              disabled={isScanning || wallet.length < 32}
              className="levi-primary-button disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
            >
              <Search className="h-4 w-4" />
              {isScanning ? "Scanning..." : "Scan"}
            </button>
          </div>

          {error ? (
            <p className="mt-4 border-l border-red-400/60 bg-red-950/30 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          ) : null}
        </form>
      </div>

      {report ? <ScanResult report={report} /> : null}
    </section>
  );
}
