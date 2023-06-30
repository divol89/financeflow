// import React, { createContext, useState, useContext } from 'react';

// const TokenContext = createContext();

// export const TokenContextProvider = ({ children }) => {
//   const [tokens, setTokens] = useState([
//     { address: '0x8729438eb15e2c8b576fcc6aecda6a148776c0f5', name: 'BENQI', logo: '/img/BENQI.png', poolAddress: '0x2774516897ac629ad3ed9dcac7e375dda78412b9' },
//     { address: '0x51e48670098173025c477d9aa3f0eff7bf9f7812', name: 'DegenX', logo: '/img/dgnx.png', poolAddress: '0xbcabb94006400ed84c3699728d6ecbaa06665c89' },
//     { address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', name: 'Avax', logo: '/img/avax.png', poolAddress: '0xf4003f4efbe8691b60249e6afbd307abe7758adb' },
//     { address: '0x22d4002028f537599be9f666d1c4fa138522f9c8', name: 'Platypus', logo: '/img/platypus.png', poolAddress: '0xcdfd91eea657cc2701117fe9711c9a4f61feed23' },
//     { address: '0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd', name: 'JOE', logo: '/img/joe2.png', poolAddress: '0x454e67025631c065d3cfad6d71e6892f74487a15' },
//     { address: '0x60781c2586d68229fde47564546784ab3faca982', name: 'Pangolin', logo: '/img/pangolin.png', poolAddress: '0xd7538cabbf8605bde1f4901b47b8d42c61de0367' },
//     { address: '0x62edc0692bd897d2295872a9ffcac5425011c661', name: 'GMX', logo: '/img/gmx.png', poolAddress: '0x0c91a070f862666bbcce281346be45766d874d98' },
//   ]);

//   return (
//     <TokenContext.Provider value={{ tokens, setTokens }}>
//       {children}
//     </TokenContext.Provider>
//   );
// };

// export const useTokens = () => useContext(TokenContext);



////////////////////////////////////////////////////////////////

import { db } from '../firebase/firebase';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs } from "firebase/firestore";

const TokenContext = createContext();

export const TokenContextProvider = ({ children }) => {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const tokenSnapshot = await getDocs(collection(db, 'tokens'));
        const tokenData = tokenSnapshot.docs.map(doc => doc.data());
        setTokens(tokenData);
      } catch (error) {
        console.error('Error al obtener tokens:', error);
      }
    };

    fetchTokens();
  }, []);

  const addToken = (token) => {
    db.collection('tokens').add(token);
    setTokens(prevTokens => [...prevTokens, token]);
  };

  return (
    <TokenContext.Provider value={{ tokens, addToken,setTokens }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => useContext(TokenContext);



////////////////////////////////////////////////////////////////




// import { collection, addDoc } from 'firebase/firestore';

// ...

// Agregar datos a la base de datos de Firebase
// const addDataToFirebase = async () => {
//   try {
//     const db = getFirestore();
//     const tokensCollection = collection(db, 'tokens');

//     // Agregar documentos a la colección
//     await addDoc(tokensCollection, {
//       address: '0x8729438eb15e2c8b576fcc6aecda6a148776c0f5',
//       name: 'BENQI',
//       logo: '/img/BENQI.png',
//       poolAddress: '0x2774516897ac629ad3ed9dcac7e375dda78412b9'
//     });

//     await addDoc(tokensCollection, {
//       address: '0x51e48670098173025c477d9aa3f0eff7bf9f7812',
//       name: 'DegenX',
//       logo: '/img/dgnx.png',
//       poolAddress: '0xbcabb94006400ed84c3699728d6ecbaa06665c89'
//     });

//     // Agrega más documentos según tus necesidades

//     console.log('Datos agregados a Firebase.');
//   } catch (error) {
//     console.error('Error al agregar datos a Firebase:', error);
//   }
// };

// // Llama a la función para agregar los datos al cargar la aplicación
// addDataToFirebase();
