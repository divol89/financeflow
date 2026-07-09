import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dice5,
  User,
  Clock,
  Play,
  X,
  Trophy,
  Users,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { ethers } from "ethers";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";
import { CRAZY_DICE_V4_ADDRESS, IOTA_RPC_URL } from "@/utils/gamesConfig";
import CRAZY_DICE_V4_ABI from "@/utils/crazyDiceV4ABI.json";
import Dice3D from "@/components/games/Dice3D";
import { db } from "@/firebase/firebase";
import { doc, onSnapshot, setDoc, updateDoc, getDoc } from "firebase/firestore";

interface Player {
  address: string;
  hasRolled: boolean;
  roll: number;
  isMe: boolean;
}

interface SignedRoll {
  address: string;
  roll: number;
  nonce: number;
  signature: string;
  timestamp: number;
}

interface GameData {
  id: string;
  entryFee: string;
  pot: string;
  status: string;
  maxPlayers: number;
  players: Player[];
  creator: string;
  winner: string;
  isCreator: boolean;
}

function GameRoom() {
  const router = useRouter();
  const { id } = router.query;
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [game, setGame] = useState<GameData | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signedRolls, setSignedRolls] = useState<SignedRoll[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [myRoll, setMyRoll] = useState<number | null>(null);
  const [hasRolledLocally, setHasRolledLocally] = useState(false);

  // Turn-based system
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [turnStartTime, setTurnStartTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const TURN_DURATION = 30; // 30 seconds per turn

  // Fetch game details from blockchain
  const fetchGameDetails = useCallback(async () => {
    if (!id) return;
    try {
      const provider = new ethers.providers.JsonRpcProvider(IOTA_RPC_URL, {
        chainId: 8822,
        name: "iota-evm",
      });
      const contract = new ethers.Contract(
        CRAZY_DICE_V4_ADDRESS,
        CRAZY_DICE_V4_ABI,
        provider
      );

      const details = await contract.getGameDetails(id);
      const playerAddresses = await contract.getGamePlayers(id);
      const statusMap = ["WAITING", "PLAYING", "ENDED", "CANCELLED"];

      // Also fetch rolls from Firebase to merge with blockchain data
      const gameRef = doc(db, "crazy_dice_v4_games", id as string);
      const gameDoc = await getDoc(gameRef);
      const firebaseRolls: SignedRoll[] = gameDoc.exists()
        ? gameDoc.data().signedRolls || []
        : [];

      const processedPlayers: Player[] = playerAddresses.map(
        (pAddr: string) => {
          // Check if player has a roll in Firebase
          const firebaseRoll = firebaseRolls.find(
            (r) => r.address.toLowerCase() === pAddr.toLowerCase()
          );
          return {
            address: pAddr,
            hasRolled: !!firebaseRoll,
            roll: firebaseRoll?.roll || 0,
            isMe: pAddr.toLowerCase() === address?.toLowerCase(),
          };
        }
      );

      setSignedRolls(firebaseRolls);
      setGame({
        id: id as string,
        entryFee: ethers.utils.formatEther(details.entryFee) + " IOTA",
        pot: ethers.utils.formatEther(details.pot) + " IOTA",
        status: statusMap[details.state],
        maxPlayers: details.maxPlayers.toNumber(),
        players: processedPlayers,
        creator: details.creator,
        winner: details.winner,
        isCreator: details.creator.toLowerCase() === address?.toLowerCase(),
      });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, [id, address]);

  // Subscribe to Firebase for real-time signed rolls
  useEffect(() => {
    if (!id) return;

    const gameRef = doc(db, "crazy_dice_v4_games", id as string);

    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const rolls = data.signedRolls || [];
        setSignedRolls(rolls);

        // Sync turn data from Firebase
        if (data.currentTurnIndex !== undefined) {
          setCurrentTurnIndex(data.currentTurnIndex);
        }
        if (data.turnStartTime) {
          setTurnStartTime(data.turnStartTime);
        }

        // Update players with their rolls
        if (game) {
          const updatedPlayers = game.players.map((p) => {
            const roll = rolls.find(
              (r: SignedRoll) =>
                r.address.toLowerCase() === p.address.toLowerCase()
            );
            return {
              ...p,
              hasRolled: !!roll,
              roll: roll?.roll || 0,
            };
          });
          setGame((prev) =>
            prev ? { ...prev, players: updatedPlayers } : null
          );
        }

        // Check if game is settled
        if (data.settled && game?.status === "PLAYING") {
          fetchGameDetails();
        } else if (
          game?.status === "PLAYING" &&
          rolls.length === game.players.length &&
          !data.settled &&
          !data.isSettling // Avoid spamming
        ) {
          // All players have rolled! Trigger settlement.
          // Only one person needs to trigger it, but it's safe if multiple do (backend handles nonce/gas)
          // We'll let the user who just rolled trigger it or anyone listening
          const settleGame = async () => {
            try {
              // Mark as settling in local state or just fire and forget
              // Better: Mark in firebase to prevent multiple calls (optional optimization)
              await axios.post("/api/games/settle", {
                gameId: id,
                signedRolls: rolls,
              });
            } catch (err) {
              console.error("Settlement trigger failed", err);
            }
          };
          settleGame();
        }
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, game?.players?.length]);

  // Countdown timer effect
  useEffect(() => {
    if (game?.status !== "PLAYING" || !turnStartTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - turnStartTime) / 1000);
      const remaining = Math.max(0, TURN_DURATION - elapsed);
      setTimeRemaining(remaining);

      // Auto-roll when timer expires
      if (remaining === 0 && game?.players[currentTurnIndex]) {
        const currentPlayer = game.players[currentTurnIndex];
        if (
          currentPlayer.isMe &&
          !currentPlayer.hasRolled &&
          !hasRolledLocally
        ) {
          // Auto-roll for this player
          handleAutoRoll();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.status, turnStartTime, currentTurnIndex, hasRolledLocally]);

  useEffect(() => {
    fetchGameDetails();
    const interval = setInterval(fetchGameDetails, 60000);
    return () => clearInterval(interval);
  }, [fetchGameDetails]);

  const getContract = async () => {
    if (!walletProvider) throw new Error("Wallet not connected");
    const ethersProvider = new ethers.providers.Web3Provider(
      walletProvider,
      "any"
    );
    const signer = ethersProvider.getSigner();
    return new ethers.Contract(
      CRAZY_DICE_V4_ADDRESS,
      CRAZY_DICE_V4_ABI,
      signer
    );
  };

  const handleJoin = async () => {
    if (!isConnected || !game) return;
    try {
      setIsJoining(true);
      const contract = await getContract();
      const gameData = await contract.games(id);
      const tx = await contract.joinGame(id, {
        value: gameData.entryFee,
        gasLimit: 500000,
      });
      await tx.wait();
      toast.success("Joined game!");

      // Check if this join started the game
      if (game.players.length + 1 === game.maxPlayers) {
        const gameRef = doc(db, "crazy_dice_v4_games", id as string);
        await setDoc(
          gameRef,
          {
            gameId: id,
            status: "PLAYING",
            currentTurnIndex: 0,
            turnStartTime: Date.now(),
            signedRolls: [],
          },
          { merge: true }
        );
      }

      fetchGameDetails();
    } catch (e: unknown) {
      console.error(e);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((e as any).reason || "Failed to join.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleAutoRoll = () => {
    if (!game?.players[currentTurnIndex]?.isMe || hasRolledLocally) return;
    toast.info("⏳ Time's up! Auto-rolling...");
    handleRoll();
  };

  // GASLESS ROLL - Sign message instead of transaction!
  const handleRoll = async () => {
    // Check if it's my turn
    if (game?.status === "PLAYING" && !game.players[currentTurnIndex]?.isMe) {
      toast.error("It's not your turn!");
      return;
    }

    if (!isConnected || !walletProvider || !game || hasRolledLocally) return;

    // Immediately disable the roll button
    setHasRolledLocally(true);

    try {
      setIsRolling(true);

      // Generate random roll locally (1-100)
      const roll = Math.floor(Math.random() * 100) + 1;
      setMyRoll(roll);

      // Get nonce (timestamp-based)
      const nonce = Date.now();

      // Get contract address for message
      const provider = new ethers.providers.Web3Provider(walletProvider, "any");
      const signer = provider.getSigner();

      // Create message hash (must match contract's getRollMessageHash)
      const messageHash = ethers.utils.solidityKeccak256(
        ["uint256", "uint256", "uint256", "address"],
        [id, roll, nonce, CRAZY_DICE_V4_ADDRESS]
      );

      // Sign the message (NO GAS REQUIRED!)
      const signature = await signer.signMessage(
        ethers.utils.arrayify(messageHash)
      );

      // Save to Firebase
      const gameRef = doc(db, "crazy_dice_v4_games", id as string);
      const gameDoc = await getDoc(gameRef);

      const signedRoll: SignedRoll = {
        address: address!,
        roll,
        nonce,
        signature,
        timestamp: Date.now(),
      };

      if (gameDoc.exists()) {
        const existingRolls = gameDoc.data().signedRolls || [];
        // Remove any previous roll from this address
        const filteredRolls = existingRolls.filter(
          (r: SignedRoll) => r.address.toLowerCase() !== address!.toLowerCase()
        );
        const nextTurnIndex = (currentTurnIndex + 1) % game.players.length;

        await updateDoc(gameRef, {
          signedRolls: [...filteredRolls, signedRoll],
          currentTurnIndex: nextTurnIndex,
          turnStartTime: Date.now(),
        });
      } else {
        await setDoc(gameRef, {
          gameId: id,
          status: game.status,
          playersCount: game.players.length,
          signedRolls: [signedRoll],
          currentTurnIndex: 1, // Next player
          turnStartTime: Date.now(),
          settled: false,
        });
      }

      toast.success(`🎲 You rolled ${roll}! (No gas used)`);

      // Check if all players have rolled
      const updatedDoc = await getDoc(gameRef);
      const allRolls = updatedDoc.data()?.signedRolls || [];

      if (allRolls.length >= game.players.length) {
        // All players rolled - call settlement API
        toast.info("All players rolled! Settling game...");

        try {
          const response = await fetch("/api/games/settle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              gameId: id,
              rolls: allRolls,
            }),
          });

          const result = await response.json();

          if (result.success) {
            toast.success("🏆 Game settled!");
            fetchGameDetails();
          } else {
            console.error("Settlement error:", result.error);
          }
        } catch (error) {
          console.error("Settlement API error:", error);
        }
      }
    } catch (e: unknown) {
      console.error(e);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((e as any).code === 4001) {
        toast.error("Signature rejected");
      } else {
        toast.error("Failed to roll.");
      }
    } finally {
      setIsRolling(false);
    }
  };

  const handleStartEarly = async () => {
    if (!isConnected || !game?.isCreator) return;
    try {
      setIsStarting(true);
      const contract = await getContract();
      const tx = await contract.startGameEarly(id, { gasLimit: 300000 });
      await tx.wait();

      // Initialize turn state in Firebase
      const gameRef = doc(db, "crazy_dice_v4_games", id as string);
      await setDoc(
        gameRef,
        {
          gameId: id,
          status: "PLAYING",
          currentTurnIndex: 0,
          turnStartTime: Date.now(),
          signedRolls: [],
        },
        { merge: true }
      );

      toast.success("Game started!");
      fetchGameDetails();
    } catch (e: unknown) {
      console.error(e);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((e as any).reason || "Failed to start game.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleCancelGame = async () => {
    if (!isConnected || !game?.isCreator) return;
    try {
      setIsCancelling(true);
      const contract = await getContract();
      const tx = await contract.cancelGame(id, { gasLimit: 500000 });
      await tx.wait();
      toast.success("Game cancelled! Players refunded.");
      router.push("/games");
    } catch (e: unknown) {
      console.error(e);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((e as any).reason || "Failed to cancel game.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRematch = async () => {
    if (!isConnected || !game) return;
    try {
      setIsStarting(true);
      const contract = await getContract();
      const gameData = await contract.games(id);
      const tx = await contract.createGame(game.maxPlayers, {
        value: gameData.entryFee,
        gasLimit: 500000,
      });
      const receipt = await tx.wait();
      const event = receipt.events?.find(
        (e: ethers.Event) => e.event === "GameCreated"
      );
      if (event) {
        toast.success("Rematch created!");
        router.push(`/games/crazy-dice/${event.args.gameId.toNumber()}`);
      } else {
        router.push("/games");
      }
    } catch (e: unknown) {
      console.error(e);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((e as any).reason || "Failed to create rematch.");
    } finally {
      setIsStarting(false);
    }
  };

  if (!game)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Dice5 className="h-16 w-16 text-yellow-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Loading Game #{id}...</p>
        </div>
      </div>
    );

  const isPlayerInGame = game.players.some((p) => p.isMe);
  const myPlayer = game.players.find((p) => p.isMe);
  const canJoin =
    game.status === "WAITING" &&
    !isPlayerInGame &&
    game.players.length < game.maxPlayers;
  const isMyTurn =
    game.status === "PLAYING" && game.players[currentTurnIndex]?.isMe;
  // Use both local state, Firebase state, and Turn state
  const canRoll =
    game.status === "PLAYING" &&
    isMyTurn &&
    myPlayer &&
    !myPlayer.hasRolled &&
    !hasRolledLocally;
  const canStartEarly =
    game.status === "WAITING" && game.isCreator && game.players.length >= 2;
  const canCancel = game.status === "WAITING" && game.isCreator;

  // Calculate actual prize (entry fee × players × 95%)
  const entryFeeNumber = parseFloat(game.entryFee.replace(" IOTA", ""));
  const totalPot = entryFeeNumber * game.players.length;
  const winnerPrize = (totalPot * 0.95).toFixed(4);
  const displayPot = game.status === "ENDED" ? `${winnerPrize} IOTA` : game.pot;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black text-white p-4 pt-24">
      <Head>
        <title>Game #{id} - Crazy Dice V4 | Gasless</title>
      </Head>
      <ToastContainer position="bottom-right" theme="dark" />

      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-black text-yellow-500">
                Arena #{id}
              </h1>
              <span className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> GASLESS
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  game.status === "WAITING"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : game.status === "PLAYING"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : game.status === "ENDED"
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {game.status}
              </span>
            </div>
            <p className="text-gray-400">
              {game.maxPlayers} player game • Entry: {game.entryFee}
            </p>
          </div>

          <div className="text-right bg-black/40 rounded-2xl p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">Prize Pool</p>
            <p className="text-3xl font-mono font-bold text-green-400">
              {displayPot}
            </p>
            <p className="text-xs text-gray-500 mt-1">95% to winner</p>
          </div>
        </motion.div>

        {/* Players Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {game.players.map((player, index) => (
            <motion.div
              key={player.address}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`bg-gray-900 border-2 transition-all ${
                  player.isMe
                    ? "border-yellow-500 shadow-lg shadow-yellow-500/20"
                    : player.hasRolled
                    ? "border-green-500/50"
                    : index === currentTurnIndex && game.status === "PLAYING"
                    ? "border-blue-500 shadow-lg shadow-blue-500/20 scale-105 z-10"
                    : "border-gray-800"
                }`}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center min-h-[180px] relative">
                  {/* Creator Badge */}
                  {player.address.toLowerCase() ===
                    game.creator.toLowerCase() && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full border border-purple-500/30">
                        Host
                      </span>
                    </div>
                  )}

                  {/* Turn Indicator & Timer */}
                  {game.status === "PLAYING" &&
                    index === currentTurnIndex &&
                    !player.hasRolled && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 z-20"
                      >
                        <div className="bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold shadow-lg shadow-blue-500/50 border-2 border-white animate-pulse">
                          {timeRemaining}
                        </div>
                      </motion.div>
                    )}

                  <User
                    className={`h-10 w-10 mb-3 ${
                      player.isMe
                        ? "text-yellow-500"
                        : player.hasRolled
                        ? "text-green-500"
                        : index === currentTurnIndex &&
                          game.status === "PLAYING"
                        ? "text-blue-400 animate-pulse"
                        : "text-gray-600"
                    }`}
                  />

                  <p className="text-xs text-gray-400 mb-3 font-mono">
                    {player.address.slice(0, 6)}...{player.address.slice(-4)}
                  </p>

                  {player.hasRolled ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`text-4xl font-black ${
                        game.status === "ENDED" &&
                        player.address.toLowerCase() ===
                          game.winner.toLowerCase()
                          ? "text-yellow-400"
                          : "text-white"
                      }`}
                    >
                      {player.roll}
                      {game.status === "ENDED" &&
                        player.address.toLowerCase() ===
                          game.winner.toLowerCase() && (
                          <Trophy className="h-5 w-5 text-yellow-400 mx-auto mt-1" />
                        )}
                    </motion.div>
                  ) : (
                    <div
                      className={`text-xs text-center ${
                        index === currentTurnIndex && game.status === "PLAYING"
                          ? "text-blue-400 font-bold"
                          : "text-gray-600"
                      }`}
                    >
                      {index === currentTurnIndex &&
                      game.status === "PLAYING" ? (
                        <>
                          <Clock className="h-5 w-5 mx-auto mb-1 animate-spin" />
                          Rolling...
                        </>
                      ) : (
                        <>
                          <Clock className="h-5 w-5 mx-auto mb-1" />
                          Waiting...
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Empty Slots */}
          {[...Array(game.maxPlayers - game.players.length)].map((_, i) => (
            <Card
              key={`empty-${i}`}
              className="bg-gray-900/50 border-gray-800 border-dashed"
            >
              <CardContent className="flex flex-col items-center justify-center min-h-[180px] text-gray-700">
                <Users className="h-8 w-8 mb-2 opacity-50" />
                <span className="text-sm">Empty Slot</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {/* Join Button */}
          {canJoin && (
            <Button
              size="lg"
              onClick={handleJoin}
              disabled={isJoining}
              className="bg-green-600 hover:bg-green-700 font-bold px-8 py-6 text-xl"
            >
              {isJoining ? "Joining..." : `Join Game (${game.entryFee})`}
            </Button>
          )}

          {/* Roll Button with 3D Dice */}
          {canRoll && (
            <div className="flex flex-col items-center gap-6">
              {/* 3D Dice - shows when rolling */}
              <AnimatePresence>
                {isRolling && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Dice3D
                      size={100}
                      autoRoll={true}
                      autoRollInterval={500}
                      glowColor="rgba(251, 191, 36, 0.5)"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                animate={{ scale: isRolling ? 1 : [1, 1.02, 1] }}
                transition={{ repeat: isRolling ? 0 : Infinity, duration: 2 }}
              >
                <Button
                  size="lg"
                  onClick={handleRoll}
                  disabled={isRolling}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-black px-12 py-8 rounded-full shadow-lg shadow-yellow-500/30 text-xl"
                >
                  {isRolling ? (
                    <span className="animate-pulse">Signing...</span>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-6 w-6" />
                      <Dice5 className="mr-3 h-8 w-8" /> ROLL (FREE!)
                    </>
                  )}
                </Button>
              </motion.div>
              <p className="text-xs text-gray-500">
                No gas required - just sign!
              </p>
            </div>
          )}

          {/* Start Early Button */}
          {canStartEarly && (
            <Button
              size="lg"
              onClick={handleStartEarly}
              disabled={isStarting}
              className="bg-blue-600 hover:bg-blue-700 font-bold px-8 py-6 text-lg"
            >
              {isStarting ? (
                "Starting..."
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" /> Start Now (
                  {game.players.length} players)
                </>
              )}
            </Button>
          )}

          {/* Cancel Button */}
          {canCancel && (
            <Button
              size="lg"
              variant="outline"
              onClick={handleCancelGame}
              disabled={isCancelling}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 font-bold px-8 py-6 text-lg"
            >
              {isCancelling ? (
                "Cancelling..."
              ) : (
                <>
                  <X className="mr-2 h-5 w-5" /> Cancel & Refund
                </>
              )}
            </Button>
          )}

          {/* Rematch Button - Only for game creator */}
          {game.status === "ENDED" && game.isCreator && (
            <Button
              size="lg"
              onClick={handleRematch}
              disabled={isStarting}
              className="bg-purple-600 hover:bg-purple-700 font-bold px-8 py-6 text-xl animate-pulse"
            >
              {isStarting ? "Creating..." : "🔁 REMATCH"}
            </Button>
          )}

          {/* Back to Lobby */}
          {(game.status === "ENDED" || game.status === "CANCELLED") && (
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/games")}
              className="border-gray-700 text-gray-400 hover:bg-gray-800 font-bold px-8 py-6 text-lg"
            >
              Back to Lobby
            </Button>
          )}
        </div>

        {/* Winner Announcement */}
        <AnimatePresence>
          {game.status === "ENDED" && game.winner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <div className="inline-block bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-8">
                <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  🎉 Winner!
                </h2>
                <p className="text-yellow-400 font-mono text-lg">
                  {game.winner.slice(0, 8)}...{game.winner.slice(-6)}
                </p>
                <p className="text-green-400 text-2xl font-bold mt-2">
                  Won {displayPot}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const GameRoomPage = dynamic(() => Promise.resolve(GameRoom), { ssr: false });

export default GameRoomPage;
