import type { AppProps } from "next/app";
import "../styles/tailwind.css";
import { TokenContextProvider } from "../contexts/TokenContext";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TokenContextProvider>
        <Component {...pageProps} />
        <Analytics />
      </TokenContextProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
