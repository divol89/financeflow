  // import React, { useState } from 'react';
  // import { ethers } from 'ethers';
  // import { useTokens } from '../pages/contexts/TokenContext';

  // const AdminLogin = () => {
  //   const [address, setAddress] = useState("");
  //   const [poolAddress, setPoolAddress] = useState("");
  //   const [logo, setLogo] = useState("");
  //   const [name, setName] = useState("");
  //   const { setTokens } = useTokens();

  //   const addToken = () => {
  //     setTokens(prevTokens => [...prevTokens, {
  //       address,
  //       poolAddress,
  //       logo,
  //       name
  //     }]);

  //     // Limpia los campos de entrada después de agregar el token
  //     setAddress("");
  //     setPoolAddress("");
  //     setLogo("");
  //     setName("");
  //   }

  //   const login = async () => {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const address = await signer.getAddress();

  //     // Comprueba si la dirección es una dirección de administrador
  //     if (setTokens) { // reemplaza 0x123... con la dirección de administrador real
  //       addToken();
  //     } else {
  //       alert("No tienes permisos para agregar tokens.");
  //     }
  //   }

  //   return (
  //     <div className="admin-login">
  //       <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Token Address" />
  //       <input type="text" value={poolAddress} onChange={(e) => setPoolAddress(e.target.value)} placeholder="Pool Address" />
  //       <input type="text" value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="Logo URL" />
  //       <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Token Name" />
  //       <button onClick={login}>Agregar token</button>
  //     </div>
  //   )
  // }

  // export default AdminLogin;



////////////////////////////////////////////////////////////////
// import React, { useState } from 'react';
// import { useTokens } from '../pages/contexts/TokenContext';

// import Web3 from 'web3';

// const AdminLogin = () => {
//   const [address, setAddress] = useState('');
//   const [poolAddress, setPoolAddress] = useState('');
//   const [logo, setLogo] = useState('');
//   const [name, setName] = useState('');
//   const { setTokens } = useTokens();

//   const addToken = () => {
//     setTokens(prevTokens => [
//       ...prevTokens,
//       {
//         address,
//         poolAddress,
//         logo,
//         name
//       }
//     ]);

//     // Limpia los campos de entrada después de agregar el token
//     setAddress('');
//     setPoolAddress('');
//     setLogo('');
//     setName('');
//   };

//   const initializeMetaMask = async () => {
//     if (typeof window.ethereum !== 'undefined') {
//       try {
//         await window.ethereum.request({ method: 'eth_requestAccounts' });
//         const provider = new Web3(window.ethereum);
//         const accounts = await provider.eth.getAccounts();
//         const address = accounts[0];

//         // Comprueba si la dirección es una dirección de administrador
//         if (address === '0xDe9B8815cCa12EFbaE289d4287ABB20b7732706e') {
//           addToken();
//         } else {
//           alert('No tienes permisos para agregar tokens.');
//         }
//       } catch (error) {
//         console.error('Error al conectar a MetaMask:', error);
//       }
//     } else {
//       alert('MetaMask no está instalado. Asegúrate de tenerlo instalado e iniciado.');
//     }
//   };

//   const login = async () => {
//     initializeMetaMask();
//   };

//   return (
//     <div className="admin-login">
//       <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Token Address" />
//       <input type="text" value={poolAddress} onChange={e => setPoolAddress(e.target.value)} placeholder="Pool Address" />
//       <input type="text" value={logo} onChange={e => setLogo(e.target.value)} placeholder="Logo URL" />
//       <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Token Name" />
//       <button onClick={login}>Agregar token</button>
//     </div>
//   );
// };

// export default AdminLogin;


// import React, { useState } from 'react';
// import { useTokens } from '../pages/contexts/TokenContext';
// import { db } from '../pages/firebase';

// const AdminLogin = () => {
//   const [address, setAddress] = useState('');
//   const [poolAddress, setPoolAddress] = useState('');
//   const [logo, setLogo] = useState('');
//   const [name, setName] = useState('');
//   const { setTokens } = useTokens();

//   const addToken = () => {
//     const token = {
//       address: address,
//       poolAddress: poolAddress,
//       logo: logo,
//       name: name
//     };

