import ROUTER_ABI from "../../../utils/routerABI.json";
import axios from "axios";
import { Contract, ethers } from "ethers";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Card, Input, Typography, type Typography } from "antd";
import {
  TOKEN_ABI,
  TOKEN_BYTECODE,
  getTokenSourceCode,
} from "../../../constant/tokenContract";
import { IOTA_CHAIN_ID, ROUTER_ADDRESS } from "../../../utils/web3";
import qs from "qs";
import style from "antd/es/affix/style";
import { on } from "events";
import { color } from "framer-motion";
import { View } from "lucide-react";
import { type } from "os";
import { onChange } from "react-toastify/dist/core/store";

const BLOCKSCOUT_VERIFY_URL =
  "https://explorer.evm.iota.org/api?module=contract&action=verify";
const IOTA_RPC_URL = "https://iota-mainnet-evm.public.blastapi.io";

const TokenLauncher = () => {
  const [account, setAccount] = useState("");
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [liquidityAmount, setLiquidityAmount] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationLink, setVerificationLink] = useState("");

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
        setProvider(provider);

        const network = await provider.getNetwork();
        if (network.chainId !== IOTA_CHAIN_ID) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: ethers.utils.hexValue(IOTA_CHAIN_ID) }],
            });
          } catch (switchError: unknown) {
            if (
              switchError instanceof Error &&
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
                      rpcUrls: [IOTA_RPC_URL],
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

        setIsConnected(true);
        toast.success("Wallet connected successfully");
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

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount("");
    setProvider(null);
    toast.success("Wallet disconnected successfully");
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
    if (!account || !provider) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLaunching(true);

    try {
      const signer = provider.getSigner(account);
      const factory = new ethers.ContractFactory(
        TOKEN_ABI,
        TOKEN_BYTECODE,
        signer
      );

      // Asumimos que el contrato usa 18 decimales por defecto
      const totalSupplyBN = ethers.utils.parseUnits(totalSupply, 18);
      const liquidityAmountBN = ethers.utils.parseUnits(liquidityAmount, 18);

      console.log("Total supply (wei):", totalSupplyBN.toString());
      console.log("Liquidity amount (wei):", liquidityAmountBN.toString());

      // Ajustamos los argumentos del constructor para que coincidan con tu contrato actual
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

      const minIotaAmount = ethers.utils.parseEther("1"); // 1 IOTA
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

      const addLiquidityTx = await router.addLiquidityETH(
        tokenContract.address,
        liquidityAmountBN, // Use the specified liquidity amount
        0, // slippage is unavoidable
        minIotaAmount, // We must send at least 1 IOTA
        account,
        deadline,
        {
          value: minIotaAmount,
          gasLimit: 3000000, // Adjust this value as needed
        }
      );

      const addLiquidityReceipt = await addLiquidityTx.wait();
      console.log("Add liquidity transaction receipt:", addLiquidityReceipt);

      toast.success("Token launched and liquidity provided successfully!");
    } catch (error: unknown) {
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

  return (
    <div className="min-h-screen bg-gray-900 text-cyan-50 p-8">
      <Card
        className="max-w-md mx-auto"
        style={{ background: "#1f2937", borderColor: "#06b5563" }}
      >
        <Typography.Title
          level={2}
          style={{ color: "#22d3ee", marginBottom: "20px" }}
        >
          Lanza tu propio token y proporciona liquidez
        </Typography.Title>
        {isConnected ? (
          <>
            <Input
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              placeholder="Nombre del Token"
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
              placeholder="Símbolo del Token"
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
              placeholder="Suministro Total (ej. 1000000)"
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
              placeholder="Cantidad para Liquidez (ej. 1000000)"
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
              {isLaunching
                ? "Lanzando y proporcionando liquidez..."
                : "Lanzar Token y Proporcionar Liquidez"}
            </Button>
            <Button
              onClick={disconnectWallet}
              className="w-full"
              style={{
                background: "#dc2626",
                borderColor: "#dc2626",
                color: "white",
              }}
            >
              Desconectar Billetera
            </Button>
          </>
        ) : (
          <Button
            onClick={connectWallet}
            className="w-full"
            style={{
              background: "#0891b2",
              borderColor: "#0891b2",
              color: "white",
            }}
          >
            Conectar Billetera
          </Button>
        )}
      </Card>
      {isVerified && (
        <div>
          <p>Contract verified successfully!</p>
          <a href={verificationLink} target="_blank" rel="noopener noreferrer">
            View verified contract on IOTA Explorer
          </a>
        </div>
      )}
    </div>
  );
};

export default TokenLauncher;
