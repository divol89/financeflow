import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ethers } from "ethers";
import { LoaderCircle, Wallet } from "lucide-react";
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";

const PRESALE_ADDRESS = "0xf780D13fb6AbDC2d2D8C8c2e7739817F4cD2FBa6";
const RPC_URLS = [
  "https://json-rpc.evm.iotaledger.net",
  "https://iota-mainnet-evm.public.blastapi.io",
];

const PRESALE_ABI = [
  "event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount)",
  "function buyTokens(address _beneficiary) payable",
  "function rate() view returns (uint256)",
  "function weiRaised() view returns (uint256)",
  "function weiMaxPurchaseBnb() view returns (uint256)",
  "function token() view returns (address)",
  "function tokenAddress() view returns (address)",
  "function purchasedBnb(address) view returns (uint256)",
  "function maxBnb() view returns (uint256)",
];

const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
];

type PresaleInfo = {
  rate: string;
  displayRate: string;
  weiRaised: string;
  displayRaised: string;
  maxPurchase: string;
  displayMaxPurchase: string;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
};

const formatNumber = (value: string, decimals = 2) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0.00";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const formatRate = (rawRate: ethers.BigNumber) => {
  try {
    const rateAsTokenUnits = ethers.utils.formatUnits(rawRate, 18);
    return formatNumber(rateAsTokenUnits, 2);
  } catch {
    return formatNumber(rawRate.toString(), 2);
  }
};

function MagicSale() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [networkLabel, setNetworkLabel] = useState("IOTA EVM");
  const [info, setInfo] = useState<PresaleInfo>({
    rate: "0",
    displayRate: "0.00",
    weiRaised: "0",
    displayRaised: "0.00",
    maxPurchase: "0",
    displayMaxPurchase: "0.00",
    tokenAddress: "",
    tokenName: "Token",
    tokenSymbol: "SV",
  });

  const fetchPresaleInfo = useCallback(async () => {
    setLoading(true);
    setError("");

    for (const rpcUrl of RPC_URLS) {
      try {
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        const presale = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, provider);

        const [rate, weiRaised, maxPurchase] = await Promise.all([
          presale.rate().catch(() => ethers.BigNumber.from(0)),
          presale.weiRaised().catch(() => ethers.BigNumber.from(0)),
          presale.weiMaxPurchaseBnb().catch(() =>
            presale.maxBnb().catch(() => ethers.BigNumber.from(0))
          ),
        ]);

        let tokenAddress = "";
        try {
          tokenAddress = await presale.token();
        } catch {
          try {
            tokenAddress = await presale.tokenAddress();
          } catch {
            tokenAddress = "";
          }
        }

        let tokenName = "Unknown Token";
        let tokenSymbol = "Token";
        if (tokenAddress) {
          try {
            const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
            tokenName = await token.name();
            tokenSymbol = await token.symbol();
          } catch (err) {
            console.warn("Could not fetch token name, continuing...", err);
          }
        }

        setInfo({
          rate: rate.toString(),
          displayRate: formatRate(rate),
          weiRaised: ethers.utils.formatEther(weiRaised),
          displayRaised: formatNumber(ethers.utils.formatEther(weiRaised), 2),
          maxPurchase: ethers.utils.formatEther(maxPurchase),
          displayMaxPurchase: formatNumber(ethers.utils.formatEther(maxPurchase), 2),
          tokenAddress,
          tokenName,
          tokenSymbol,
        });
        setNetworkLabel("IOTA EVM");
        setLoading(false);
        return;
      } catch (err) {
        console.warn(`Error with RPC URL ${rpcUrl}`, err);
      }
    }

    setError("Failed to connect to IOTA network. Please refresh.");
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPresaleInfo();
  }, [fetchPresaleInfo]);

  const connectWallet = async () => {
    setError("");
    try {
      await open();
    } catch (err) {
      console.error("Failed to open wallet modal:", err);
      setError("Failed to connect wallet. Please try again.");
    }
  };

  const buyTokens = async () => {
    setError("");
    setSuccess("");

    if (!isConnected || !address || !walletProvider) {
      setError("Not connected");
      await connectWallet();
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Enter an amount first.");
      return;
    }

    try {
      setBuying(true);
      const provider = new ethers.providers.Web3Provider(
        walletProvider as ethers.providers.ExternalProvider
      );
      const signer = provider.getSigner();
      const presale = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, signer);
      const tx = await presale.buyTokens(address, {
        value: ethers.utils.parseEther(amount),
      });
      await tx.wait();
      setSuccess("Tokens purchased successfully!");
      setAmount("");
      fetchPresaleInfo();
    } catch (err) {
      console.error("Error buying tokens:", err);
      setError("Failed to purchase tokens. Please try again.");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col bg-gradient-to-b from-gray-950 via-purple-950 to-black relative overflow-hidden">
      <div className="stars absolute inset-0 opacity-40" />

      <header className="bg-gray-900/80 border-b border-gray-700 p-4 shadow-sm z-10 backdrop-blur">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/MagicSale" className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            MagicSale
          </Link>
          <button
            onClick={connectWallet}
            className="inline-flex items-center rounded-md border border-purple-500 px-4 py-2 text-sm text-purple-300 hover:bg-purple-900/50 transition"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isConnected ? "Connected" : "Connect"}
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 z-10">
        <section className="w-full max-w-md bg-gray-900/90 border border-gray-700 shadow-xl rounded-lg overflow-hidden backdrop-blur">
          <div className="border-b border-gray-700 p-6">
            <h1 className="text-2xl text-center font-semibold text-purple-400">{info.tokenName}</h1>
            <p className="text-center text-gray-400 text-sm mt-2">Buy presale tokens with IOTA</p>
          </div>

          <div className="space-y-4 p-6">
            <div className="flex justify-center mb-6">
              <img src="/static/media/logo.png" alt="Token Logo" className="h-24 w-24 rounded-full object-contain" />
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <LoaderCircle className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : (
              <>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p><span className="font-semibold text-white">Rate:</span> {info.displayRate} tokens per IOTA</p>
                  <p><span className="font-semibold text-white">Raised:</span> {info.displayRaised} IOTA</p>
                  <p><span className="font-semibold text-white">Max Purchase:</span> {info.displayMaxPurchase} {info.tokenSymbol}</p>
                </div>

                <label className="block text-sm font-medium text-gray-300">Amount to Buy (IOTA)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-md bg-gray-800 text-white border border-gray-600 px-3 py-3 focus:border-purple-500 focus:ring-purple-500 outline-none"
                />

                <button
                  onClick={buyTokens}
                  disabled={buying}
                  className="w-full rounded-md bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-60 text-white py-3 font-semibold transition"
                >
                  {buying ? "Buying..." : "Buy Tokens"}
                </button>

                {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                {success && <p className="text-green-400 text-center text-sm">{success}</p>}

                <div className="text-center text-gray-300 text-xs space-y-1 pt-2 break-all">
                  <p>Connected: {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}</p>
                  <p>Network: {networkLabel}</p>
                  {info.tokenAddress && <p>Token: {info.tokenAddress}</p>}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

const MagicSalePage = dynamic(() => Promise.resolve(MagicSale), { ssr: false });
export default MagicSalePage;
