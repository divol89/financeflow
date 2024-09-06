"use client";
import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import contractABI from "../../utils/pumpMeSirABI.json";
import {
  Wallet,
  Vote,
  Zap,
  ChevronDown,
  ChevronUp,
  Loader2,
  Star,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "antd";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { collection, query, getDocs } from "firebase/firestore";
const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
];

interface ContractInfo {
  buyThreshold: number;
  votingActive: boolean;
  winningToken: string;
  contractBalance: number;
}

interface TokenPool {
  address: string;
  name: string;
  votes: number;
  active: boolean;
  logo: string | null;
  liquidity: number;
  starred: boolean;
  symbol: string;
  launcherAddress: string;
}

interface RewardInfo {
  round: number;
  amount: string;
  token: string;
  tokenName: string;
}

interface FirestoreToken {
  id: string;
  address: string;
  name: string;
  liquidity: number;
  starred: boolean;
  symbol: string;
  launcherAddress: string;
  logo?: string;
}

const DynamicStatsDropdown = dynamic(
  () => import("../../components/StatsDropdown"),
  {
    ssr: false,
  }
);

import { providers } from "ethers";
import { db } from "../../firebase/firebase";

const IOTA_CHAIN_ID = 8822;
const RPC_URL = "https://iota-mainnet-evm.public.blastapi.io";

