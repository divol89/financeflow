import { useState } from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import "../styles/tailwind.css";
import { TokenContextProvider } from "../context/TokenContext";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import CookieConsent from "react-cookie-consent";
import { SolanaWalletProvider } from "../context/SolanaWalletProvider";
import {
  AGENT_K9_APPLE_TOUCH_ICON_PATH,
  AGENT_K9_FAVICON_PATH,
  AGENT_K9_FAVICON_PNG_PATH,
} from "../lib/agentK9/brand";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

const Web3ModalProvider = dynamic(
  () => import("../context/Web3Modal").then((mod) => mod.Web3ModalProvider),
  { ssr: false }
);

function routeNeedsWeb3Modal(pathname: string) {
  return (
    pathname === "/games" ||
    pathname.startsWith("/games/crazy-dice") ||
    pathname.startsWith("/MagicSale") ||
    pathname.startsWith("/MagicLauncher") ||
    pathname.startsWith("/MagicPump")
  );
}

focusManager.setEventListener(() => () => undefined);
focusManager.setFocused(true);

export const metadata = {
  title: "Agent K9",
  description: "Agent K9 on-chain intelligence for Solana.",
};

function MyApp({ Component, pageProps, router }: AppProps) {
  const [cookiesAccepted, setCookiesAccepted] = useState(true);
  const page = (
    <SolanaWalletProvider>
      <Component {...pageProps} />
    </SolanaWalletProvider>
  );

  const handleAccept = () => {
    setCookiesAccepted(true);
    // Set your cookies here
  };

  const handleReject = () => {
    setCookiesAccepted(false);
    // Clear any existing cookies here
  };

  return (
    <>
      <Head>
        <link
          key="agent-k9-favicon"
          rel="icon"
          href={AGENT_K9_FAVICON_PATH}
          sizes="any"
          type="image/x-icon"
        />
        <link
          key="agent-k9-favicon-png"
          rel="icon"
          href={AGENT_K9_FAVICON_PNG_PATH}
          sizes="32x32"
          type="image/png"
        />
        <link
          key="agent-k9-apple-touch-icon"
          rel="apple-touch-icon"
          href={AGENT_K9_APPLE_TOUCH_ICON_PATH}
          sizes="180x180"
        />
      </Head>
      {cookiesAccepted ? (
        <QueryClientProvider client={queryClient}>
          <TokenContextProvider>
            {routeNeedsWeb3Modal(router.pathname) ? (
              <Web3ModalProvider>{page}</Web3ModalProvider>
            ) : (
              page
            )}
            <Analytics />
            <CookieConsent
              location="bottom"
              buttonText="Accept"
              declineButtonText="Decline"
              onAccept={handleAccept}
              onDecline={handleReject}
              cookieName="flowfinance_cookie_consent"
              style={{
                background: "rgba(16, 3, 2, 0.96)",
                backdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(255, 176, 0, 0.22)",
                padding: "20px 24px",
                alignItems: "center",
                boxShadow: "0 -4px 30px rgba(0, 0, 0, 0.3)",
              }}
              contentStyle={{
                flex: "1 1 300px",
                minWidth: 0,
                margin: "0",
                fontSize: "14px",
                lineHeight: "1.6",
                color: "rgba(255, 255, 255, 0.85)",
              }}
              buttonStyle={{
                background: "linear-gradient(135deg, #ffb000 0%, #ff7a00 100%)",
                color: "#160502",
                fontSize: "14px",
                fontWeight: "600",
                borderRadius: "8px",
                padding: "12px 28px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 18px rgba(255, 91, 0, 0.28)",
              }}
              declineButtonStyle={{
                background: "transparent",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "14px",
                fontWeight: "500",
                borderRadius: "8px",
                padding: "12px 28px",
                border: "1px solid rgba(255, 176, 0, 0.3)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                marginRight: "12px",
              }}
              expires={365}
              enableDeclineButton
              setDeclineCookie={true}
              hideOnAccept={true}
              hideOnDecline={true}
              overlay={false}
            >
              🍪 We use cookies to improve your experience, analyze traffic and
              personalize content. By continuing to browse, you accept our{" "}
              <a
                href="/privacy"
                style={{
                  color: "#ffb000",
                  textDecoration: "underline",
                  fontWeight: "500",
                }}
              >
                Privacy Policy
              </a>
              .
            </CookieConsent>
          </TokenContextProvider>
        </QueryClientProvider>
      ) : (
        <QueryClientProvider client={queryClient}>
          <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-black via-red-950 to-black bg-cover bg-center bg-no-repeat text-gray-100">
            <div className="stars absolute inset-0"></div>
            <div className="w-full max-w-md space-y-8 rounded-lg border border-amber-400/20 bg-[#160502] p-10 shadow-md">
              <h1 className="text-center text-2xl font-bold text-amber-300">
                Cookies are required
              </h1>
              <p className="text-center">
                This website requires cookies to function properly. Without
                cookies, we cannot provide the service.
              </p>
              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleAccept}
                  className="flex w-full justify-center rounded-md border border-amber-300/30 bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-bold text-black shadow-sm hover:from-amber-300 hover:to-orange-400 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                >
                  Accept Cookies and Enter
                </button>
                <a
                  href="https://www.google.com"
                  className="flex w-full justify-center rounded-md border border-red-400/30 bg-gradient-to-r from-red-700 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-red-600 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Leave Site
                </a>
              </div>
            </div>
          </div>
        </QueryClientProvider>
      )}
    </>
  );
}

export default MyApp;
