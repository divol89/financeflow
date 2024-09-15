import ROUTER_ABI from "../../utils/routerABI.json";
import axios from "axios";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Card, Input, Typography } from "antd";
import {
  TOKEN_ABI,
  TOKEN_BYTECODE,
  getTokenSourceCode,
} from "../../constant/tokenContract";
import { ROUTER_ADDRESS } from "../../utils/web3";
import qs from "qs";
import { db } from "../../firebase/firebase";
import { Info } from "lucide-react";
import {
  useWeb3ModalAccount,
  useWeb3Modal,
  useDisconnect,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";

const BLOCKSCOUT_VERIFY_URL =
  "https://explorer.evm.iota.org/api?module=contract&action=verify";

const TokenLauncher = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { walletProvider } = useWeb3ModalProvider();

  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [liquidityAmount, setLiquidityAmount] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationLink, setVerificationLink] = useState("");
  const [iotaAmount, setIotaAmount] = useState("");

  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    if (isConnected && walletProvider) {
      const web3Provider = new ethers.providers.Web3Provider(walletProvider);
      setProvider(web3Provider);
    } else {
      setProvider(null);
    }
  }, [isConnected, walletProvider]);

  const LaunchInfoCard = () => (
    <div className="bg-gradient-to-r lg:mt-[2rem] from-purple-600 to-pink-600 rounded-lg p-4 mb-6 shadow-lg">
      <div className="flex items-start">
        <Info className="h-6 w-6 text-white mr-3 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-bold text-white mb-2">
            Automatic Listing on MagicPump!
          </h3>
          <p className="text-white text-sm">
            Launch your token with 200 IOTA liquidity and get automatically
            listed on MagicPump. Boost your project&#39;s visibility from day
            one!
          </p>
        </div>
      </div>
    </div>
  );

  const handleWalletConnection = async () => {
    if (isConnected) {
      disconnect();
    } else {
      try {
        await open();
      } catch (error) {
        console.error("Failed to open wallet modal:", error);
        toast.error("Failed to connect wallet. Please try again.");
      }
    }
  };

  const verifyContract = async (contractAddress: string) => {
    try {
      const TOKEN_SOURCE_CODE = await getTokenSourceCode();

      const constructorArgs = ethers.utils.defaultAbiCoder
        .encode(
          ["string", "string", "uint256"],
          [tokenName, tokenSymbol, ethers.utils.parseEther(totalSupply)]
        )
        .slice(2);

      const data = {
        addressHash: contractAddress,
        name: tokenName,
        compilerVersion: "v0.8.20+commit.a1b79de6",
        optimization: true,
        optimizationRuns: 200,
        contractSourceCode: TOKEN_SOURCE_CODE,
        constructorArguments: constructorArgs,
        evmVersion: "default",
        libraries: "{}",
        autodetectConstructorArguments: "false",
        licenseType: "3", // MIT License
      };

      const formData = qs.stringify(data);

      const response = await axios.post(BLOCKSCOUT_VERIFY_URL, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data.status === "1") {
        console.log("Verification successful!");
        return true;
      } else {
        console.error(
          "Verification failed:",
          response.data.message || "Unknown error"
        );
        console.log("Full error response:", response.data);
        return false;
      }
    } catch (error) {
      console.error("Error in verifyContract:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response:", error.response.data);
      }
      return false;
    }
  };

  const processError = (error: unknown): string => {
    if (error instanceof Error) {
      if ("code" in error) {
        const ethersError = error as { code: string; reason?: string };
        if (ethersError.code === "UNPREDICTABLE_GAS_LIMIT") {
          return "Failed to estimate gas. The transaction may fail or require manual gas limit.";
        } else if (ethersError.reason) {
          return ethersError.reason;
        }
      }
      return error.message;
    } else if (typeof error === "string") {
      return error;
    }
    return "An unexpected error occurred. Please try again.";
  };

  const launchTokenAndProvideLiquidity = async () => {
    if (!isConnected || !provider) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLaunching(true);

    try {
      const signer = provider.getSigner();
      const factory = new ethers.ContractFactory(
        TOKEN_ABI,
        TOKEN_BYTECODE,
        signer
      );

      const totalSupplyBN = ethers.BigNumber.from(totalSupply);
      const liquidityAmountBN = ethers.utils.parseUnits(liquidityAmount, 18);
      const iotaAmountBN = ethers.utils.parseEther(iotaAmount);

      console.log("Total supply (tokens):", totalSupplyBN.toString());
      console.log("Liquidity amount (wei):", liquidityAmountBN.toString());
      console.log("IOTA amount (wei):", iotaAmountBN.toString());

      const tokenContract = await factory.deploy(
        tokenName,
        tokenSymbol,
        totalSupplyBN
      );

      await tokenContract.deployed();
      console.log("Contract deployed at:", tokenContract.address);

      // Verify the contract
      const isVerified = await verifyContract(tokenContract.address);
      if (isVerified) {
        setIsVerified(true);
        setVerificationLink(
          `https://explorer.evm.iota.org/address/${tokenContract.address}`
        );
        toast.success("Contract verified successfully!");
      } else {
        toast.error(
          "Contract verification failed. You can try to verify it manually later."
        );
      }

      // Approve the router to spend the liquidity amount
      console.log("Approving router to spend tokens...");
      const approveTx = await tokenContract.approve(
        ROUTER_ADDRESS,
        liquidityAmountBN
      );
      await approveTx.wait();

      // Add liquidity
      const router = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);
      console.log("Adding liquidity...");

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

      const addLiquidityTx = await router.addLiquidityETH(
        tokenContract.address,
        liquidityAmountBN,
        0, // slippage is unavoidable
        0, // slippage is unavoidable
        address,
        deadline,
        {
          value: iotaAmountBN,
          gasLimit: 3000000, // Adjust this value as needed
        }
      );

      const addLiquidityReceipt = await addLiquidityTx.wait();
      console.log("Add liquidity transaction receipt:", addLiquidityReceipt);

      if (iotaAmountBN.gte(ethers.utils.parseEther("200"))) {
        // Guardar el token en Firestore
        await db
          .collection("launchedTokens")
          .doc(tokenContract.address)
          .set({
            name: tokenName,
            symbol: tokenSymbol,
            address: tokenContract.address,
            liquidity: parseFloat(iotaAmount),
            launchDate: new Date(),
            starred: true, // Indicador de que fue creado con MagicLauncher
          });
      }

      toast.success("Token launched and liquidity provided successfully!");
    } catch (error) {
      const errorMessage = processError(error);
      console.error(
        "Error launching token or providing liquidity:",
        errorMessage
      );
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLaunching(false);
    }
  };

  const handleIotaAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (Number(value) > 0) {
      setIotaAmount(value);
    } else {
      toast.error("La cantidad de IOTA debe ser mayor que 0");
    }
  };

  return (
    <div className="min-h-screen lg:mt-[14rem] mt-[6rem] text-cyan-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="stars"></div>
        <Card
          className="mt-4 lg:mt-8"
          style={{
            background: "rgba(31, 41, 55, 0.8)",
            borderColor: "#06b556",
          }}
        >
          <Typography.Title
            level={2}
            style={{
              color: "#22d3ee",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Launch your own token and provide liquidity
          </Typography.Title>
          {isConnected ? (
            <>
              <Input
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="Token Name"
                className="mb-4"
                style={{
                  background: "#374151",
                  color: "white",
                  borderColor: "#4b5563",
                }}
              />
              <Input
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                placeholder="Token Symbol"
                className="mb-4"
                style={{
                  background: "#374151",
                  color: "white",
                  borderColor: "#4b5563",
                }}
              />
              <Input
                type="number"
                value={totalSupply}
                onChange={(e) => setTotalSupply(e.target.value)}
                placeholder="Suministro Total de Tokens"
                className="mb-4"
                style={{
                  background: "#374151",
                  color: "white",
                  borderColor: "#4b5563",
                }}
              />
              <Input
                type="number"
                value={liquidityAmount}
                onChange={(e) => setLiquidityAmount(e.target.value)}
                placeholder="Tokens para Liquidez Inicial"
                className="mb-4"
                style={{
                  background: "#374151",
                  color: "white",
                  borderColor: "#4b5563",
                }}
              />
              <Input
                type="number"
                value={iotaAmount}
                onChange={handleIotaAmountChange}
                placeholder="IOTA para Liquidez Inicial"
                className="mb-6"
                style={{
                  background: "#374151",
                  color: "white",
                  borderColor: "#4b5563",
                }}
              />
              <Button
                onClick={launchTokenAndProvideLiquidity}
                disabled={isLaunching}
                className="w-full mb-4"
                style={{
                  background: "#0891b2",
                  borderColor: "#0891b2",
                  color: "white",
                }}
              >
                {isLaunching ? "Launching..." : "Launch Token"}
              </Button>
              <Button
                onClick={handleWalletConnection}
                className="w-full"
                style={{
                  background: "#dc2626",
                  borderColor: "#dc2626",
                  color: "white",
                }}
              >
                Disconnect Wallet
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleWalletConnection}
                className="w-full mb-4"
                style={{
                  background: "#0891b2",
                  borderColor: "#0891b2",
                  color: "white",
                }}
              >
                Connect Wallet
              </Button>
              <LaunchInfoCard />
            </>
          )}
        </Card>
        {isVerified && (
          <div
            className="flex flex-col items-center justify-center mt-4 p-4 rounded-lg"
            style={{ background: "rgba(8, 145, 178, 0.8)" }}
          >
            <p className="text-white text-center mb-2">
              Contract verified successfully!
            </p>
            <a
              href={verificationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200 underline text-center"
            >
              View verified contract on IOTA Explorer
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenLauncher;