//     // Agrega el nuevo token a Firebase
//     db.collection('tokens')
//       .add(token)
//       .then(docRef => {
//         console.log('Token agregado correctamente:', docRef.id);
//         // Puedes usar docRef.id para acceder al ID del documento recién creado si lo necesitas
//       })
//       .catch(error => {
//         console.error('Error al agregar el token:', error);
//       });

//     // Limpia los campos de entrada después de agregar el token
//     setAddress('');
//     setPoolAddress('');
//     setLogo('');
//     setName('');
//   };

//   const initializeMetaMask = async () => {
//     // Resto del código
//   };

//   const login = async () => {
//     initializeMetaMask();
//   };

//   return (
//     <div className="admin-login">
//       <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Token Address" />
//       <input type="text" value={poolAddress} onChange={e => setPoolAddress(e.target.value)} placeholder="Pool Address" />
//       <input type="text" value={logo} onChange={e => setLogo(e.target.value)} placeholder="Logo URL" />
//       <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Token Name" />
//       <button onClick={login}>Agregar token</button>
//     </div>
//   );
// };

// export default AdminLogin;


// import React, { useState } from 'react';
// import { ethers } from 'ethers';
// import { useTokens } from '../pages/contexts/TokenContext';

// const AdminLogin = () => {
//   const [address, setAddress] = useState("");
//   const [poolAddress, setPoolAddress] = useState("");
//   const [logo, setLogo] = useState("");
//   const [name, setName] = useState("");
//   const [id, setId] = useState("");
//   const { setTokens } = useTokens();

//   const addToken = () => {
//     setTokens(prevTokens => [
//       ...prevTokens,
//       {
//         id: generateId(), // Genera un ID único para el token (puedes utilizar tu propia lógica para esto)
//         address,
//         poolAddress,
//         logo,
//         name
//       }
//     ]);

//     // Limpia los campos de entrada después de agregar el token
//     setId("")
//     setAddress("");
//     setPoolAddress("");
//     setLogo("");
//     setName("");
//   };

//   const generateId = () => {
//     // Implementa tu lógica para generar un ID único aquí
//     // Por ejemplo, puedes usar un paquete como 'uuid' o generar un ID basado en la fecha y hora actual
//     // Aquí se muestra un ejemplo simple usando la fecha y hora actual:
//     return Date.now().toString();
//   };

//   const login = async () => {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const address = await signer.getAddress();

//     // Comprueba si la dirección es una dirección de administrador
//     if (setTokens) { // Reemplaza 0x123... con la dirección de administrador real
//       addToken();
//     } else {
//       alert("No tienes permisos para agregar tokens.");
//     }
//   };

//   return (
//     <div className="admin-login">
//       <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Token Address" />
//       <input type="text" id="poolAddress" value={poolAddress} onChange={(e) => setPoolAddress(e.target.value)} placeholder="Pool Address" />
//       <input type="text" id="logo" value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="Logo URL" />
//       <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Token Name" />
//       <button onClick={login}>Agregar token</button>
//     </div>
//   );
// };

// export default AdminLogin;



import React, { useState } from 'react';
import { db } from '../firebase/firebase';

const AdminLogin = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [logo, setLogo] = useState('');
  const [poolAddress, setPoolAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await db.collection('tokens').add({
        name,
        address,
        logo,
        poolAddress
      });

      // reset form after submission
      setName('');
      setAddress('');
      setLogo('');
      setPoolAddress('');

      alert('Document successfully created!');
    } catch (error) {
      console.error('Error creating document: ', error);
    }
  };

  return (
    <form className="space-y-4 block lg:block" onSubmit={handleSubmit}>
  <input className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-4" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Token Name" required />
  <input className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-4" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Token Contract" required />
  <input className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-4" type="url" value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="Logo URL" required />
  <input className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-4" type="text" value={poolAddress} onChange={(e) => setPoolAddress(e.target.value)} placeholder="Token Pool Address" required />
  <div className="flex items-center justify-center">
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Done</button>
  </div>
</form>

  );
};

export default AdminLogin;





