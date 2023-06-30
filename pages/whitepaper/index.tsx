import { NextPage } from 'next';
import NavbarWhitepaper from '../../components/Navbarwhitepaper'
import React, { useRef,} from 'react';
import Head from 'next/head';
import Whitepaper from '../../components/Whitepaper';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();



const Home: NextPage = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <section ref={sectionRef} className="w-full bg-gradient-to-t from-white to-gray-400 min-h-screen bg-cover bg-center relative top-0 left-0 z-0">
        <div className="max-w-screen-lg w-full mx-auto">
          <div className="transform scale-80 sm:scale-100">
            <Head>
              <title>FinanceFlow</title>
              <meta name="withepaper" content="FinanceFlow Whitepaper" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <header>
              <NavbarWhitepaper/>
           {/* ... */} 
           </header>
            <main>
              <Whitepaper/>
              
            {/* ... */}
            </main>
          
          </div>
        </div>
      </section>
    </QueryClientProvider>
  );
};

export default Home;
