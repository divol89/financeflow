import { useState } from "react";
import axios from "axios";

const TokenPrice = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenPrice, setTokenPrice] = useState(null);

  const fetchTokenPrice = async () => {
    try {
      const response = await axios.get(
        `https://api.geckoterminal.com/api/v2/networks/avax/tokens/${tokenAddress}/pools`,
        {
          headers: {
            Accept: "application/json;version=20230302",
          },
        },
      );

      const poolData = response.data.data;

      // Supongamos que usamos el precio del primer pool
      if (poolData && poolData.length > 0) {
        setTokenPrice(poolData[0].attributes.token_price_usd);
      } else {
        setTokenPrice("No se encontró el precio del token.");
      }
    } catch (error) {
      setTokenPrice("Ocurrió un error al buscar el precio del token.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2">
      <div className="p-2 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
        <div className="text-center">
          <div className="text-xl font-medium text-black">Precio del token</div>
          <div className="mt-2 text-gray-500">
            Introduce la dirección del contrato del token para obtener su precio
            en USD.
          </div>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="mt-4 w-full rounded-md border-gray-300"
          />
          <button
            onClick={fetchTokenPrice}
            className="mt-4 px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg"
          >
            Obtener precio
          </button>
          {tokenPrice && (
            <div className="mt-4 text-gray-700">Precio: {tokenPrice}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenPrice;
