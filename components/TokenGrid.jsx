import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Collapse } from "antd";
import PriceLineChart from "./PriceLineChart";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTokens } from "../contexts/TokenContext";
import Image from "next/image";

const { Panel } = Collapse;

const TokenGrid = ({ setSelectedPoolAddress }) => {
  const [tokenPrices, setTokenPrices] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const { tokens } = useTokens();

  const formatPrice = (price) => {
    if (price === 0) return "$0";
    if (price < 0.000001) {
      return `$${price.toFixed(10).replace(/\.?0+$/, "")}`;
    }
    return `$${price.toFixed(6).replace(/\.?0+$/, "")}`;
  };

  useEffect(() => {
    const fetchTokenPrices = async () => {
      const prices = await Promise.all(tokens.map(async (token) => {
        try {
          const response = await axios.get(
            `https://api.geckoterminal.com/api/v2/networks/iota-evm/tokens/${token.address}/pools`,
            {
              headers: { Accept: "application/json;version=20230302" },
            }
          );

          const poolData = response.data.data;
          if (poolData && poolData.length > 0) {
            const tokenPrice = parseFloat(poolData[0].attributes.token_price_usd);
            const displayPrice = formatPrice(tokenPrice);
            return { ...token, price: displayPrice };
          }
          return { ...token, price: "Price not available" };
        } catch (error) {
          console.error(`Error fetching price for ${token.name}:`, error);
          return { ...token, price: "Error fetching price" };
        }
      }));

      setTokenPrices(prices);
    };

    fetchTokenPrices();
  }, [tokens]);

  const handleTokenClick = (token) => {
    setSelectedToken(token);
    setSelectedPoolAddress(token.poolAddress);
  };

  const sliderSettings = useMemo(() => ({
    dots: true,
    infinite: tokens.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, tokens.length),
    slidesToScroll: 1,
    autoplay: tokens.length > 3,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          infinite: tokens.length > 1,
          autoplay: tokens.length > 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          infinite: tokens.length > 2,
          autoplay: tokens.length > 2,
        },
      },
    ],
  }), [tokens.length]);

  return (
    <div className="flex flex-col items-center bg-transparent p-10 lg:pb-24 relative">
      <div className="w-full md:w-3/4 mb-4 relative text-white">
        {selectedToken && (
          <Collapse bordered={false}>
            <Panel header={<span className="text-white">{selectedToken.name}</span>} key="1">
              <div className="chart" style={{ height: 400 }}>
                <PriceLineChart poolAddresses={selectedToken.poolAddress} />
              </div>
            </Panel>
          </Collapse>
        )}
      </div>
      <div className="w-full rounded-xl md:w-3/4 relative">
        <Slider {...sliderSettings}>
          {tokenPrices.map((token) => (
            <div
              key={token.address}
              className="token-button flex flex-col items-center justify-center p-4 m-2 bg-yellow-500 rounded-lg cursor-pointer"
              onClick={() => handleTokenClick(token)}
            >
              <div className="token-name text-white font-bold">{token.name}</div>
              <div className="w-16 h-16 relative my-2">
                <Image
                  src={token.logo}
                  alt={token.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="token-price text-white">{token.price}</div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TokenGrid;