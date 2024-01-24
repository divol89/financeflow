// import SignInPage from '../SignInPage';
// import React from 'react';
// import { signIn, useSession } from 'next-auth/react';
// import Points from '../../components/twitter/Points';
// import { SessionProvider } from 'next-auth/react';

// function App() {
//   const { data: session } = useSession();

//   if (!session) {
//     return (
//       <div>
//         <button onClick={() => signIn('twitter')}>Sign in with Twitter</button>
//       </div>
//     );
//   }

//   return (
//     <SessionProvider>
//       <Points />
//     </SessionProvider>
//   );
// }

// export default App;

import SignInPage from '../SignInPage';
import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import Points from '../../components/twitter/Points';
import { SessionProvider } from 'next-auth/react';

function App() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <button onClick={() => signIn('twitter')}>Sign in with Twitter</button>
      </div>
    );
  }

  return (
    <SessionProvider>
      <Points />
    </SessionProvider>
  );
}

export default App;
