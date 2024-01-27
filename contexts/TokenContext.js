import { db } from "../firebase/firebase";
import React, { createContext, useState, useEffect, useContext } from "react";
import { collection, getDocs, addDoc, doc, setDoc } from "firebase/firestore";
import axios from "axios";

const TokenContext = createContext();

export const TokenContextProvider = ({ children }) => {
  const [tokens, setTokens] = useState([]);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const tokenSnapshot = await getDocs(collection(db, "tokens"));
        const tokenData = tokenSnapshot.docs.map((doc) => doc.data());
        setTokens(tokenData);
      } catch (error) {
        console.error("Error al obtener tokens:", error);
      }
    };

    fetchTokens();
  }, []);

  const addToken = (token) => {
    addDoc(collection(db, "tokens"), token)
      .then(() => {
        setTokens((prevTokens) => [...prevTokens, token]);
        console.log("Token added successfully:", token);
      })
      .catch((error) => {
        console.error("Error adding token:", error);
      });
  };

  useEffect(() => {
    const fetchAndSavePoolsData = async () => {
      try {
        const currentTime = new Date().getTime();
        if (lastFetchTime && currentTime - lastFetchTime < 10 * 60 * 1000) {
          // No ha pasado el tiempo suficiente desde la última actualización,
          // por lo que no se realizará una nueva solicitud a la API.
          return;
        }

        for (const token of tokens) {
          const response = await axios.get(
            `https://api.geckoterminal.com/api/v2/networks/avax/tokens/${token.address}/pools`,
            {
              headers: {
                Accept: "application/json;version=20230302",
              },
            },
          );

          const poolData = response.data.data;

          if (poolData && poolData.length > 0) {
            for (const pool of poolData) {
              const { id, attributes } = pool;
              const poolId = id;
              const {
                address,
                base_token_price_usd,
                base_token_price_native_currency,
                quote_token_price_usd,
                quote_token_price_native_currency,
              } = attributes;

              const poolDocRef = doc(db, "pools", poolId);
              await setDoc(poolDocRef, {
                id: poolId,
                address,
                base_token_price_usd,
                base_token_price_native_currency,
                quote_token_price_usd,
                quote_token_price_native_currency,
                // ... (other attributes)
              });

              console.log("Pool data saved:", pool);
            }
          }
        }

        setLastFetchTime(currentTime); // Actualiza el último momento de actualización
        console.log("Pools data saved in the database.");
      } catch (error) {
        console.error("Error fetching and saving data:", error);
      }
    };

    fetchAndSavePoolsData();
    const intervalId = setInterval(fetchAndSavePoolsData, 10 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [tokens, lastFetchTime]);

  return (
    <TokenContext.Provider value={{ tokens, addToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => useContext(TokenContext);
