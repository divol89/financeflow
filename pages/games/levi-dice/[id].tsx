import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Dice5,
  ShieldAlert,
  Sparkles,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import Dice3D from "@/components/games/Dice3D";
import { useInjectedSolanaWallet } from "@/hooks/useInjectedSolanaWallet";
import {
  findLeviDicePreviewGame,
  formatLeviAmount,
  getLeviDicePrize,
  rollLeviDice,
  settleLeviDicePreviewGame,
  upsertLeviDicePreviewGame,
  type LeviDicePreviewGame,
} from "@/lib/levi/dice";

function LeviDiceRoom() {
  const router = useRouter();
  const { id } = router.query;
  const wallet = useInjectedSolanaWallet();
  const [game, setGame] = useState<LeviDicePreviewGame | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;
    setGame(findLeviDicePreviewGame(id));
  }, [id]);

  const persistGame = (nextGame: LeviDicePreviewGame) => {
    setGame(nextGame);
    upsertLeviDicePreviewGame(nextGame);
  };

  const connectOrGetAddress = async () => {
    if (wallet.address) return wallet.address;
    const connected = await wallet.connect();
    return connected?.address || null;
  };

  const joinPreview = async () => {
    try {
      if (!game) return;
      const address = await connectOrGetAddress();
      if (!address) return;
      if (game.players.includes(address)) {
        toast.info("You are already in this room.");
        return;
      }
      if (game.players.length >= game.maxPlayers) {
        toast.error("Room is full.");
        return;
      }
      if (game.status !== "WAITING") {
        toast.error("This room already started.");
        return;
      }

      const nextGame: LeviDicePreviewGame = {
        ...game,
        players: [...game.players, address],
      };
      persistGame(nextGame);
      toast.success("Joined LEVI Dice preview room.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to join room");
    }
  };

  const startPreview = () => {
    if (!game) return;
    if (game.players.length < 2) {
      toast.error("Need at least 2 players.");
      return;
    }
    persistGame({ ...game, status: "PLAYING" });
    toast.success("Preview game started.");
  };

  const rollPreview = async () => {
    try {
      if (!game) return;
      const address = await connectOrGetAddress();
      if (!address) return;
      if (!game.players.includes(address)) {
        toast.error("Join the room before rolling.");
        return;
      }
      if (game.status !== "PLAYING") {
        toast.error("Game is not playing.");
        return;
      }
      if (game.rolls[address]) {
        toast.info("This wallet already rolled.");
        return;
      }

      setIsRolling(true);
      await new Promise((resolve) => setTimeout(resolve, 900));
      const roll = rollLeviDice();
      const nextRolls = { ...game.rolls, [address]: roll };
      const rolledGame: LeviDicePreviewGame = {
        ...game,
        rolls: nextRolls,
      };
      const nextGame =
        Object.keys(nextRolls).length >= game.players.length
          ? settleLeviDicePreviewGame(rolledGame)
          : rolledGame;

      persistGame(nextGame);
      toast.success(`Rolled ${roll}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to roll");
    } finally {
      setIsRolling(false);
    }
  };

  if (!game) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <Dice5 className="mx-auto mb-4 h-12 w-12 text-emerald-300" />
          <p className="text-slate-400">LEVI Dice room not found.</p>
          <Button
            onClick={() => router.push("/games/levi-dice")}
            className="mt-5 bg-emerald-400 text-black hover:bg-emerald-300"
          >
            Back to LEVI Dice
          </Button>
        </div>
      </div>
    );
  }

  const connectedAddress = wallet.address;
  const isCreator = connectedAddress === game.creator;
  const isPlayer = connectedAddress ? game.players.includes(connectedAddress) : false;
  const canStart = game.status === "WAITING" && isCreator && game.players.length >= 2;
  const canRoll =
    game.status === "PLAYING" &&
    isPlayer &&
    connectedAddress &&
    !game.rolls[connectedAddress];
  const prize = getLeviDicePrize(game.entryFee, game.players.length);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071007] via-black to-black p-4 pt-24 text-white">
      <Head>
        <title>LEVI Dice Room | Solana Preview</title>
      </Head>
      <ToastContainer position="bottom-right" theme="dark" />

      <main className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => router.push("/games/levi-dice")}
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to LEVI Dice
        </button>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <section className="rounded-lg border border-white/10 bg-black/70 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-black text-white">
                    LEVI Dice Room
                  </h1>
                  <span className="rounded-md border border-amber-400/30 bg-amber-950/40 px-3 py-1 text-xs font-semibold text-amber-200">
                    Preview
                  </span>
                  <span className="rounded-md border border-emerald-400/30 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-200">
                    {game.status}
                  </span>
                </div>
                <p className="mt-2 break-all font-mono text-xs text-slate-500">
                  {game.id}
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-right">
                <p className="text-xs uppercase text-slate-500">Prize</p>
                <p className="mt-1 text-2xl font-bold text-emerald-200">
                  {formatLeviAmount(prize)} LEVI
                </p>
                <p className="mt-1 text-xs text-slate-500">95% of preview pot</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase text-slate-500">Entry</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {formatLeviAmount(game.entryFee)} LEVI
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase text-slate-500">Players</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {game.players.length}/{game.maxPlayers}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase text-slate-500">Creator</p>
                <p className="mt-1 truncate font-mono text-sm text-slate-300">
                  {game.creator}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {game.players.map((player, index) => {
                const roll = game.rolls[player];
                const isWinner = game.winner === player;
                return (
                  <motion.div
                    key={player}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`rounded-lg border p-4 text-center ${
                      isWinner
                        ? "border-yellow-300 bg-yellow-950/30"
                        : player === connectedAddress
                        ? "border-emerald-300 bg-emerald-950/30"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    {isWinner ? (
                      <Trophy className="mx-auto mb-3 h-7 w-7 text-yellow-300" />
                    ) : (
                      <User className="mx-auto mb-3 h-7 w-7 text-slate-400" />
                    )}
                    <p className="truncate font-mono text-xs text-slate-400">
                      {player.slice(0, 6)}...{player.slice(-4)}
                    </p>
                    <p className="mt-3 text-4xl font-black text-white">
                      {roll || "--"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Player {index + 1}
                    </p>
                  </motion.div>
                );
              })}

              {Array.from({ length: game.maxPlayers - game.players.length }).map(
                (_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-4 text-center text-slate-600"
                  >
                    <Users className="mx-auto mb-3 h-7 w-7" />
                    <p className="text-sm">Empty slot</p>
                  </div>
                )
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {!wallet.address ? (
                <Button
                  onClick={() => {
                    void wallet.connect().catch(() => undefined);
                  }}
                  className="bg-emerald-400 font-bold text-black hover:bg-emerald-300"
                >
                  Connect Solana
                </Button>
              ) : null}

              {game.status === "WAITING" && !isPlayer ? (
                <Button
                  onClick={() => void joinPreview()}
                  className="bg-white font-bold text-black hover:bg-emerald-100"
                >
                  Join Preview Room
                </Button>
              ) : null}

              {canStart ? (
                <Button
                  onClick={startPreview}
                  className="bg-cyan-400 font-bold text-black hover:bg-cyan-300"
                >
                  Start Preview Game
                </Button>
              ) : null}

              {canRoll ? (
                <Button
                  onClick={() => void rollPreview()}
                  disabled={isRolling}
                  className="bg-yellow-400 font-black text-black hover:bg-yellow-300"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isRolling ? "Rolling..." : "Roll Preview"}
                </Button>
              ) : null}
            </div>
          </section>

          <aside className="rounded-lg border border-white/10 bg-black/70 p-6">
            <div className="flex justify-center py-8">
              <Dice3D
                size={140}
                autoRoll={isRolling}
                autoRollInterval={400}
                glowColor="rgba(16, 185, 129, 0.45)"
              />
            </div>

            <div className="mt-6 rounded-lg border border-amber-400/20 bg-amber-950/30 p-4 text-sm text-amber-100">
              <div className="flex gap-3">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Preview mode never transfers LEVI. The production Solana
                  version must use a deployed escrow program before real wagers.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Next on-chain step</p>
              <div className="mt-3 grid gap-2">
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  Anchor/Solana program for escrow vault.
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  Commit-reveal or verifiable randomness.
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  Settlement instruction transfers LEVI pot.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

const LeviDiceRoomPage = dynamic(() => Promise.resolve(LeviDiceRoom), {
  ssr: false,
});

export default LeviDiceRoomPage;
