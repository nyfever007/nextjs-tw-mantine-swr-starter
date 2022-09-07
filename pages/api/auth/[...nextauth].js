import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
const apiKey = process.env.SITE_API_KEY;
const baseUrl = process.env.SITE_API_URL;
export default NextAuth({
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'email', placeholder: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        try {
          // const userPassword = req.body.password

          // const userEmail = req.body.email;

          // // check if email exist
          // const validateUser = await axios({
          //   headers: {
          //     XApiKey: apiKey,
          //   },
          //   method: 'POST',
          //   url: `${baseUrl}/login`,
          //   data: { email: userEmail },
          // });
          // const preData = await validateUser.data;

          // let validate = false;
          // // if user exist, compare password
          // if (preData.id) {
          //   validate = await bcrypt.compare(
          //     credentials.password,
          //     preData.password
          //   );
          // }
          const user = await axios({
            headers: {
              XApiKey: apiKey,
            },
            method: 'POST',
            url: `${baseUrl}/UserLogin`,
            data: credentials,
          });

          // if user exists && password match retrun user info and signin.
          if (user.data.uId) {
            const data = {
              id: user.uId,
              userFirstName: user.data.userFirstName,
              userLastName: user.data.userLastName,
              userBizName: user.data.userBizName,
              isApproved: user.data.isApproved,
            };

            return data;
          } else {
            throw new Error('Invalid Crediential. Please try again');
          }
        } catch (error) {
          throw new Error('Invalid Crediential. Please try again');
        }
      },
    }),
  ],

  secret:
    'AkD4CgTdD2nsZ9SBj4UrTbDKaaeN6xkGEZkkBH6HNufSyN5SFzcbdbwbztjApdth49Z8PpLv5GxZPq9vRADt6XNXfvF6yjS9cj4CR8FNaLt8j5psTBbMzccULFsK',

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 7, // 7 days
  },

  pages: {
    signIn: '/signin', // Displays signin buttons
    signOut: 'signout', // Displays form with sign out button
    error: '/signin',
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: '/firstTimer' // If set, new users will be directed here on first sign in
  },

  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.jwt = user.jwt;
        token.user = user;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.jwt = token.jwt;
      session.user = token.user;
      return session;
    },
  },

  debug: false,
});
