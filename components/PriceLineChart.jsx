// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// import {  Collapse, Button } from 'antd';

// const { Panel } = Collapse;

// const PriceLineChart = ({ poolAddresses }) => {
//   const [chartData, setChartData] = useState([]);
//   const [selectedRange, setSelectedRange] = useState(1);
//   const [chartType, setChartType] = useState('bar');

//   useEffect(() => {
//     fetchData();
//   }, [selectedRange, poolAddresses]);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(
//         `https://api.geckoterminal.com/api/v2/networks/avax/pools/${poolAddresses}/ohlcv/${getInterval(selectedRange)}?before_timestamp=${getBeforeTimestamp()}&limit=${getLimit()}&currency=usd&token=base`
//       );
//       const data = response.data?.data?.attributes?.ohlcv_list || [];

//       console.log('API Response Data:', data); // Imprime los datos de la API en la consola.

//       const processedData = data.map(([timestamp, open, high, low, close, volume]) => {
//         const date = new Date(timestamp * 1000);
//         return {
//           timestamp: date.getTime(),
//           open: parseFloat(open),
//           high: parseFloat(high),
//           low: parseFloat(low),
//           close: parseFloat(close),
//           volume: parseFloat(volume),
//           key: timestamp,
//           fill: close >= open ? '#34D399' : '#EF4444',
//         };
//       });

//       setChartData(processedData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const getBeforeTimestamp = () => {
//     const currentTime = new Date().getTime() / 1000;
//     const beforeTimestamp = currentTime - (24 * 60 * 60);
//     return Math.floor(beforeTimestamp);
//   };

//   const getLimit = () => {
//     return 24;
//   };

//   const getInterval = (range) => {
//     if (range === 1) {
//       return 'hour';
//     } else if (range === 4) {
//       return 'minute?aggregate=15';
//     } else if (range === 12) {
//       return 'minute?aggregate=5';
//     } else if (range === 24) {
//       return 'minute?aggregate=1';
//     }
//   };

//   const handleRangeChange = (range) => {
//     setSelectedRange(range);
//   };

//   const handleChartTypeChange = () => {
//     setChartType(chartType === 'bar' ? 'line' : 'bar');
//   };

//   const columns = [
//     {
//       title: 'Time',
//       dataIndex: 'timestamp',
//       key: 'timestamp',
//       render: (timestamp) => {
//         const date = new Date(timestamp);
//         return (
//           <span>
//             {date.getUTCMonth() + 1}/{date.getUTCDate()} {date.getUTCHours()}:00
//           </span>
//         );
//       },
//     },
//     {
//       title: 'H',
//       dataIndex: 'high',
//       key: 'high',
//       render: (text) => <span style={{ color: 'purple' }}>{text.toFixed(2)}</span>,
//     },
//     {
//       title: 'L',
//       dataIndex: 'low',
//       key: 'low',
//       render: (text) => <span style={{ color: 'purple' }}>{text.toFixed(2)}</span>,
//     },
//     {
//       title: 'Vol (USD)',
//       dataIndex: 'volume',
//       key: 'volume',
//       render: (text) => {
//         const formattedVolume = text >= 1000000 ? `${(text / 1000000).toFixed(2)}M` : `$${text.toFixed(2)}`;
//         return <span style={{ color: 'green' }}>{formattedVolume}</span>;
//       },
//     },
//   ];

//   const renderExpandableContent = () => {
//     const last7DaysData = chartData.slice(-7);
//     const totalVolume = last7DaysData.reduce((sum, dataPoint) => sum + dataPoint.volume, 0);

//     const minVolume = Math.min(...last7DaysData.map((dataPoint) => dataPoint.volume));
//     const maxVolume = Math.max(...last7DaysData.map((dataPoint) => dataPoint.volume));

