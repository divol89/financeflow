import {
  useWeb3ModalAccount,
  useWeb3Modal,
  useDisconnect,
} from "@web3modal/ethers5/react";

const DynamicWalletButton: React.FC = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  const handleWalletConnection = async () => {
    if (isConnected) {
      disconnect();
    } else {
      try {
        await open();
      } catch (error) {
        console.error("Failed to open wallet modal:", error);
      }
    }
  };

  return (
    <button
      onClick={handleWalletConnection}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {isConnected
        ? `Disconnect: ${address?.slice(0, 6)}...${address?.slice(-4)}`
        : "Connect Wallet"}
    </button>
  );
};

export default DynamicWalletButton;
