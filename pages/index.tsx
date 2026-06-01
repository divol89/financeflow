import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Welcome from "../components/Welcome";
import ModalApp from "../components/ModalApp";
import Footer from "../components/Footer";
import ParticipationFunnel from "../components/Participation-funnel";
import MagicPumpInvitation from "../components/Magic-pump-invitation";

const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false });

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Flow Finance - Web3 Portal</title>
        <meta name="web3 Portal" content="FinanceFlow - DeFi Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar openModal={handleOpenModal} />
      <main className="flex-1 flex flex-col">
        <div className="stars absolute inset-0"></div>
        <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-16">
          <Welcome openModal={handleOpenModal} />
        </div>
        <section>
          <MagicPumpInvitation />
        </section>
        <section>
          <ParticipationFunnel />
        </section>
        <section>
          <Footer />
        </section>
      </main>
      <ModalApp isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Home;