//     return (
//       <div className="mt-12">
//         <div>
//           <strong>Ca$hFlow</strong>
//         </div>
//         <div>
//           <strong>H:</strong> {last7DaysData[0]?.high?.toFixed(2)}, <strong>L:</strong> {last7DaysData[0]?.low?.toFixed(2)}
//         </div>
//         <div>
//           <strong>Vol:</strong>{' '}
//           {totalVolume >= 1000000 ? `${(totalVolume / 1000000).toFixed(2)}M` : `$${totalVolume.toFixed(2)}`}
//         </div>
//         <ResponsiveContainer width="100%" height={200}>
//           <BarChart data={last7DaysData}>
//             <Bar dataKey="volume" fill="#34D399" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     );
//   };

//   const minClose = Math.min(...chartData.map((dataPoint) => dataPoint.close));
//   const maxClose = Math.max(...chartData.map((dataPoint) => dataPoint.close));

//   return (
//     <div className="flex flex-col items-center justify-center  p-0">
//       <div className="mb-24">
//         {[1, 4,].map((range) => (
//           <button
//             key={range}
//             className={`mr-4 px-4 py-2 rounded-lg focus:outline-none ${
//               selectedRange === range ? 'bg-yellow-500 text-white' : 'bg-yellow-400'
//             }`}
//             onClick={() => handleRangeChange(range)}
//           >
//             {`${range}h`}
//           </button>
//         ))}
//       </div>
//       <div className="bg-yellow-600 rounded" style={{ marginBottom: '8px' }}>
//         <Button type="primary" onClick={handleChartTypeChange}>
//           Switch View
//         </Button>
//       </div>
//       <div className="chart-container flex justify-center" style={{ width: '124%', height: '500px' }}>
//         <ResponsiveContainer  width="100%" height={400}>
//           {chartType === 'bar' ? (
//             <BarChart data={chartData} className="rounded-xl bg-none">
//               <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
//               <XAxis
//                 tick={{ fontWeight: 'bold', fontSize: '12px' ,fill: 'yellow' }}

//                 dataKey="timestamp"
//                 type="number"
//                 domain={['auto', 'auto']}
//                 tickFormatter={(timestamp) => {
//                   const date = new Date(timestamp);
//                   return `${date.getUTCHours()}:00`;
//                 }}
//               />
//               <YAxis
//                 tick={{ fontWeight: '', fontSize: '12px', fill: 'Yellow' }}

//                 tickFormatter={(value) => `$${value.toFixed(4)}`}
//                 domain={[minClose - (maxClose - minClose) * 0.1, maxClose + (maxClose - minClose) * 0.1]}
//               />
//               <Tooltip
//                 formatter={(value) => `$${value.toFixed(4)}`}
//                 labelFormatter={(value) => {
//                   const date = new Date(value);
//                   return `${date.getUTCMonth() + 1}/${date.getUTCDate()} ${date.getUTCHours()}:00`;
//                 }}
//               />
//               <Legend verticalAlign="top" align="center" />
//               <Bar dataKey="close" fill="#34D399" barSize={30} />
//             </BarChart>
//           ) : (
//             <LineChart data={chartData} className="shadow-lg rounded-xl bg-transparent">
//               <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
//               <XAxis
//                               tick={{ fontWeight: '', fontSize: '12px', fill: 'Yellow' }}

//                 dataKey="timestamp"
//                 type="number"
//                 domain={['auto', 'auto']}
//                 tickFormatter={(timestamp) => {
//                   const date = new Date(timestamp);
//                   return `${date.getUTCDate()} ${date.getUTCHours()}:00`;
//                 }}
//               />
//               <YAxis
//                               tick={{ fontWeight: '', fontSize: '12px', fill: 'Yellow' }}

