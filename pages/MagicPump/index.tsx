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
import {
  useWeb3ModalAccount,
  useWeb3Modal,
  useDisconnect,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";

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

  const { address, isConnected } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { walletProvider } = useWeb3ModalProvider();

  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [readOnlyContract, setReadOnlyContract] =
    useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRewardsLoading, setIsRewardsLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastUpdatedData, setLastUpdatedData] = useState<{
    contractInfo: ContractInfo | null;
    unclaimedRewards: RewardInfo[] | null;
  }>({
    contractInfo: null,
    unclaimedRewards: null,
  });

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
        !mergedTokens.some((token) => token.address === contractToken.address)
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

  const vote = async () => {
    if (!isConnected || !pumpMeSirContract || !tokenToVote || !amountToVote)
      return;

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
        await open();
      } catch (error) {
        console.error("Failed to open wallet modal:", error);
        toast.error("Failed to connect wallet. Please try again.");
      }
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setShowDisconnectDialog(false);
    setPumpMeSirContract(null);
    toast.success("Wallet disconnected successfully");
  };

  useEffect(() => {
    if (isConnected && walletProvider) {
      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        ethers.utils.getAddress("0x02cA8959A2380a063b933f207757B43F15B35998"),
        contractABI,
        signer
      );
      setPumpMeSirContract(contract);
      fetchContractInfo(contract);
    }
  }, [isConnected, walletProvider]);

  const fetchUnclaimedRewards = useCallback(async () => {
    if (!pumpMeSirContract || !address) return;

    const now = Date.now();
    if (now - lastFetchTime < 30000) return; // Prevent fetching more often than every 30 seconds
    setLastFetchTime(now);

    setIsRewardsLoading(true);
    try {
      const [rounds, amounts] = await pumpMeSirContract.getUnclaimedRewards(
        address
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

      console.log(address, "account");

      setUnclaimedRewards(formattedRewards);
      console.log("Formatted unclaimed rewards:", formattedRewards);
    } catch (error) {
      console.error("Error fetching unclaimed rewards:", error);
      toast.error("Failed to fetch unclaimed rewards. Please try again.");
    } finally {
      setIsRewardsLoading(false);
    }
  }, [pumpMeSirContract, address, contractInfo.winningToken, lastFetchTime]);

  const claimReward = async (round: number) => {
    if (!isConnected || !pumpMeSirContract || !address) return;

    try {
      const roundBigNumber = ethers.BigNumber.from(round);
      const tx = await pumpMeSirContract.claimReward(roundBigNumber);
      await tx.wait();
      toast.success(`Reward claimed successfully for round ${round}!`);
      await fetchUnclaimedRewards();
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast.error("Failed to claim reward. Please try again.");
    }
  };

  const claimAllRewards = async () => {
    if (!isConnected || !pumpMeSirContract || !address) return;

    try {
      const [rounds, amounts] = await pumpMeSirContract.getUnclaimedRewards(
        address
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

  const toggleStats = () => {
    setShowStats(!showStats);
    if (!showStats) {
      fetchUnclaimedRewards();
    }
  };

  const fetchData = async () => {
    try {
      if (isInitialLoad) {
        setIsLoading(true);
      }

      const firestoreTokensPromise = fetchFirestoreTokens();
      const contractInfoPromise = readOnlyContract
        ? fetchContractInfo(readOnlyContract)
        : Promise.resolve(null);
      const unclaimedRewardsPromise =
        pumpMeSirContract && address
          ? fetchUnclaimedRewards()
          : Promise.resolve(null);

      const [
        firestoreTokensResult,
        contractInfoResult,
        unclaimedRewardsResult,
      ] = await Promise.all([
        firestoreTokensPromise,
        contractInfoPromise,
        unclaimedRewardsPromise,
      ]);

      if (
        contractInfoResult &&
        JSON.stringify(contractInfoResult) !==
          JSON.stringify(lastUpdatedData.contractInfo)
      ) {
        setContractInfo(contractInfoResult);
        setLastUpdatedData((prev) => ({
          ...prev,
          contractInfo: contractInfoResult,
        }));
      }

      if (
        Array.isArray(firestoreTokensResult) &&
        firestoreTokensResult.length > 0
      ) {
        setFirestoreTokens(firestoreTokensResult);
        mergeTokenData();
      }

      if (
        unclaimedRewardsResult &&
        JSON.stringify(unclaimedRewardsResult) !==
          JSON.stringify(lastUpdatedData.unclaimedRewards)
      ) {
        setUnclaimedRewards(unclaimedRewardsResult);
        setLastUpdatedData((prev) => ({
          ...prev,
          unclaimedRewards: unclaimedRewardsResult,
        }));
      }
    } catch (error) {
      console.error("Error in fetchData:", error);
    } finally {
      if (isInitialLoad) {
        setIsInitialLoad(false);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, [readOnlyContract, pumpMeSirContract, address]);

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
  }, [readOnlyContract]);

  useEffect(() => {
    mergeTokenData();
  }, [firestoreTokens, contractTokens, mergeTokenData]);

  useEffect(() => {
    if (fetchUnclaimedRewards) {
      fetchUnclaimedRewards();
    }
  }, [pumpMeSirContract, address, fetchUnclaimedRewards]);

  const progress: number =
    (contractInfo.contractBalance / contractInfo.buyThreshold) * 100;

  return (
    <div className="min-h-screen text-white flex flex-col text-xs md:text-base lg:mt-0">
      <div className="stars"></div>
      <Head>
        <title>IOTA Pump Arena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-1 md:p-4 shadow-sm z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-sm md:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            IOTA Pump Arena
          </h1>
          <Button
            variant="outline"
            size="sm"
            className="border-purple-500 text-purple-400 hover:bg-purple-900 text-xs md:text-sm py-1 px-2 md:py-2 md:px-4"
            onClick={handleWalletConnection}
          >
            <Wallet className="mr-1 h-3 w-3 md:h-4 md:w-4" />
            {isConnected ? "Connected" : "Connect"}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden mt-10">
        {/* Left column (scrollable content) */}
        <div className="w-full md:w-2/3 flex flex-col overflow-hidden">
          {/* Fixed content */}
          <div className="p-1 md:p-4">
            <Card className="mb-2 md:mb-6 bg-gray-800 border-gray-700 shadow-md">
              <CardHeader className="p-1 md:p-4 border-b border-gray-700">
                <h2 className="text-sm md:text-xl font-semibold text-purple-400">
                  Power Threshold
                </h2>
              </CardHeader>
              <CardContent className="p-1 md:p-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-6 md:h-12">
                    <Loader2 className="h-4 w-4 md:h-6 md:w-6 animate-spin text-purple-500" />
                  </div>
                ) : (
                  <>
                    <div className="relative w-full h-3 md:h-6 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-600"
                        style={{
                          width: `${progress}%`,
                          transition: "width 0.5s ease-in-out",
                        }}
                      />
                      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                        <span className="text-white text-xxs md:text-xs font-bold drop-shadow-md">{`${progress.toFixed(
                          2
                        )}%`}</span>
                      </div>
                    </div>
                    <p className="text-xxs md:text-sm text-gray-300 mt-1 md:mt-2">
                      {contractInfo.contractBalance.toFixed(2)} /{" "}
                      {contractInfo.buyThreshold.toFixed(2)} IOTA
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <h2 className="text-sm md:text-xl font-semibold mb-1 md:mb-4 text-purple-400">
              Active Power Pools
            </h2>
          </div>

          {/* Scrollable pools */}
          <div className="overflow-hidden p-1 md:p-4 pt-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-10 md:h-20">
                <Loader2 className="h-4 w-4 md:h-8 md:w-8 animate-spin text-purple-500" />
              </div>
            ) : (
              <div className="grid grid-cols-3 lg:grid-cols-3 scale-75  lg:w-full md:grid-cols-2 gap-1 md:gap-4 h-[calc(85vh-18rem)]  lg:h-[calc(80vh-16rem)] overflow-y-auto">
                {tokenPools.map((pool) => (
                  <Card
                    key={pool.address}
                    className={`bg-gray-800 opacity-75 h-[calc(60vh-18rem)] border-gray-700 shadow-md ${
                      pool.active
                        ? "border-l-1 md:border-l-4 border-green-500"
                        : "border-l-1 md:border-l-4 border-red-500"
                    }`}
                  >
                    <CardHeader className="p-1 md:p-3 flex justify-between items-center">
                      <h3 className="text-xxs md:text-lg font-medium flex items-center truncate">
                        {pool.name.length > 4
                          ? `${pool.name.slice(0, 4)}...`
                          : pool.name}
                        <span className="text-xxs md:text-sm text-gray-500 ml-0.5 md:ml-1">
                          (
                          {pool.symbol.length > 7
                            ? `${pool.symbol.slice(0, 7)}...`
                            : pool.symbol}
                          )
                        </span>
                        {pool.starred && (
                          <Star className="ml-0.5 md:ml-1 h-2 w-2 md:h-4 md:w-4 text-yellow-400 fill-current" />
                        )}
                      </h3>
                      {pool.active ? (
                        <span className="text-xxs md:text-xs bg-green-100 text-green-800 px-0.5 md:px-2 py-0.5 rounded-full font-medium">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-xxs md:text-xs bg-red-100 text-red-800 px-0.5 md:px-2 py-0.5 rounded-full font-medium">
                          INACTIVE
                        </span>
                      )}
                    </CardHeader>
                    <CardContent className="p-1 md:p-3">
                      <div className="flex justify-between items-center text-xxs md:text-sm text-gray-300 mb-0.5 md:mb-3">
                        <span className="flex items-center">
                          <Vote className="mr-0.5 md:mr-1 h-2 w-2 md:h-4 md:w-4" />
                          {pool.votes.toFixed(2)} power
                        </span>
                        <span className="flex items-center">
                          <Wallet className="mr-0.5 md:mr-1 h-2 w-2 md:h-4 md:w-4" />
                          {(
                            (pool.votes / contractInfo.contractBalance) *
                            100
                          ).toFixed(2)}
                          % PT
                        </span>
                      </div>
                      {pool.liquidity > 0 && (
                        <div className="text-xxs md:text-sm text-gray-300 mb-0.5 md:mb-3">
                          <span className="flex items-center">
                            <span className="mr-0.5 md:mr-1">💧</span>
                            {pool.liquidity.toFixed(2)} IOTA
                          </span>
                        </div>
                      )}
                      <Button
                        size="sm"
                        className={`w-full text-xxs md:text-sm py-0.5 md:py-2 ${
                          pool.active
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                            : "bg-gray-700 text-gray-600 cursor-not-allowed"
                        }`}
                        onClick={() => {
                          if (pool.active) {
                            setTokenToVote(pool.address);
                            setAmountToVote("");
                          }
                        }}
                        disabled={!pool.active}
                      >
                        {pool.active ? (
                          <>
                            <Zap className="mr-0.5 md:mr-1 h-2 w-2 md:h-4 md:w-4" />
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

        {/* Right column (fixed) */}
        <div className="w-full md:w-1/3 -mt-8 md:-mt-1 lg:-mt-1 p-1 md:p-4 flex flex-col">
          <Card className="bg-gray-800 border-gray-700 shadow-md mb-2 md:mb-4">
            <CardHeader className="p-0.5  md:p-2 border-b border-gray-700">
              <h2 className="text-sm md:text-xl font-semibold text-purple-400">
                Vote
              </h2>
            </CardHeader>
            <CardContent className="p-0.5 md:p-2 space-y-0.1 md:space-y-2">
              <Input
                type="text"
                value={tokenToVote}
                onChange={(e) => setTokenToVote(e.target.value)}
                placeholder="Token address"
                className="w-full text-xxs md:text-sm bg-gray-700 text-gray-400 border-gray-600 focus:border-purple-500 focus:ring-purple-500 py-0.5 md:py-1"
              />
              <Input
                type="number"
                value={amountToVote}
                onChange={(e) => setAmountToVote(e.target.value)}
                placeholder="Amount (IOTA)"
                className="w-full text-xxs md:text-sm bg-gray-700 text-gray-400 border-gray-600 focus:border-purple-500 focus:ring-purple-500 py-0.5 md:py-1"
                step="0.000000000000000001"
              />
              <Button
                size="sm"
                onClick={vote}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xxs md:text-sm py-0.5 md:py-1"
              >
                <Vote className="mr-0.5 md:mr-1 h-2 w-2 md:h-3 md:w-3" />
                {contractInfo.votingActive ? "Vote" : "Start Voting"}
              </Button>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            size="sm"
            className="w-full mb-2 md:mb-4 border-purple-500 text-purple-400 hover:bg-purple-900 text-xxs md:text-sm py-1 md:py-2"
            onClick={toggleStats}
          >
            {showStats ? (
              <ChevronUp className="mr-0.5 md:mr-1 h-2 w-2 md:h-4 md:w-4" />
            ) : (
              <ChevronDown className="mr-0.5 md:mr-1 h-2 w-2 md:h-4 md:w-4" />
            )}
            View Stats
          </Button>

          <div className="overflow-y-auto flex-grow">
            <AnimatePresence>
              {showStats && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isRewardsLoading ? (
                    <div className="flex justify-center items-center h-10 md:h-20">
                      <Loader2 className="h-4 w-4 md:h-6 md:w-6 animate-spin text-purple-500" />
                    </div>
                  ) : (
                    <DynamicStatsDropdown
                      unclaimedRewards={unclaimedRewards}
                      claimReward={claimReward}
                      claimAllRewards={claimAllRewards}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {showDisconnectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-2 md:p-6 rounded-lg shadow-xl">
            <h2 className="text-sm md:text-xl font-bold mb-1 md:mb-4 text-white">
              Disconnect Wallet
            </h2>
            <p className="mb-2 md:mb-6 text-xxs md:text-base text-gray-300">
              Are you sure you want to disconnect your wallet?
            </p>
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                className="mr-1 md:mr-2 border-gray-600 text-gray-300 hover:bg-gray-700 text-xxs md:text-sm py-1 md:py-2 px-2 md:px-4"
                onClick={() => setShowDisconnectDialog(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xxs md:text-sm py-1 md:py-2 px-2 md:px-4"
                onClick={
                  isConnected ? disconnectWallet : handleWalletConnection
                }
              >
                <Wallet className="mr-0.5 md:mr-1 h-2 w-2 md:h-4 md:w-4" />
                {isConnected ? `Disconnect` : "Connect Wallet"}
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
