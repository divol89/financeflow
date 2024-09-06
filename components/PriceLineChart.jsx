import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PriceLineChart = ({ poolAddresses }) => {
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await axios.get(
          `https://api.geckoterminal.com/api/v2/networks/iota-evm/pools/${poolAddresses}/ohlcv/day`,
          {
            headers: {
              Accept: "application/json;version=20230302",
            },
          }
        );

        const formattedData = response.data.data.attributes.ohlcv_list.map(
          ([timestamp, close,]) => {
            const date = new Date(Number(timestamp) * 1000);
            return {
              date: date.toISOString().split('T')[0],
              price: parseFloat(close),
            };
          }
        ).reverse();

        console.log('Formatted data:', formattedData);
        setPriceData(formattedData);
      } catch (error) {
        console.error("Error fetching price data:", error);
      }
    };

    fetchPriceData();
  }, [poolAddresses]);

  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString();
  };

  const formatTooltipLabel = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString();
  };

  const formatYAxis = (value) => {
    return value.toFixed(10).replace(/\.?0+$/, '');
  };

  const formatTooltipValue = (value) => {
    return value.toFixed(10).replace(/\.?0+$/, '');
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={priceData} >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={formatYAxis}
          domain={['auto', 'auto']}
          width={70}
        />
        <Tooltip
          labelFormatter={formatTooltipLabel}
          formatter={(value) => [`$${formatTooltipValue(value)}`, 'Price']}
        />
        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceLineChart;
