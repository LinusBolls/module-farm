import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import winston from "winston";

const loggingFormat = winston.format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: loggingFormat,
  // winston.format.combine(
  //   winston.format.timestamp(),
  //   loggingFormat,
  // ),
  defaultMeta: { service: 'auth' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

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

        console.log("before sack")
        logger.info("before nacken")

        const user = await prisma.user.findUnique({
          where: { username: credentials?.username },
        });
        const passwordIsCorrect = await bcrypt.compare(credentials?.password ?? "", user?.password ?? "")

        const credentialsAreValid = user != null && passwordIsCorrect

        console.log("signin attempt:", credentialsAreValid)

        if (credentialsAreValid) {
          // Any user object returned here will be saved in the session,
          // and can be used in the `session` callback.
          return {
            id: user.id,
            name: user.username,
            email: user.email,
          };
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
  session: { strategy: "jwt" },
  secret: process.env.SECRET,
  callbacks: {
    // @ts-ignore
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signIn")

      return true;
    },
    // @ts-ignore
    async redirect({ url, baseUrl }) {
      console.log("redirect")

      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    // @ts-ignore
    async jwt({ token, account }) {
      console.log("jwt")

      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // @ts-ignore
    async session({ session }) {

      session.userId = session.user.id;

      return session;
    },
  },
};
// @ts-ignore
export default (req, res) => NextAuth(req, res, options);
