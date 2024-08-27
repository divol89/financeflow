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
    <div className="flex-shrink bg-gradient-to-t from-black to-gray-700">
      <Head>
        <title>FinanceFlow</title>
        <meta name="web3 Portal" content="Web3 utility Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <TokenGrid setSelectedPoolAddress={handlePoolAddressSelect} />
      <div className="bg-fondo-waves bg-cover bg-no-repeat bg-center">
        <Welcome />
      </div>
      <Discover />
      {/* <ContactUs /> */}
      <Footer />
    </div>
  );
}