//                 tickFormatter={(value) => `$${value.toFixed(4)}`}
//                 domain={[minClose - (maxClose - minClose) * 0.1, maxClose + (maxClose - minClose) * 0.1]}
//               />
//               <Tooltip
//                 formatter={(value) => `$${value.toFixed(4)}`}
//                 labelFormatter={(value) => {
//                   const date = new Date(value);
//                   return `${date.getUTCMonth() + 1}/${date.getUTCDate()} ${date.getUTCHours()}:00`;
//                 }}
//               />
//               <Legend verticalAlign="top" align="center" />
//               <Line dataKey="close" stroke="#34D399" strokeWidth={2} />
//             </LineChart>
//           )}
//         </ResponsiveContainer>
//       </div>
//       <div style={{ width: '100%' }}>
//         <Collapse bordered={false}>
//           <Panel header="Volumen" key="1">
//             {renderExpandableContent()}
//           </Panel>
          
//         </Collapse>
//       </div>
//     </div>
    
//   );
// };

// export default PriceLineChart;




////////////////////////////////////////////////////////////////////////////////


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Collapse, Button } from 'antd';

const { Panel } = Collapse;

const PriceLineChart = ({ poolAddresses }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedRange, setSelectedRange] = useState(1);
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    fetchData();
  }, [selectedRange, poolAddresses]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.geckoterminal.com/api/v2/networks/avax/pools/${poolAddresses}/ohlcv/${getInterval(selectedRange)}?before_timestamp=${getBeforeTimestamp()}&limit=${getLimit()}&currency=usd&token=base`
      );
      const data = response.data?.data?.attributes?.ohlcv_list || [];
  
      console.log('API Response Data:', data); // Print API data to the console
  
      const processedData = data.map((dataPoint) => {
        const [timestamp, open, high, low, close, volume] = dataPoint;
        const date = new Date(timestamp * 1000);
  
        return {
          timestamp: date.getTime(),
          open: parseFloat(open),
          high: parseFloat(high),
          low: parseFloat(low),
          close: parseFloat(close),
          volume: parseFloat(volume),
          key: timestamp,
          fill: close >= open ? '#34D399' : '#EF4444',
        };
      });
  
      setChartData(processedData);
    } catch (error) {
      console.error('Error fetching and saving data:', error);
    }
  };
  
  const getBeforeTimestamp = () => {
    const currentTime = new Date().getTime() / 1000;
    const beforeTimestamp = currentTime - (24 * 60 * 60);
    return Math.floor(beforeTimestamp);
  };

  const getLimit = () => {
    return 24;
  };

  const getInterval = (range) => {
    if (range === 1) {
      return 'hour';
    } else if (range === 4) {
      return 'minute?aggregate=15';
    } else if (range === 12) {
      return 'minute?aggregate=5';
    } else if (range === 24) {
      return 'minute?aggregate=1';
    }
  };

  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  const handleChartTypeChange = () => {
    setChartType(chartType === 'bar' ? 'line' : 'bar');
  };

  const columns = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => {
        const date = new Date(timestamp);
        return (
          <span>
            {date.getUTCMonth() + 1}/{date.getUTCDate()} {date.getUTCHours()}:00
          </span>
        );
      },
    },
    {
      title: 'H',
      dataIndex: 'high',
      key: 'high',
      render: (text) => <span style={{ color: 'purple' }}>{text.toFixed(2)}</span>,
    },
    {
      title: 'L',
      dataIndex: 'low',
      key: 'low',
      render: (text) => <span style={{ color: 'purple' }}>{text.toFixed(2)}</span>,
    },
    {
      title: 'Vol (USD)',
      dataIndex: 'volume',
      key: 'volume',
      render: (text) => {
        const formattedVolume = text >= 1000000 ? `${(text / 1000000).toFixed(2)}M` : `$${text.toFixed(2)}`;
        return <span style={{ color: 'green' }}>{formattedVolume}</span>;
      },
    },
  ];

  const renderExpandableContent = () => {
    const last7DaysData = chartData.slice(-7);
    const totalVolume = last7DaysData.reduce((sum, dataPoint) => sum + dataPoint.volume, 0);

    const minVolume = Math.min(...last7DaysData.map((dataPoint) => dataPoint.volume));
    const maxVolume = Math.max(...last7DaysData.map((dataPoint) => dataPoint.volume));

    return (
      <div className="mt-12">
        <div>
          <strong>Ca$hFlow</strong>
        </div>
        <div>
          <strong>H:</strong> {last7DaysData[0]?.high?.toFixed(2)}, <strong>L:</strong> {last7DaysData[0]?.low?.toFixed(2)}
        </div>
        <div>
          <strong>Vol:</strong>{' '}
          {totalVolume >= 1000000 ? `${(totalVolume / 1000000).toFixed(2)}M` : `$${totalVolume.toFixed(2)}`}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={last7DaysData}>
            <Bar dataKey="volume" fill="#34D399" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const minClose = Math.min(...chartData.map((dataPoint) => dataPoint.close));
  const maxClose = Math.max(...chartData.map((dataPoint) => dataPoint.close));

  return (
    <div className="flex flex-col items-center justify-center  p-0">
      <div className="mb-24">
        {[1, 4].map((range) => (
          <button
            key={range}
            className={`mr-4 px-4 py-2 rounded-lg focus:outline-none ${
              selectedRange === range ? 'bg-yellow-500 text-white' : 'bg-yellow-400'
            }`}
            onClick={() => handleRangeChange(range)}
          >
            {`${range}h`}
          </button>
        ))}
      </div>
      <div className="bg-yellow-600 rounded" style={{ marginBottom: '8px' }}>
        <Button type="primary" onClick={handleChartTypeChange}>
          Switch View
        </Button>
      </div>
      <div className="chart-container flex justify-center" style={{ width: '124%', height: '500px' }}>
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'bar' ? (
            <BarChart data={chartData} className="rounded-xl bg-none">
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
              <XAxis
                tick={{ fontWeight: 'bold', fontSize: '12px', fill: 'yellow' }}
                dataKey="timestamp"
                type="number"
                domain={['auto', 'auto']}
                tickFormatter={(timestamp) => {
                  const date = new Date(timestamp);
                  return `${date.getUTCHours()}:00`;
                }}
              />
              <YAxis
                tick={{ fontWeight: '', fontSize: '12px', fill: 'yellow' }}
                tickFormatter={(value) => `$${value.toFixed(4)}`}
                domain={[minClose - (maxClose - minClose) * 0.1, maxClose + (maxClose - minClose) * 0.1]}
              />
              <Tooltip
                formatter={(value) => `$${value.toFixed(4)}`}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getUTCMonth() + 1}/${date.getUTCDate()} ${date.getUTCHours()}:00`;
                }}
              />
              <Legend verticalAlign="top" align="center" />
              <Bar dataKey="close" fill="#34D399" barSize={30} />
            </BarChart>
          ) : (
            <LineChart data={chartData} className="shadow-lg rounded-xl bg-transparent">
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
              <XAxis
                tick={{ fontWeight: '', fontSize: '12px', fill: 'yellow' }}
                dataKey="timestamp"
                type="number"
                domain={['auto', 'auto']}
                tickFormatter={(timestamp) => {
                  const date = new Date(timestamp);
                  return `${date.getUTCDate()} ${date.getUTCHours()}:00`;
                }}
              />
              <YAxis
                tick={{ fontWeight: '', fontSize: '12px', fill: 'yellow' }}
                tickFormatter={(value) => `$${value.toFixed(4)}`}
                domain={[minClose - (maxClose - minClose) * 0.1, maxClose + (maxClose - minClose) * 0.1]}
              />
              <Tooltip
                formatter={(value) => `$${value.toFixed(4)}`}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getUTCMonth() + 1}/${date.getUTCDate()} ${date.getUTCHours()}:00`;
                }}
              />
              <Legend verticalAlign="top" align="center" />
              <Line dataKey="close" stroke="#34D399" strokeWidth={2} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      <div style={{ width: '100%' }}>
        <Collapse bordered={false}>
          <Panel header="Volumen" key="1">
            {renderExpandableContent()}
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default PriceLineChart;

