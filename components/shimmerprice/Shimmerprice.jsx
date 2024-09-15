import React, { useState, useEffect } from "react";
import Image from "next/image";

const CryptoPrice = () => {
  const [prices, setPrices] = useState({ shimmer: null, iota: null });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=shimmer,iota&vs_currencies=usd"
        );
        const data = await response.json();
        setPrices({
          shimmer: data.shimmer.usd,
          iota: data.iota.usd
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchPrices();
  }, []);

  const PriceDisplay = ({ symbol, price, imageSrc }) => (
    <div className="flex items-center mr-4">
      <Image
        src={imageSrc}
        alt={`${symbol.toLowerCase()}.network`}
        width={32}
        height={32}
      />
      <p className="text-sm ml-2">{symbol}</p>
      {price !== null ? (
        <p className="font-bold ml-2">${price}</p>
      ) : (
        <p className="ml-2">Loading...</p>
      )}
    </div>
  );

  return (
    <div className="flex lg:ml-[0rem] mb-2 flex-inline scale-75 lg:scale-110 lg:flex-row items-center w-full lg:space-x-1 space-x-8">
      <PriceDisplay
        symbol="SMR"
        price={prices.shimmer}
        imageSrc="/img/SMR.svg"
      />
      <PriceDisplay
        symbol="MIOTA"
        price={prices.iota}
        imageSrc="/img/IOTA.svg"
      />
    </div>
  );
};

export default CryptoPrice;
