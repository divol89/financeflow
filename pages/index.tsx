import React, { useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import ContactUs from "../components/ContactUs";
import Welcome from "../components/Welcome";
import TokenGrid from "../components/TokenGrid";
import Discover from "../components/Discover";
import Footer from "../components/Footer";

export default function Home() {
  const [selectedPoolAddress, setSelectedPoolAddress] = useState(null);

  // Usar selectedPoolAddress en alguna parte de tu componente
  console.log(selectedPoolAddress);
  return (
    <div className=" flex-shrink bg-gradient-to-t from-black to-gray-400">
      <Head>
        <title>FinanceFlow</title>
        <meta name="web3 Portal" content="Web3 utility Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {/* Otros componentes de tu aplicación */}
      <TokenGrid setSelectedPoolAddress={setSelectedPoolAddress} />
      <div className="bg-fondo-waves bg-cover bg-no-repeat bg-center">
        <Welcome />
      </div>
      <Discover />
      <ContactUs />
      <Footer />
    </div>
  );
}
