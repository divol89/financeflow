import { signIn, session } from "next-auth/react";
export default function SingInPagen() {
  return (
    // <div>
    //   <button onClick={() => signIn('twitter')}>Sign in with Twitter</button>
    //   </div>
    <p>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
    </p>
  );
}

// import { signIn } from 'next-auth/react';

// const MyComponent = ({ user }) => {
//   const handleButtonClick = async () => {
//     const session = await session(context);

//     if (session) {
//       return signOut();
//     } else {
//       return signIn('twitter');
//     }
//   };

//   return (
//     <div>
//       {user && <h1>Welcome, {user.name}</h1>}
//       <button onClick={handleButtonClick}>Login/Logout</button>
//     </div>
//   );
// };

// export default MyComponent;

// import { signIn, session } from 'next-auth/react';

// const App = () => {
//   const handleButtonClick = async () => {
//     const session = await session(context);

//     if (session) {
//       return signOut();
//     } else {
//       return signIn('twitter');
//     }
//   };

//   return (
//     <div>
//       <h1>My App</h1>
//       <button onClick={handleButtonClick}>Login/Logout</button>
//     </div>
//   );
// };

// export default App;
