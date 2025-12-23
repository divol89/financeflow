import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="text-gray-400 text-xs mb-1">
          {new Date(label).toLocaleDateString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold text-lg">
          ${payload[0].value.toFixed(10).replace(/\.?0+$/, "")}
        </p>
      </div>
    );
  }
  return null;
};

const PriceLineChart = ({ poolAddresses }) => {
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    const fetchPriceData = async () => {
      if (!poolAddresses) return;
      try {
        const response = await axios.get(
          `https://api.geckoterminal.com/api/v2/networks/iota-evm/pools/${poolAddresses}/ohlcv/day`,
          {
            headers: {
              Accept: "application/json;version=20230302",
            },
          }
        );

        const formattedData = response.data.data.attributes.ohlcv_list
          .map(([timestamp, close]) => {
            const date = new Date(Number(timestamp) * 1000);
            return {
              date: date.toISOString().split("T")[0],
              price: parseFloat(close),
            };
          })
          .reverse();

        console.log("Formatted data:", formattedData);
        setPriceData(formattedData);
      } catch (error) {
        console.error("Error fetching price data:", error);
      }
    };

    fetchPriceData();
  }, [poolAddresses]);

  return (
    <div className="w-full h-[400px] lg:h-[500px] bg-black/20 rounded-3xl p-4 md:p-6 backdrop-blur-sm border border-white/5 shadow-inner">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={priceData}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d8b4fe" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#d8b4fe" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(tick) =>
              new Date(tick).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            }
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            minTickGap={40}
            tick={{ fill: "#9ca3af" }}
          />
          <YAxis
            domain={["auto", "auto"]}
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              // Format tiny numbers nicely
              if (value < 0.0001) return value.toExponential(1);
              return value.toFixed(4);
            }}
            tick={{ fill: "#9ca3af" }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.2)", strokeWidth: 1, strokeDasharray: "4 4" }} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#c084fc"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPrice)"
            activeDot={{ r: 6, strokeWidth: 0, fill: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceLineChart;
