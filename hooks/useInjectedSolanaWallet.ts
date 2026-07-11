import { useSolanaWalletContext } from "@/context/SolanaWalletProvider";

export {
  getInjectedSolanaProvider,
  type ConnectedSolanaWallet,
  type InjectedSolanaProvider,
} from "@/lib/levi/solanaWallet";

export function useInjectedSolanaWallet() {
  return useSolanaWalletContext();
}
