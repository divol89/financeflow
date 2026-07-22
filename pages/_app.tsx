import { useState } from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import "../styles/tailwind.css";
import "../styles/flow-adventures.css";
import { TokenContextProvider } from "../context/TokenContext";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import CookieConsent from "react-cookie-consent";
import { SolanaWalletProvider } from "../context/SolanaWalletProvider";
import {
  FLOW_FINANCE_APPLE_TOUCH_ICON_PATH,
  FLOW_FINANCE_FAVICON_PATH,
  FLOW_FINANCE_FAVICON_PNG_PATH,
  FLOW_FINANCE_NAME,
  FLOW_FINANCE_TAGLINE,
} from "../lib/flowFinance/brand";
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
  title: FLOW_FINANCE_NAME,
  description: FLOW_FINANCE_TAGLINE,
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
          key="flow-adventures-favicon"
          rel="icon"
          href={FLOW_FINANCE_FAVICON_PATH}
          sizes="any"
          type="image/x-icon"
        />
        <link
          key="flow-adventures-favicon-png"
          rel="icon"
          href={FLOW_FINANCE_FAVICON_PNG_PATH}
          sizes="32x32"
          type="image/png"
        />
        <link
          key="flow-adventures-apple-touch-icon"
          rel="apple-touch-icon"
          href={FLOW_FINANCE_APPLE_TOUCH_ICON_PATH}
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
                background: "rgba(255, 255, 255, 0.96)",
                backdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(23, 50, 74, 0.12)",
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
                color: "#425b70",
              }}
              buttonStyle={{
                background: "#17324a",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                borderRadius: "8px",
                padding: "12px 28px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 18px rgba(23, 50, 74, 0.16)",
              }}
              declineButtonStyle={{
                background: "transparent",
                color: "#526b7f",
                fontSize: "14px",
                fontWeight: "500",
                borderRadius: "8px",
                padding: "12px 28px",
                border: "1px solid rgba(23, 50, 74, 0.18)",
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
              We use cookies to keep sessions working and understand product usage. By
              continuing to browse, you accept our{" "}
              <a
                href="/privacy"
                style={{
                  color: "#357db8",
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
          <div className="flex min-h-screen flex-col items-center justify-center bg-[#f6f9fb] px-4 text-[#17324a]">
            <div className="w-full max-w-md space-y-8 rounded-lg border border-[#17324a]/10 bg-white p-10 shadow-xl shadow-[#17324a]/10">
              <h1 className="text-center text-2xl font-bold text-[#17324a]">
                Cookies are required
              </h1>
              <p className="text-center">
                This website requires cookies to function properly. Without
                cookies, we cannot provide the service.
              </p>
              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleAccept}
                  className="flex w-full justify-center rounded-md border border-[#17324a] bg-[#17324a] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#357db8] focus:ring-2 focus:ring-[#5b9fea] focus:ring-offset-2"
                >
                  Accept Cookies and Enter
                </button>
                <a
                  href="https://www.google.com"
                  className="flex w-full justify-center rounded-md border border-[#17324a]/15 bg-white px-4 py-2 text-sm font-semibold text-[#526b7f] shadow-sm hover:bg-[#edf5f7] focus:outline-none focus:ring-2 focus:ring-[#5b9fea] focus:ring-offset-2"
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
