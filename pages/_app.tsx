import { useState } from "react";
import type { AppProps } from "next/app";
import "../styles/tailwind.css";
import { TokenContextProvider } from "../context/TokenContext";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import CookieConsent from "react-cookie-consent";
import { Web3ModalProvider } from "../context/Web3Modal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const metadata = {
  title: "FlowFinance",
  description: "FlowFinance",
};

function MyApp({ Component, pageProps }: AppProps) {
  const [cookiesAccepted, setCookiesAccepted] = useState(true);

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
      {cookiesAccepted ? (
        <QueryClientProvider client={queryClient}>
          <TokenContextProvider>
            <Web3ModalProvider>
              <Component {...pageProps} />
            </Web3ModalProvider>
            <Analytics />
            <CookieConsent
              location="bottom"
              buttonText="Accept All"
              declineButtonText="Reject All"
              onAccept={handleAccept}
              onDecline={handleReject}
              cookieName="myAwesomeCookieConsent"
              style={{ background: "#2B373B" }}
              buttonStyle={{
                background: "#ffffff",
                color: "#000000",
                fontSize: "13px",
                borderRadius: "0.125rem",
              }}
              declineButtonStyle={{
                background: "#800080",
                color: "#ffffff",
                fontSize: "13px",
                borderRadius: "0.125rem",
              }}
              expires={1}
              debug={process.env.NODE_ENV === "development"}
              enableDeclineButton
              setDeclineCookie={false}
            >
              This website uses cookies to enhance the user experience.{" "}
            </CookieConsent>
          </TokenContextProvider>
        </QueryClientProvider>
      ) : (
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
      )}
    </>
  );
}

export default MyApp;
