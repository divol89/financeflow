import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This will only run on the client side
    import("next-auth/react").then(({ getSession }) => {
      getSession().then((sessionData) => {
        setSession(sessionData);
        setLoading(false);
      });
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-4">Sign In</h1>
        {!session ? (
          <div>
            <p className="text-gray-300 mb-4">Not signed in</p>
            <button
              onClick={() => signIn()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Sign in
            </button>
          </div>
        ) : (
          <div>
            <p className="text-green-400">Signed in as {session.user?.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
