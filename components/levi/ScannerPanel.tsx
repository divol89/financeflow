import { FormEvent, useState } from "react";
import { Search, ShieldAlert } from "lucide-react";
import type { LeviAccessState, LeviScanReport } from "@/types/levi";
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
      const payload = (await response.json()) as ScanResponse;

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
    <section id="scanner" className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="rounded-lg border border-white/10 bg-[#071007]/90 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <LeviAuthPanel />

          <form onSubmit={handleScan} className="rounded-lg border border-white/10 bg-black/65 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-emerald-400/30 bg-emerald-400/10 text-emerald-200">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Scan a Solana creator wallet
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Enter a wallet to inspect recent mint creation, possible creator-side sell signals, and optional activity for one token.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <input
                value={wallet}
                onChange={(event) => setWallet(event.target.value)}
                placeholder="Creator wallet address"
                className="min-h-12 flex-1 rounded-md border border-white/15 bg-white px-4 text-sm text-black outline-none transition focus:border-emerald-300"
              />
              <input
                value={tokenMint}
                onChange={(event) => setTokenMint(event.target.value)}
                placeholder="Specific token mint to rank biggest moves (optional)"
                className="min-h-12 flex-1 rounded-md border border-white/15 bg-white px-4 text-sm text-black outline-none transition focus:border-emerald-300"
              />
              <button
                type="submit"
                disabled={isScanning || wallet.length < 32}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
              >
                <Search className="h-4 w-4" />
                {isScanning ? "Scanning..." : "Scan"}
              </button>
            </div>

            {error ? (
              <p className="mt-4 rounded-md border border-red-400/25 bg-red-950/70 px-3 py-2 text-sm text-red-100">
                {error}
              </p>
            ) : null}
          </form>
        </div>
      </div>

      {report ? <ScanResult report={report} /> : null}
    </section>
  );
}
