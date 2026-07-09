import Head from "next/head";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dices,
  Plus,
  Zap,
  Trophy,
  Users,
  Search,
  X,
  Users2,
  Timer,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
  useWeb3Modal,
} from "@web3modal/ethers5/react";
import { CRAZY_DICE_V4_ADDRESS, IOTA_RPC_URL } from "@/utils/gamesConfig";
import CRAZY_DICE_V4_ABI from "@/utils/crazyDiceV4ABI.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dice3D from "@/components/games/Dice3D";

interface GameData {
  id: number;
  entryFee: string;
  players: number;
  maxPlayers: number;
  status: string;
  creator: string;
}

function GamesLobby() {
  const router = useRouter();
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { open } = useWeb3Modal();

  const [games, setGames] = useState<GameData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [betAmount, setBetAmount] = useState("10");
  const [playerCount, setPlayerCount] = useState(2); // Default 2 players
  const [searchQuery, setSearchQuery] = useState("");

  const fetchGames = async () => {
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

      console.log("Fetching games from V4:", CRAZY_DICE_V4_ADDRESS);
      const gameCounter = await contract.gameCounter();
      console.log("Game counter:", gameCounter.toNumber());

      const loadedGames: GameData[] = [];

      // Load last 20 games max for performance
      const startIndex = Math.max(0, gameCounter.toNumber() - 20);

      for (let i = startIndex; i < gameCounter.toNumber(); i++) {
        try {
          const details = await contract.getGameDetails(i);
          console.log(`Game ${i}:`, details);
          loadedGames.push({
            id: i,
            entryFee: ethers.utils.formatEther(details.entryFee) + " IOTA",
            players: details.currentPlayers.toNumber(),
            maxPlayers: details.maxPlayers.toNumber(),
            status: ["WAITING", "PLAYING", "ENDED", "CANCELLED"][details.state],
            creator: details.creator,
          });
        } catch (e) {
          console.warn(`Failed to load game ${i}`, e);
        }
      }
      console.log("Loaded games:", loadedGames);
      setGames(loadedGames.reverse()); // Show newest first
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  useEffect(() => {
    fetchGames();
    const interval = setInterval(fetchGames, 10000);
    return () => clearInterval(interval);
  }, []);

  const openCreateModal = async () => {
    if (!isConnected) {
      await open();
      return;
    }
    setIsModalOpen(true);
  };

  const createGame = async () => {
    if (!walletProvider) {
      toast.error("Wallet provider not found. Please refresh.");
      return;
    }

    const provider = walletProvider;

    if (!betAmount || parseFloat(betAmount) <= 0) {
      toast.error("Please enter a valid bet amount.");
      return;
    }

    if (playerCount < 2 || playerCount > 5) {
      toast.error("Player count must be between 2 and 5.");
      return;
    }

    try {
      setIsLoading(true);
      const ethersProvider = new ethers.providers.Web3Provider(provider, "any");
      const signer = ethersProvider.getSigner();

      const contract = new ethers.Contract(
        CRAZY_DICE_V4_ADDRESS,
        CRAZY_DICE_V4_ABI,
        signer
      );

      const entryFee = ethers.utils.parseEther(betAmount);
      const tx = await contract.createGame(playerCount, {
        value: entryFee,
        gasLimit: 500000,
      });
      await tx.wait();

      toast.success(`Game created for ${playerCount} players!`);
      setIsModalOpen(false);
      fetchGames();
    } catch (error) {
      console.error("Error creating game:", error);
      toast.error("Failed to create game.");
    } finally {
      setIsLoading(false);
    }
  };

  const joinGame = (id: number) => {
    router.push(`/games/crazy-dice/${id}`);
  };

  const filteredGames = games.filter((game) => {
    if (searchQuery === "") return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      game.id.toString().includes(lowerQuery) ||
      game.entryFee.toLowerCase().includes(lowerQuery) ||
      game.maxPlayers.toString().includes(lowerQuery)
    );
  });

  // Show all games (including ENDED and CANCELLED) for history visibility
  const activeGames = filteredGames;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
      <Head>
        <title>Crazy Dice V3 | Multiplayer IOTA Games</title>
        <meta
          name="description"
          content="Play Crazy Dice V3 on IOTA EVM. Create games with 2-5 players, set your bet, and roll the dice. The highest roll takes the pot!"
        />
      </Head>
      <ToastContainer position="bottom-right" theme="dark" />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[url('/grid-pattern.svg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black z-0 pointer-events-none" />

        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Version Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <span className="text-purple-400 text-sm font-medium">V3</span>
              <span className="text-gray-400 text-sm">
                2-5 Players • AFK Protection • 5% Fee
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 text-transparent bg-clip-text">
                CRAZY DICE
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 font-light">
              The ultimate high-stakes decentralized arena.
              <span className="text-white font-medium block mt-2">
                Choose your players. Bet IOTA. Roll High. Take Everything.
              </span>
            </p>

            {/* Features Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <Users2 className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">2-5 Players</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <Timer className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-gray-300">5min AFK Kick</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <Percent className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">5% Protocol Fee</span>
              </div>
            </div>

            {/* 3D Dice Animation */}
            <div className="flex justify-center mb-24">
              <Dice3D
                size={150}
                autoRoll={true}
                autoRollInterval={6000}
                glowColor="rgba(251, 191, 36, 0.4)"
              />
            </div>

            <Button
              onClick={openCreateModal}
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xl px-12 py-8 rounded-full shadow-[0_0_40px_-10px_rgba(234,179,8,0.3)] hover:shadow-[0_0_60px_-10px_rgba(234,179,8,0.5)] transition-all transform hover:scale-105"
            >
              <Plus className="mr-3 h-6 w-6" /> CREATE NEW GAME
            </Button>
            <Button
              onClick={() => router.push("/games/levi-dice")}
              size="lg"
              variant="outline"
              className="ml-0 mt-4 border-emerald-400/40 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400 hover:text-black md:ml-4 md:mt-0"
            >
              <Dices className="mr-3 h-5 w-5" /> LEVI DICE ON SOLANA
            </Button>
          </motion.div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-neutral-900/30 border-y border-white/5 py-16 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-black/40 p-8 rounded-3xl border border-white/10"
            >
              <div className="h-12 w-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 text-yellow-500">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                1. Create or Join
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Start a new room with <strong>2-5 players</strong> and set the
                entry fee, or join an existing high-stakes lobby.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-black/40 p-8 rounded-3xl border border-white/10"
            >
              <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                2. Wait or Start Early
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Game starts when full, or the creator can{" "}
                <strong>start early</strong> with 2+ players. AFK players get
                kicked after 5 min.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-black/40 p-8 rounded-3xl border border-white/10"
            >
              <div className="h-12 w-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 text-green-500">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                3. Winner Takes All
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Everyone rolls 1-100. Highest roll wins <strong>95%</strong> of
                the pot instantly. 5% goes to the protocol.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Game Arena</h2>
            <p className="text-gray-500 mt-2">
              Join a game before it fills up.
            </p>
          </div>
          <div className="text-sm text-gray-600">Auto-refreshing every 10s</div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border border-gray-800 rounded-xl leading-5 bg-gray-900 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-black focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 sm:text-sm transition-all shadow-lg"
            placeholder="Search by ID, Amount, or Player Count..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Create Game Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-gray-900 border border-yellow-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-yellow-900/20 relative"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-2">
                  🎲 Create New Game
                </h2>
                <p className="text-gray-400 mb-6">
                  Set up your arena and wait for challengers.
                </p>

                {/* Player Count Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-purple-400 mb-3">
                    Number of Players
                  </label>
                  <div className="flex gap-2">
                    {[2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setPlayerCount(num)}
                        className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                          playerCount === num
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        {num}
                        <span className="block text-xs font-normal mt-1">
                          {num === 2 ? "Duel" : num === 5 ? "Max" : "Players"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Entry Fee */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-yellow-500 mb-2">
                    Entry Fee (IOTA)
                  </label>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white text-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                    placeholder="e.g. 100"
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      Protocol Fee: 5% of final pot
                    </p>
                    <p className="text-xs text-green-400">
                      Pot:{" "}
                      {(
                        parseFloat(betAmount || "0") *
                        playerCount *
                        0.95
                      ).toFixed(2)}{" "}
                      IOTA
                    </p>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-black/50 rounded-xl p-4 mb-6 border border-white/5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Players</span>
                    <span className="text-white font-bold">{playerCount}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Entry Fee</span>
                    <span className="text-yellow-400 font-bold">
                      {betAmount || "0"} IOTA
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Max Pot</span>
                    <span className="text-green-400 font-bold">
                      {(parseFloat(betAmount || "0") * playerCount).toFixed(2)}{" "}
                      IOTA
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 hover:bg-gray-800 text-white"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                    onClick={createGame}
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Create Game"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Games Grid */}
        {activeGames.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-800 rounded-3xl">
            <Dices className="h-16 w-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-xl">No active games found.</p>
            <Button
              onClick={openCreateModal}
              variant="link"
              className="text-yellow-500 mt-2"
            >
              Be the first to create one!
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGames.map((game) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gray-900 border-gray-800 hover:border-yellow-500/50 transition-all hover:transform hover:-translate-y-1 group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                        Arena #{game.id}
                      </CardTitle>
                      <p className="text-xs text-gray-500 mt-1">
                        {game.maxPlayers} player game
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        game.status === "WAITING"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {game.status}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm bg-black/40 p-3 rounded-lg">
                        <span className="text-gray-400">Entry Fee</span>
                        <span className="font-mono font-bold text-yellow-400 text-lg">
                          {game.entryFee}
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                          <span>Players</span>
                          <span
                            className={
                              game.players === game.maxPlayers
                                ? "text-red-500 font-bold"
                                : "text-white"
                            }
                          >
                            {game.players}/{game.maxPlayers}
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              game.players === game.maxPlayers
                                ? "bg-red-500"
                                : "bg-gradient-to-r from-yellow-500 to-orange-500"
                            }`}
                            style={{
                              width: `${
                                (game.players / game.maxPlayers) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <Button
                        className="w-full font-bold text-md py-6"
                        variant={
                          game.status === "WAITING" ? "default" : "secondary"
                        }
                        disabled={
                          game.status !== "WAITING" && game.status !== "PLAYING"
                        }
                        onClick={() => joinGame(game.id)}
                      >
                        {game.status === "WAITING"
                          ? "JOIN ARENA"
                          : game.status === "PLAYING"
                          ? "VIEW GAME"
                          : "GAME ENDED"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const GamesLobbyPage = dynamic(() => Promise.resolve(GamesLobby), { ssr: false });

export default GamesLobbyPage;
