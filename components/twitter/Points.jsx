// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useSession } from 'next-auth/react';

// function UserTimeline() {
//   const [tweets, setTweets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { data: session } = useSession();
//   const bearerToken = process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN; // Asegúrate de que esta variable de entorno está definida en tu archivo .env.local

//   // useEffect(() => {
//   //   if (!session) return; // No hacer nada si no hay sesión.

//   //   const username = session.user.name; // Asume que el nombre de usuario está en session.user.name.

//   //   const getUserTimeline = async () => {
//   //     try {
//   //       // Primero, obtener el ID del usuario basado en el nombre de usuario.
//   //       const userResponse = await axios.get(`https://api.twitter.com/2/users/by/username/${username}`, {
//   //         headers: {
//   //           'Authorization': `Bearer ${bearerToken}`
//   //         }
//   //       });

//   //       const userId = userResponse.data.data.id;

//   //       // Luego, obtener los tweets del timeline del usuario usando el ID del usuario.
//   //       const tweetsResponse = await axios.get(`https://api.twitter.com/2/users/${userId}/tweets`, {
//   //         headers: {
//   //           'Authorization': `Bearer ${bearerToken}`
//   //         }
//   //       });

//   //       setTweets(tweetsResponse.data.data); // Asume que los tweets están en tweetsResponse.data.data.
//   //       setLoading(false);
//   //     } catch (error) {
//   //       console.error('Hubo un error al obtener los tweets del timeline del usuario:', error);
//   //       setLoading(false);
//   //     }
//   //   };

//   //   getUserTimeline();
//   // }, [session, bearerToken]);
// useEffect(() => {
//   if (!session) return;

//   const username = session.user.name;

//   const getUserTimeline = async () => {
//     try {
//       const response = await axios.get(`/pages/api/twitter?username=${username}`);
//       setTweets(response.data.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Hubo un error al obtener los tweets del timeline del usuario:', error);
//       setLoading(false);
//     }
//   };

//   getUserTimeline();
// }, [session]);


//   if (!session) return <p>Inicia sesión para ver tus tweets.</p>;
//   if (loading) return <p>Cargando tweets...</p>;

//   return (
//     <div>
//       <h1>Tweets de {session.user.name}</h1>
//       <ul>
//         {tweets.map(tweet => (
//           <li key={tweet.id}>{tweet.text}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default UserTimeline;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useSession, signIn } from 'next-auth/react';

// function UserTimeline() {
//   const [tweets, setTweets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { data: session } = useSession();
//   const bearerToken = process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN;

//   useEffect(() => {
//     if (!session) {
//       console.log('El usuario no está autenticado');
//       return; // No hacer nada si no hay sesión.
//     }

//     const username = session.user.name; // Asume que el nombre de usuario está en session.user.name.

//     const getUserTimeline = async () => {
//       try {
//         const userResponse = await axios.get(`https://api.twitter.com/2/users/by/username/${username}`, {
//           headers: {
//             'Authorization': `Bearer ${bearerToken}`
//           }
//         });

//         const userId = userResponse.data.data.id;

//         const tweetsResponse = await axios.get(`https://api.twitter.com/2/users/${userId}/tweets`, {
//           headers: {
//             'Authorization': `Bearer ${bearerToken}`
//           }
//         });

//         setTweets(tweetsResponse.data.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Hubo un error al obtener los tweets del timeline del usuario:', error);
//         setLoading(false);
//       }
//     };

//     getUserTimeline();
//   }, [session, bearerToken]);

//   if (!session) return <button onClick={() => signIn('twitter')}>Login with Twitter</button>;
//   if (loading) return <p>Cargando tweets...</p>;

//   return (
//     <div>
//       <h1>Tweets de {session.user.name}</h1>
//       <ul>
//         {tweets.map(tweet => (
//           <li key={tweet.id}>{tweet.text}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default UserTimeline;

// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';

// function MiComponente() {
//   const [tweets, setTweets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { data: session } = useSession();

//   useEffect(() => {
//     if (!session) return; // No hacer nada si no hay sesión.

//     const username = session.user.name; // Asume que el nombre de usuario está en session.user.name.

//     const obtenerTweets = async () => {
//       try {
//         const response = await axios.get('/api/twitter', {
//           params: { username } // Usa el nombre de usuario de la sesión
//         });
//         setTweets(response.data.data); // Asume que los tweets están en response.data.data.
//         setLoading(false);
//       } catch (error) {
//         console.error('Hubo un error al obtener los tweets:', error);
//         setLoading(false);
//       }
//     };

//     obtenerTweets();
//   }, [session]);

//   if (!session) return <p>Inicia sesión para ver tus tweets.</p>;
//   if (loading) return <p>Cargando tweets...</p>;

//   return (
//     <div>
//       <h1>Tweets de {session.user.name}</h1>
//       <ul>
//         {tweets.map(tweet => (
//           <li key={tweet.id}>{tweet.text}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default MiComponente;


import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

function MiComponente() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return; // No hacer nada si no hay sesión.

    const username = session.user.name; // Asume que el nombre de usuario está en session.user.name.

    const obtenerInfoUsuario = async () => {
      try {
        const response = await axios.get('/api/userInfo', {
          params: { username }, // Usa el nombre de usuario de la sesión
          headers: {
            'Authorization': `Bearer ${session.accessToken}` // Usa el token de acceso de la sesión
          }
        });
        setUserInfo(response.data); // Asume que la información del usuario está en response.data.
        setLoading(false);
      } catch (error) {
        console.error('Hubo un error al obtener la información del usuario:', error);
        setLoading(false);
      }
    };

    obtenerInfoUsuario();
  }, [session]);

  if (!session) return <p>Inicia sesión para ver tu información.</p>;
  if (loading) return <p>Cargando información...</p>;

  return (
    <div>
      <h1>Información de Usuario</h1>
      {userInfo ? (
        <div>
          <p>Nombre: {userInfo.name}</p>
          <p>Usuario: {userInfo.screen_name}</p>
          <p>Descripción: {userInfo.description}</p>
          <p>Seguidores: {userInfo.followers_count}</p>
          <p>Siguiendo: {userInfo.friends_count}</p>
          <p>Email: {userInfo.email}</p>
          <img src={userInfo.profile_image_url_https} alt="Profile" />
          {/* ... otros campos que quieras mostrar */}
        </div>
      ) : (
        loading ? <p>Cargando información...</p> : <p>No se pudo cargar la información del usuario.</p>
      )}
    </div>
  );
}

export default MiComponente;
