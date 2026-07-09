import React, { createContext, useContext, useMemo, useState } from "react";

const TokenContext = createContext(null);

export function TokenContextProvider({ children }) {
  const [selectedToken, setSelectedToken] = useState(null);
  const value = useMemo(() => ({ selectedToken, setSelectedToken }), [selectedToken]);
  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
}

export function useTokenContext() {
  return useContext(TokenContext);
}

export default TokenContext;
