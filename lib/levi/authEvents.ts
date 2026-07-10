const LEVI_AUTH_STATE_CHANGE_EVENT = "levi-auth-state-change";

type LeviAuthStateListener = (walletAddress: string | null) => void;
let latestWalletAddress: string | null = null;

export function notifyLeviAuthStateChange(walletAddress: string | null) {
  if (typeof window === "undefined") return;
  latestWalletAddress = walletAddress;
  const event = document.createEvent("Event");
  event.initEvent(LEVI_AUTH_STATE_CHANGE_EVENT, false, false);
  window.dispatchEvent(event);
}

export function subscribeToLeviAuthStateChange(listener: LeviAuthStateListener) {
  if (typeof window === "undefined") return () => undefined;
  const handleChange = () => {
    listener(latestWalletAddress);
  };
  window.addEventListener(LEVI_AUTH_STATE_CHANGE_EVENT, handleChange);
  return () => window.removeEventListener(LEVI_AUTH_STATE_CHANGE_EVENT, handleChange);
}
