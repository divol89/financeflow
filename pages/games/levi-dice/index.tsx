import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Dice5,
  Plus,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users2,
  Wallet,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import Dice3D from "@/components/games/Dice3D";
import type { LeviAccessState } from "@/types/levi";
import { useInjectedSolanaWallet } from "@/hooks/useInjectedSolanaWallet";
import { readJsonResponse } from "@/lib/levi/fetchJson";
import {
  LEVI_DICE_MINT,
  LEVI_DICE_PROGRAM_ID,
  formatLeviAmount,
  getLeviDicePot,
  getLeviDicePrize,
  isLeviDiceProgramReady,
  makeLeviDicePreviewGame,
  readLeviDicePreviewGames,
  upsertLeviDicePreviewGame,
  type LeviDicePreviewGame,
} from "@/lib/levi/dice";

interface AccessResponse {
  access?: LeviAccessState;
  error?: string;
}

function LeviDiceLobby() {
  const router = useRouter();
  const wallet = useInjectedSolanaWallet();
  const [access, setAccess] = useState<LeviAccessState | null>(null);
  const [games, setGames] = useState<LeviDicePreviewGame[]>([]);
  const [entryFee, setEntryFee] = useState("1000");
  const [playerCount, setPlayerCount] = useState(2);
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);

  const programReady = isLeviDiceProgramReady();
  const numericEntryFee = Number(entryFee) || 0;
  const pot = getLeviDicePot(numericEntryFee, playerCount);
  const winnerPrize = getLeviDicePrize(numericEntryFee, playerCount);
  const hasEnoughLevi = access ? access.balance >= numericEntryFee : false;

  useEffect(() => {
    setGames(readLeviDicePreviewGames());
  }, []);

  const refreshAccess = async (address: string) => {
    setIsCheckingAccess(true);
    try {
      const response = await fetch(`/api/access?wallet=${encodeURIComponent(address)}`);
      const payload = await readJsonResponse<AccessResponse>(
        response,
        "Unable to read LEVI balance"
      );
      if (!response.ok || !payload.access) {
        throw new Error(payload.error || "Unable to read LEVI balance");
      }
      setAccess(payload.access);
      return payload.access;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to read LEVI balance");
      return null;
    } finally {
      setIsCheckingAccess(false);
    }
  };

  const connectWallet = async () => {
    try {
      const connected = await wallet.connect();
      await refreshAccess(connected.address);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Wallet connection failed");
    }
  };

  const createPreviewGame = async () => {
    try {
      let connected: string;
      if (wallet.address) {
        connected = wallet.address;
      } else {
        const nextWallet = await wallet.connect();
        connected = nextWallet.address;
      }
      const currentAccess = access || (await refreshAccess(connected));

      if (!currentAccess) return;
      if (numericEntryFee <= 0) {
        toast.error("Enter a valid LEVI entry fee.");
        return;
      }
      if (playerCount < 2 || playerCount > 5) {
        toast.error("Choose 2-5 players.");
        return;
      }
      if (currentAccess.balance < numericEntryFee) {
        toast.error("This wallet does not hold enough LEVI for that entry.");
        return;
      }

      const game = makeLeviDicePreviewGame({
        creator: connected,
        entryFee: numericEntryFee,
        maxPlayers: playerCount,
      });
      const nextGames = upsertLeviDicePreviewGame(game);
      setGames(nextGames);
      toast.success("LEVI Dice preview room created.");
      void router.push(`/games/levi-dice/${game.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to create room");
    }
  };

  const sortedGames = useMemo(
    () => [...games].sort((a, b) => b.createdAt - a.createdAt),
    [games]
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-400/30">
      <Head>
        <title>LEVI Dice | Solana Preview</title>
        <meta
          name="description"
          content="LEVI Dice preview for Solana. Same Crazy Dice flow prepared for LEVI token escrow."
        />
      </Head>
      <ToastContainer position="bottom-right" theme="dark" />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(250,204,21,0.12),transparent_26%)]" />
        <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
                <Sparkles className="h-4 w-4" />
                Solana LEVI edition
              </div>
              <h1 className="mt-6 text-5xl font-black tracking-tight text-white sm:text-7xl">
                LEVI DICE
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                The Crazy Dice arena prepared for Solana and the existing LEVI
                Token-2022 mint. The UI is live; token escrow stays disabled
                until the Solana program is deployed.
              </p>
              <div className="mt-6 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <Users2 className="mb-3 h-5 w-5 text-emerald-300" />
                  <p className="font-semibold text-white">2-5 players</p>
                  <p className="mt-1 text-slate-400">Same lobby format.</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <Trophy className="mb-3 h-5 w-5 text-yellow-300" />
                  <p className="font-semibold text-white">95% prize</p>
                  <p className="mt-1 text-slate-400">5% protocol fee.</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <ShieldCheck className="mb-3 h-5 w-5 text-cyan-300" />
                  <p className="font-semibold text-white">Escrow-first</p>
                  <p className="mt-1 text-slate-400">No unsafe token moves.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Dice3D
                size={180}
                autoRoll
                autoRollInterval={5000}
                glowColor="rgba(16, 185, 129, 0.48)"
              />
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-lg border border-white/10 bg-black/70 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">Solana Wallet</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Connect Phantom or Solflare to read LEVI balance.
                  </p>
                </div>
                <Wallet className="h-5 w-5 text-emerald-300" />
              </div>

              <button
                type="button"
                onClick={() => void connectWallet()}
                disabled={wallet.isConnecting || isCheckingAccess}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {wallet.address
                  ? `${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)}`
                  : wallet.isConnecting || isCheckingAccess
                  ? "Connecting..."
                  : "Connect Solana"}
              </button>

              {wallet.error ? (
                <p className="mt-3 rounded-md border border-red-400/30 bg-red-950/60 px-3 py-2 text-sm text-red-100">
                  {wallet.error}
                </p>
              ) : null}

              <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase text-slate-500">LEVI Balance</p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {access ? formatLeviAmount(access.balance) : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500">Mint</p>
                  <p className="mt-1 break-all font-mono text-xs text-slate-300">
                    {LEVI_DICE_MINT}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-black/70 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Create LEVI Dice Room
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Preview rooms use local state only. On-chain play needs the
                    Solana program ID.
                  </p>
                </div>
                <span
                  className={`rounded-md border px-3 py-1 text-xs font-semibold ${
                    programReady
                      ? "border-emerald-400/40 bg-emerald-950/50 text-emerald-200"
                      : "border-amber-400/40 bg-amber-950/50 text-amber-200"
                  }`}
                >
                  {programReady ? "Program ready" : "Program pending"}
                </span>
              </div>

              <div className="mt-5 grid gap-4">
                <div>
                  <label className="text-xs uppercase text-slate-500">
                    Players
                  </label>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {[2, 3, 4, 5].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setPlayerCount(count)}
                        className={`rounded-md border px-3 py-3 text-sm font-semibold transition ${
                          playerCount === count
                            ? "border-emerald-300 bg-emerald-400 text-black"
                            : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase text-slate-500">
                    Entry Fee (LEVI)
                  </label>
                  <input
                    value={entryFee}
                    onChange={(event) => setEntryFee(event.target.value)}
                    inputMode="decimal"
                    className="mt-2 min-h-12 w-full rounded-md border border-white/15 bg-white px-4 text-sm text-black outline-none transition focus:border-emerald-300"
                  />
                </div>

                <div className="grid gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-slate-500">Max Pot</p>
                    <p className="mt-1 font-semibold text-white">
                      {formatLeviAmount(pot)} LEVI
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Winner Prize</p>
                    <p className="mt-1 font-semibold text-emerald-200">
                      {formatLeviAmount(winnerPrize)} LEVI
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Balance Check</p>
                    <p
                      className={`mt-1 font-semibold ${
                        hasEnoughLevi ? "text-emerald-200" : "text-amber-200"
                      }`}
                    >
                      {access ? (hasEnoughLevi ? "Ready" : "Not enough") : "Connect"}
                    </p>
                  </div>
                </div>

                {!programReady ? (
                  <div className="flex gap-3 rounded-lg border border-amber-400/20 bg-amber-950/30 p-4 text-sm text-amber-100">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      Real LEVI wagers are disabled until a Solana escrow program
                      is deployed. Preview rooms do not move tokens.
                    </p>
                  </div>
                ) : (
                  <p className="break-all rounded-lg border border-emerald-400/20 bg-emerald-950/30 p-4 font-mono text-xs text-emerald-100">
                    {LEVI_DICE_PROGRAM_ID}
                  </p>
                )}

                <Button
                  onClick={() => void createPreviewGame()}
                  className="min-h-12 bg-emerald-400 font-bold text-black hover:bg-emerald-300"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Preview Room
                </Button>
              </div>
            </section>
          </div>

          <section className="mt-10">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  LEVI Dice Preview Rooms
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Local preview only until on-chain program deployment.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setGames(readLeviDicePreviewGames())}
                className="border-white/15 text-white hover:bg-white/10"
              >
                Refresh
              </Button>
            </div>

            {sortedGames.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-10 text-center">
                <Dice5 className="mx-auto mb-3 h-12 w-12 text-slate-600" />
                <p className="text-slate-400">No LEVI Dice rooms yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {sortedGames.map((game) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-white/10 bg-black/65 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">
                          Room {game.id.slice(0, 8)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(game.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="rounded-md bg-white/10 px-2 py-1 text-xs text-slate-300">
                        {game.status}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Entry</span>
                        <span className="font-semibold text-emerald-200">
                          {formatLeviAmount(game.entryFee)} LEVI
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Players</span>
                        <span className="font-semibold text-white">
                          {game.players.length}/{game.maxPlayers}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Prize</span>
                        <span className="font-semibold text-yellow-200">
                          {formatLeviAmount(
                            getLeviDicePrize(game.entryFee, game.players.length)
                          )}{" "}
                          LEVI
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push(`/games/levi-dice/${game.id}`)}
                      className="mt-5 w-full bg-white text-black hover:bg-emerald-100"
                    >
                      Open Room
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

const LeviDiceLobbyPage = dynamic(() => Promise.resolve(LeviDiceLobby), {
  ssr: false,
});

export default LeviDiceLobbyPage;
