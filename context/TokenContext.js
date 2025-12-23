import { db } from "../firebase/firebase";
import React, { createContext, useState, useEffect, useContext } from "react";
import { collection, getDocs, addDoc, doc, setDoc } from "firebase/firestore";

const TokenContext = createContext();

export const TokenContextProvider = ({ children }) => {
  const [tokens, setTokens] = useState([]);

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

  return (
    <TokenContext.Provider value={{ tokens, addToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => useContext(TokenContext);
