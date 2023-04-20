import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

const options = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign-in form (e.g., "Sign in with...")
      name: "Username and Password",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Add your own logic here to find the user by username and password.
        // You can use any data fetching library or ORM to fetch your user.
        // For example, you could use the Prisma ORM as follows:
        const user = await prisma.user.findUnique({
            // @ts-ignore
          where: { username: credentials.username },
        });

        // @ts-ignore
        if (user && user.password === credentials.password) {
          // Any user object returned here will be saved in the session,
          // and can be used in the `session` callback.
          return { id: user.id, name: user.name, email: user.email };
        } else {
          // If you return null or false, the credentials will be rejected,
          // and the user will see an error message.
          return null;
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    // @ts-ignore
    async session(session, user) {
      session.userId = user.id;
      return session;
    },
  },
};
// @ts-ignore
export default (req, res) => NextAuth(req, res, options);
