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
