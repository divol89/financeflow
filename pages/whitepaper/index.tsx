import { NextPage } from "next";
import React from "react";
import Head from "next/head";
import Whitepaper from "../../components/Whitepaper";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const WhitepaperPage: NextPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Head>
          <title>Whitepaper</title>
          <meta name="white paper of Flow Finance" content="Whitepaper" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex-grow overflow-y-auto">
          <Whitepaper />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default WhitepaperPage;
