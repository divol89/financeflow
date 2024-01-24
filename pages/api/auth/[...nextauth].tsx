// import NextAuth from 'next-auth';
// import TwitterProvider from "next-auth/providers/twitter";

// export default NextAuth({
//   providers: [
//     TwitterProvider({
//       clientId: process.env.NEXT_TWITTER_CONSUMER_KEY,
//       clientSecret: process.env.NEXT_TWITTER_CONSUMER_SECRET,
//     }),
//   ],
//   callbacks: {
//     async jwt(token, account) {
//       if (account) {
//         // Añadir el accesstoken y el tokensecret al token
//         token.accessToken = account.accessToken;
//         token.tokenSecret = account.tokenSecret;
//       }
//       return token;
//     },
//     async session(session, token) {
//       // Añadir el accesstoken y el tokensecret a la sesión
//       session.accessToken = token.accessToken;
//       session.tokenSecret = token.tokenSecret;
//       return session;
//     },
//   },
// });









// import NextAuth from 'next-auth';
// import TwitterProvider from "next-auth/providers/twitter";

// export default NextAuth({
//   providers: [
//     TwitterProvider({
//       clientId: process.env.NEXT_TWITTER_CONSUMER_KEY,
//       clientSecret: process.env.NEXT_TWITTER_CONSUMER_SECRET,
//     }),
//   ],
//   callbacks: {
//     session: async (session, user) => {
//       if (user && user.accessToken) {
//         session.accessToken = user.accessToken;
//       } else {
//         console.error('User object or accessToken is undefined:', user);
//       }
//       return session;
//     },
//   },
// });


// import NextAuth from 'next-auth';
// import TwitterProvider from "next-auth/providers/twitter";

// export default NextAuth({
//   providers: [
//     TwitterProvider({
//       clientId: process.env.NEXT_TWITTER_CONSUMER_KEY,
//       clientSecret: process.env.NEXT_TWITTER_CONSUMER_SECRET,
//     }),
//   ],
//   callbacks: {
//     session: async (session, token) => {
//       if (token && token.accessToken) {
//         session.accessToken = token.accessToken;
//       } else {
//         // Manejar el error de forma adecuada
//         // Devolver la sesión sin modificar
//         return session;
//       }
//       return session;
//     },
//   },
// });


// import NextAuth from 'next-auth';
// import TwitterProvider from "next-auth/providers/twitter";

// export default NextAuth({
//   providers: [
//     TwitterProvider({
//       clientId: process.env.NEXT_TWITTER_CONSUMER_KEY,
//       clientSecret: process.env.NEXT_TWITTER_CONSUMER_SECRET,
//     }),
//   ],
//   callbacks: {
//     session: async (session, user) => {
//       if (user && user.accessToken) {
//         session.accessToken = user.accessToken;
//       } else {
//         console.error('User object or accessToken is undefined:', user);
//       }
//       return session;
//     },
//   },
// });


// import NextAuth from 'next-auth';
// import TwitterProvider from "next-auth/providers/twitter";

// export default NextAuth({
//   providers: [
//     TwitterProvider({
//       clientId: process.env.NEXT_TWITTER_CONSUMER_KEY,
//       clientSecret: process.env.NEXT_TWITTER_CONSUMER_SECRET,
//     }),
//   ],
//   callbacks: {
//     jwt: async (token, _user, account) => {
//       if (account) {
//         console.log('Account Object:', account); // Log the account object
//         // token.accessToken = account.accessToken;
//         token.accessToken = account.oauth_token; // Aquí asumo que el accessToken es oauth_token basado en tu log.

//       }
//       console.log('Token Object:', token); // Log the token object
//       return token;
//     },
//     session: async (session, user) => {
//       if (user && user.accessToken) {
//         session.accessToken = user.accessToken;
//       } else {
//         console.error('User object or accessToken is undefined:', user);
//       }
//       return session;
//     },
//   },
// });


import NextAuth from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'

export default NextAuth({
    providers: [
        TwitterProvider({
            clientId: process.env.NEXT_TWITTER_CONSUMER_KEY as string,
            clientSecret: process.env.NEXT_TWITTER_CONSUMER_SECRET as string,
            // version: "2.0",
        })
    ],
 
    callbacks: {
        async jwt({ token, user, account = {}, profile }) {

            console.log(profile)
            // console.log(isNewUser)
            if (account?.provider && !token[account.provider]) {
                token[account.provider] = {};
            };

            if (account?.access_token) {
                // @ts-ignore
                token[account?.provider].accessToken = account?.access_token
            }

            if (account?.refresh_token) {
                // @ts-ignore
                token[account?.provider].refreshToken = account?.refresh_token;
                // @ts-ignore
                token[account?.provider].accountId = user?.id;
            }

            profile && (token.user = profile)

            return token
        },

        // @ts-ignore
        async session({ session, token }){
            // @ts-ignore
            session.user = token.user
            return session
        }
    }
})