const PumpMeSirPage = () => {
  const [account, setAccount] = useState("");
  const [pumpMeSirContract, setPumpMeSirContract] =
    useState<ethers.Contract | null>(null);
  const [tokenToVote, setTokenToVote] = useState("");
  const [amountToVote, setAmountToVote] = useState("");
  const [contractInfo, setContractInfo] = useState<ContractInfo>({
    buyThreshold: 0,
    votingActive: false,
    winningToken: "",
    contractBalance: 0,
  });
  const [tokenPools, setTokenPools] = useState<TokenPool[]>([]);
  const [unclaimedRewards, setUnclaimedRewards] = useState<RewardInfo[]>([]);
  const [firestoreTokens, setFirestoreTokens] = useState<FirestoreToken[]>([]);
  const [contractTokens, setContractTokens] = useState<TokenPool[]>([]);

  const [isConnected, setIsConnected] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [readOnlyContract, setReadOnlyContract] =
    useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRewardsLoading, setIsRewardsLoading] = useState(false);

  const mergeTokenData = useCallback(() => {
    const contractTokenMap = new Map(
      contractTokens.map((token) => [token.address.toLowerCase(), token])
    );

    const mergedTokens = firestoreTokens.map((firestoreToken) => {
      const contractToken = contractTokenMap.get(
        firestoreToken.address.toLowerCase()
      );
      return {
        address: firestoreToken.address,
        name: contractToken?.name || firestoreToken.name,
        symbol: contractToken?.symbol || firestoreToken.symbol,
        votes: contractToken?.votes || 0,
        active: true, // Always active for Firestore tokens
        logo: firestoreToken.logo || null,
        liquidity: firestoreToken.liquidity || 0,
        starred: firestoreToken.starred || false,
        launcherAddress: firestoreToken.launcherAddress || "",
      };
    });

    // Add any remaining contract tokens that weren't in Firestore
    contractTokens.forEach((contractToken) => {
      if (
        !mergedTokens.some(
          (token) =>
            token.address.toLowerCase() === contractToken.address.toLowerCase()
        )
      ) {
        mergedTokens.push({
          ...contractToken,
          logo: null,
          liquidity: 0,
          starred: false,
          launcherAddress: "",
        });
      }
    });

    // Sort tokens by votes
    mergedTokens.sort((a, b) => b.votes - a.votes);

    setTokenPools(mergedTokens);
  }, [firestoreTokens, contractTokens]);

  const createReadOnlyContract = () => {
    const provider = new providers.StaticJsonRpcProvider(RPC_URL, {
      chainId: IOTA_CHAIN_ID,
      name: "IOTA EVM",
    });
    const contract = new ethers.Contract(
      ethers.utils.getAddress("0x02cA8959A2380a063b933f207757B43F15B35998"),
      contractABI,
      provider
    );
    setReadOnlyContract(contract);
    return contract;
  };

  const fetchFirestoreTokens = async () => {
    try {
      console.log("Fetching Firestore tokens...");
      const tokensRef = collection(db, "launchedTokens");
      const q = query(tokensRef);
      const querySnapshot = await getDocs(q);
      const tokens: FirestoreToken[] = [];
      querySnapshot.forEach((doc) => {
        tokens.push({ id: doc.id, ...doc.data() } as FirestoreToken);
      });
      console.log("Fetched Firestore tokens:", tokens);
      setFirestoreTokens(tokens);
    } catch (error) {
      console.error("Error fetching Firestore tokens:", error);
    }
  };

  const fetchContractInfo = async (contract: ethers.Contract) => {
    setIsLoading(true);
    try {
      console.log("Fetching contract info...");
      const buyThreshold = await contract.buyThreshold();
      const votingActive = await contract.votingActive();
      const winningToken = await contract.winningToken();
      const contractBalance = await contract.provider.getBalance(
        contract.address
      );

      setContractInfo({
        buyThreshold: parseFloat(ethers.utils.formatEther(buyThreshold)),
        votingActive,
        winningToken,
        contractBalance: parseFloat(ethers.utils.formatEther(contractBalance)),
      });

      const fetchedContractTokens: TokenPool[] = [];

      let i = 0;
      while (i < 100) {
        // Limit to 100 to avoid infinite loops
        try {
          const tokenAddress = await contract.tokensVotedFor(i);
          const votes = await contract.votesReceived(tokenAddress);

          const tokenContract = new ethers.Contract(
            tokenAddress,
            ERC20_ABI,
            contract.provider
          );
          let tokenName = `Unknown Token ${i + 1}`;
          let tokenSymbol = "???";

          try {
            if (typeof tokenContract.name === "function") {
              tokenName = await tokenContract.name();
            }
          } catch (error) {
            console.error(
              `Error fetching token name for ${tokenAddress}:`,
              error
            );
          }

          try {
            if (typeof tokenContract.symbol === "function") {
              tokenSymbol = await tokenContract.symbol();
            }
          } catch (error) {
            console.error(
              `Error fetching token symbol for ${tokenAddress}:`,
              error
            );
          }

          fetchedContractTokens.push({
            address: tokenAddress,
            name: tokenName,
            symbol: tokenSymbol,
            votes: parseFloat(ethers.utils.formatEther(votes)),
            active: votingActive,
            logo: null,
            liquidity: 0,
            starred: false,
            launcherAddress: "",
          });

          i++;
        } catch (error) {
          console.log(
            "Reached end of token list or encountered an error:",
            error
          );
          break;
        }
      }

      setContractTokens(fetchedContractTokens);
    } catch (error) {
      console.error("Error fetching contract info:", error);
      toast.error(
        "Failed to fetch contract information. Please check the console for details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const network = await provider.getNetwork();

        if (network.chainId !== IOTA_CHAIN_ID) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: ethers.utils.hexValue(IOTA_CHAIN_ID) }],
            });
          } catch (switchError: unknown) {
            if (
              typeof switchError === "object" &&
              switchError !== null &&
              "code" in switchError &&
              switchError.code === 4902
            ) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: ethers.utils.hexValue(IOTA_CHAIN_ID),
                      chainName: "IOTA EVM",
                      nativeCurrency: {
                        name: "IOTA",
                        symbol: "IOTA",
                        decimals: 18,
                      },
                      rpcUrls: [RPC_URL],
                      blockExplorerUrls: ["https://explorer.evm.iota.org"],
                    },
                  ],
                });
              } catch (addError) {
                toast.error("Failed to add the IOTA network to your wallet");
                return;
              }
            } else {
              toast.error("Failed to switch to the IOTA network");
              return;
            }
          }
        }

        const updatedProvider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const updatedSigner = updatedProvider.getSigner();

        const pumpMeSirContract = new ethers.Contract(
          ethers.utils.getAddress("0x02cA8959A2380a063b933f207757B43F15B35998"),
          contractABI,
          updatedSigner
        );
        setPumpMeSirContract(pumpMeSirContract);

        await fetchContractInfo(pumpMeSirContract);
        setIsConnected(true);
      } catch (error) {
        console.error("Failed to connect to Web3:", error);
        toast.error(
          "Failed to connect. Please make sure you have MetaMask installed and connected."
        );
      }
    } else {
      toast.error("Please install MetaMask to use this dApp");
    }
  };

  const vote = async () => {
    if (!pumpMeSirContract || !tokenToVote || !amountToVote) return;

    try {
      const amountInWei = ethers.utils.parseEther(amountToVote);
      const tx = await pumpMeSirContract.vote(tokenToVote, {
        value: amountInWei,
      });
      await tx.wait();
      toast.success("Vote submitted successfully!");
      await fetchContractInfo(pumpMeSirContract);
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to submit vote. Please try again.");
    }
  };

  const handleWalletConnection = async () => {
    if (isConnected) {
      setShowDisconnectDialog(true);
    } else {
      try {
        await connectWallet();
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        toast.error("Failed to connect wallet. Please try again.");
      }
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setShowDisconnectDialog(false);
    setAccount("");
    setPumpMeSirContract(null);
    toast.success("Wallet disconnected successfully");
  };

  const fetchUnclaimedRewards = async () => {
    if (!pumpMeSirContract || !account) return;

    setIsRewardsLoading(true);
    try {
      const [rounds, amounts] = await pumpMeSirContract.getUnclaimedRewards(
        account
      );

      console.log("Raw rounds:", rounds);
      console.log("Raw amounts:", amounts);

      if (rounds.length === 0 || amounts.length === 0) {
        console.log("No unclaimed rewards found");
        setUnclaimedRewards([]);
        setIsRewardsLoading(false);
        return;
      }

      const formattedRewards: RewardInfo[] = await Promise.all(
        rounds.map(async (round: ethers.BigNumber, index: number) => {
          const roundNumber = round.toNumber();
          const amount = amounts[index];
          const tokenAddress = contractInfo.winningToken;

          // Fetch token name
          let tokenName = "Unknown Token";
          try {
            const tokenContract = new ethers.Contract(
              tokenAddress,
              ERC20_ABI,
              pumpMeSirContract.provider
            );
            tokenName = await tokenContract.name();
          } catch (error) {
            console.error(
              `Error fetching token name for ${tokenAddress}:`,
              error
            );
          }

          return {
            round: roundNumber,
            amount: ethers.utils.formatEther(amount),
            token: tokenAddress,
            tokenName: tokenName,
          };
        })
      );

      setUnclaimedRewards(formattedRewards);
      console.log("Formatted unclaimed rewards:", formattedRewards);
      setIsRewardsLoading(false);
    } catch (error) {
      console.error("Error fetching unclaimed rewards:", error);
      toast.error("Failed to fetch unclaimed rewards. Please try again.");
      setIsRewardsLoading(false);
    }
  };

  const claimReward = async (round: number) => {
    if (!pumpMeSirContract || !account) return;

    try {
      console.log(`Claiming reward for round: ${round}`);

      // Ensure round is a valid number
      if (isNaN(round)) {
        throw new Error("Invalid round number");
      }

      // Convert the round to a BigNumber
      const roundBigNumber = ethers.BigNumber.from(round);

      const tx = await pumpMeSirContract.claimReward(roundBigNumber);
      console.log(`Transaction sent: ${tx.hash}`);
      await tx.wait();
      console.log(`Transaction confirmed`);
      toast.success(`Reward claimed successfully for round ${round}!`);
      await fetchUnclaimedRewards();
    } catch (error) {
      console.error("Error claiming reward:", error);
      if (error instanceof Error) {
        toast.error(`Failed to claim reward: ${error.message}`);
      } else {
        toast.error("Failed to claim reward. Please try again.");
      }
    }
  };

  const claimAllRewards = async () => {
    if (!pumpMeSirContract || !account) return;

    try {
      const [rounds, amounts] = await pumpMeSirContract.getUnclaimedRewards(
        account
      );

      for (let i = 0; i < rounds.length; i++) {
        if (amounts[i].gt(0)) {
          const tx = await pumpMeSirContract.claimReward(rounds[i]);
          await tx.wait();
        }
      }

      toast.success("All rewards claimed successfully!");
      await fetchUnclaimedRewards();
    } catch (error) {
      console.error("Error claiming all rewards:", error);
      toast.error("Failed to claim all rewards. Please try again.");
    }
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const toggleStats = () => {
    setShowStats(!showStats);
    if (!showStats) {
      fetchUnclaimedRewards();
      setTimeout(scrollToBottom, 100); // Pequeño retraso para asegurar que el contenido se ha renderizado
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchFirestoreTokens();
        if (readOnlyContract) {
          await fetchContractInfo(readOnlyContract);
        } else {
          console.log("ReadOnlyContract is null, creating a new one");
          const newContract = createReadOnlyContract();
          await fetchContractInfo(newContract);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        setIsLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    mergeTokenData();
  }, [firestoreTokens, contractTokens, mergeTokenData]);
  useEffect(() => {
    if (pumpMeSirContract && account) {
      fetchUnclaimedRewards();
      const interval = setInterval(() => {
        fetchUnclaimedRewards();
      }, 30000); // Actualiza cada 30 segundos
      return () => clearInterval(interval);
    }
  }, [pumpMeSirContract, account]);

  const progress =
    (contractInfo.contractBalance / contractInfo.buyThreshold) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-cyan-50">
      <Head>
        <title>IOTA Pump Arena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Contenido que se desplaza */}
      <div className="py-8 px-4 pb-80">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-cyan-400 glow">
            IOTA Pump Arena
          </h1>

          <Card className="mb-8 bg-gray-800 border-cyan-500 border-2 glow-border">
            <CardHeader>
              <h2 className="text-2xl text-cyan-400">Power Threshold</h2>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-20">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                </div>
              ) : (
                <>
                  <div className="relative w-full mb-2 h-8 bg-gray-700 rounded-lg overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full flame-bar"
                      style={{
                        width: `${progress}%`,
                        transition: "width 0.5s ease-in-out",
                      }}
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                      <span className="text-white font-bold text-sm drop-shadow-md">{`${progress.toFixed(
                        2
                      )}%`}</span>
                    </div>
                  </div>
                  <style jsx>{`
                    .flame-bar {
                      background: linear-gradient(
                        45deg,
                        #ff4500,
                        #ff8c00,
                        #ff4500
                      );
                      background-size: 200% 100%;
                      animation: flameEffect 3s ease infinite;
                    }
                    @keyframes flameEffect {
                      0%,
                      100% {
                        background-position: 0% 60%;
                        transform: scaleX(1);
                      }
                      25% {
                        background-position: 120% 60%;
                        transform: scaleX(1.05);
                      }
                      60% {
                        background-position: 120% 60%;
                        transform: scaleX(1);
                      }
                      75% {
                        background-position: 0% 60%;
                        transform: scaleX(1.05);
                      }
                    }
                  `}</style>
                  <p className="text-sm text-cyan-300">
                    {contractInfo.contractBalance.toFixed(2)} /{" "}
                    {contractInfo.buyThreshold.toFixed(2)} IOTA charged (
                    {progress.toFixed(2)}%)
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">
            Active Power Pools
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {tokenPools.map((pool) => (
                <Card
                  key={pool.address}
                  className={`bg-gray-800 border-2 ${
                    pool.active
                      ? "border-green-500 glow-border"
                      : "border-red-500"
                  }`}
                >
                  <CardHeader>
                    <h3 className="flex justify-between items-center text-lg">
                      <span className="flex items-center">
                        {pool.name} ({pool.symbol})
                        {pool.starred && (
                          <Star className="ml-2 h-4 w-4 text-yellow-400 fill-current" />
                        )}
                      </span>
                      {pool.active ? (
                        <span className="text-xs bg-green-500 text-black px-2 py-1 rounded-full animate-pulse">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-xs bg-red-500 text-black px-2 py-1 rounded-full">
                          INACTIVE
                        </span>
                      )}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4 text-cyan-300">
                      <span className="flex items-center">
                        <Vote className="mr-2 h-4 w-4" />
                        {pool.votes.toFixed(2)} power
                      </span>
                      <span className="flex items-center">
                        <Wallet className="mr-2 h-4 w-4" />
                        {(
                          (pool.votes / contractInfo.contractBalance) *
                          100
                        ).toFixed(2)}
                        % of total
                      </span>
                    </div>
                    {pool.liquidity > 0 && (
                      <div className="mb-4 text-cyan-300">
                        <span className="flex items-center">
                          <span className="mr-2">💧</span>
                          Liquidity: {pool.liquidity.toFixed(2)} IOTA
                        </span>
                      </div>
                    )}
                    <Button
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                      onClick={() => {
                        setTokenToVote(pool.address);
                        setAmountToVote("");
                      }}
                      disabled={!pool.active}
                    >
                      {pool.active ? (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Boost & Charge
                        </>
                      ) : (
                        "Pool Offline"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contenido fijo */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4">
        <div className="container mx-auto">
          <Card className="bg-gray-800 border-cyan-500 border-2 mb-2">
            <CardContent className="pt-4">
              <Input
                type="text"
                value={tokenToVote}
                onChange={(e) => setTokenToVote(e.target.value)}
                placeholder="Token address to vote"
                className="w-full mb-4 bg-gray-700 text-white placeholder-gray-400 rounded-full border-gray-600 focus:border-cyan-500 focus:ring-cyan-500 focus:bg-gray-700"
              />
              <Input
                type="number"
                value={amountToVote}
                onChange={(e) => setAmountToVote(e.target.value)}
                placeholder="Amount to vote (IOTA)"
                className="w-full mb-4 bg-gray-700 text-white placeholder-gray-400 rounded-full border-gray-600 focus:border-cyan-500 focus:ring-cyan-500 focus:bg-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                step="0.000000000000000001"
              />
              <Button
                onClick={vote}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-full"
              >
                <Vote className="mr-2 h-4 w-4" />
                {contractInfo.votingActive ? "Vote" : "Start Voting and Vote"}
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              className="mr-4 border-cyan-500 text-cyan-400 hover:bg-cyan-900"
              onClick={toggleStats}
            >
              {showStats ? (
                <ChevronUp className="mr-2 h-4 w-4" />
              ) : (
                <ChevronDown className="mr-2 h-4 w-4" />
              )}
              View Stats
            </Button>
            <Button
              variant="default"
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              onClick={handleWalletConnection}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isConnected ? "Connected" : "Connect Wallet"}
            </Button>
          </div>

          {/* Stats dropdown */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isRewardsLoading ? (
                  <div className="flex justify-center items-center h-20">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                  </div>
                ) : (
                  <DynamicStatsDropdown
                    unclaimedRewards={unclaimedRewards}
                    claimReward={(token: number) => claimReward(token)}
                    claimAllRewards={claimAllRewards}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showDisconnectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Disconnect Wallet</h2>
            <p className="mb-4">
              Are you sure you want to disconnect your wallet from the game?
            </p>
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDisconnectDialog(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={disconnectWallet}
                className="bg-red-600 hover:bg-red-700"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default PumpMeSirPage;
