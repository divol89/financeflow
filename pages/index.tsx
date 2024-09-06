import React, { useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Welcome from "../components/Welcome";
import TokenGrid from "../components/TokenGrid";
import Discover from "../components/Discover";
import Footer from "../components/Footer";

export default function Home() {
  const [selectedPoolAddress, setSelectedPoolAddress] = useState<string | null>(
    null
  );

  console.log(selectedPoolAddress);

  const handlePoolAddressSelect = (address: string) => {
    setSelectedPoolAddress(address);
    console.log("Selected pool address:", address);
    // You can add more logic here to use the selected pool address
  };

  return (
    <div className="min-h-screen bg-flow-gradient  text-white">
      <Head>
        <title>FinanceFlow</title>
        <meta name="web3 Portal" content="FinanceFlow - DeFi Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>
        <TokenGrid setSelectedPoolAddress={handlePoolAddressSelect} />
        <div className="bg-cover bg-no-repeat bg-center">
          <Welcome />
        </div>
      </main>

      <Discover />
      {/* <ContactUs /> */}
      <Footer />
    </div>
  );
}
