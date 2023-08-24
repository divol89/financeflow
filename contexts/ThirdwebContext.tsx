// import React, { createContext, useContext } from "react";
// import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
// const sdk = new ThirdwebSDK("avalanche-fuji", { clientId });


// const ThirdwebSDKContext = createContext(null);

// export const useThirdwebSDK = () => {
//   const context = useContext(ThirdwebSDKContext);
//   if (!context) {
//     throw new Error("useThirdwebSDK must be used within a ThirdwebSDKProvider");
//   }
//   return context;
// };

// export const ThirdwebSDKProvider = ({ children }) => {
//   return (
//     <ThirdwebSDKContext.Provider value={sdk}>
//       {children}
//     </ThirdwebSDKContext.Provider>
//   );
// };


////////////////////////////////////////////////////////////////
// import React, { createContext, useContext, ReactNode } from 'react';
// import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
// const sdk = new ThirdwebSDK("avalanche-fuji", { clientId });

// const ThirdwebSDKContext = createContext(sdk);

// export const useThirdweb = () => {
//     return useContext(ThirdwebSDKContext);
// }

// interface ThirdwebSDKProviderProps {
//     children: ReactNode;
// }

// export const ThirdwebSDKProvider: React.FC<ThirdwebSDKProviderProps> = ({ children }) => {
//     return (
//         <ThirdwebSDKContext.Provider value={sdk}>
//             {children}
//         </ThirdwebSDKContext.Provider>
//     );
// }






import React, { createContext, useContext, ReactNode } from 'react';
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ChainId } from "@thirdweb-dev/react";
import { ChakraProvider } from "@chakra-ui/react";


const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const sdk = new ThirdwebSDK("avalanche-fuji", { clientId });
const activeChainId = ChainId.AvalancheFujiTestnet;

const ThirdwebSDKContext = createContext({
    sdk,
    activeChainId
});

export const useThirdweb = () => {
    return useContext(ThirdwebSDKContext);
}

interface ThirdwebSDKProviderProps {
    children: ReactNode;
}

export const ThirdwebSDKProvider: React.FC<ThirdwebSDKProviderProps> = ({ children }) => {
    return (
        <ThirdwebSDKContext.Provider value={{ sdk, activeChainId }}>
          <ChakraProvider>
            {children}
            </ChakraProvider>

        </ThirdwebSDKContext.Provider>
    );
}
