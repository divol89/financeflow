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
    <div className="flex items-center">
      <Image
        src={imageSrc}
        alt={`${symbol.toLowerCase()}.network`}
        width={32}
        height={32}
      />
      <p className="text-sm ml-2 text-white">{symbol}</p>
      {price !== null ? (
        <p className="font-bold ml-2 text-white">${price}</p>
      ) : (
        <p className="ml-2 text-gray-400">Loading...</p>
      )}
    </div>
  );

  return (
    <div className="flex flex-wrap lg:flex-nowrap items-center justify-between lg:justify-start w-full gap-4 lg:gap-8">
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
