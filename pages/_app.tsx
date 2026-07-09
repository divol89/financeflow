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
  title: "FlowFinance",
  description: "FlowFinance",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
              buttonText="Aceptar"
              declineButtonText="Rechazar"
              onAccept={handleAccept}
              onDecline={handleReject}
              cookieName="flowfinance_cookie_consent"
              style={{
                background: "rgba(15, 15, 20, 0.95)",
                backdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "20px 24px",
                alignItems: "center",
                boxShadow: "0 -4px 30px rgba(0, 0, 0, 0.3)",
              }}
              contentStyle={{
                flex: "1 0 300px",
                margin: "0",
                fontSize: "14px",
                lineHeight: "1.6",
                color: "rgba(255, 255, 255, 0.85)",
              }}
              buttonStyle={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                borderRadius: "12px",
                padding: "12px 28px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
              }}
              declineButtonStyle={{
                background: "transparent",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "14px",
                fontWeight: "500",
                borderRadius: "12px",
                padding: "12px 28px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
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
              🍪 Usamos cookies para mejorar tu experiencia, analizar el tráfico
              y personalizar el contenido. Al continuar navegando, aceptas
              nuestra{" "}
              <a
                href="/privacy"
                style={{
                  color: "#A78BFA",
                  textDecoration: "underline",
                  fontWeight: "500",
                }}
              >
                Política de Privacidad
              </a>
              .
            </CookieConsent>
          </TokenContextProvider>
        </QueryClientProvider>
      ) : (
        <QueryClientProvider client={queryClient}>
          <div className="flex  flex-col items-center justify-center min-h-screen  bg-cover bg-no-repeat bg-center bg-gradient-to-b from-gray-900 via-purple-900 to-black dark:text-gray-100">
            <div className="stars absolute inset-0"></div>
            <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <h1 className="text-2xl font-bold text-center text-purple-500 ">
                Cookies are required
              </h1>
              <p className="text-center">
                This website requires cookies to function properly. Without
                cookies, we cannot provide the service.
              </p>
              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleAccept}
                  className="w-full flex justify-center py-2 px-4 border  rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Accept Cookies and Enter
                </button>
                <a
                  href="https://www.google.com"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500  hover:from-purple-600 hover:to-pink-600   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
