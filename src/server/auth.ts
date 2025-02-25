import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

import { db } from "~/server/db";
import { loginSchema } from "~/validation/auth";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: "USER" | "ADMIN";
      firstName: string;
      lastName: string;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub as string,
          firstName: profile.given_name as string ?? "",
          lastName: profile.family_name as string ?? "", // Ensure lastName is always provided
          email: profile.email as string,
          image: profile.picture as string,
          role: "USER",
          password: "", // Empty password for OAuth users
          position: "" // Default empty position for OAuth users
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        const cred = await loginSchema.parseAsync(credentials);
        console.log("🚀 ~ authorize: ~ cred:", cred)

        const user = await db.user.findFirst({
          where: { email: cred.email },
        });

        console.log("🚀 ~ authorize: ~ user:", user);

        if (!user) {
          return null;
        }

        const isValidPassword = bcrypt.compareSync(
          cred.password,
          user.password,
        );

        if (!isValidPassword) {
          return null;
        }

        console.log("🚀 ~ authorize: ~ isValidPassword:", isValidPassword);

        // Explicitly return the user with additional fields;
        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image, // Include other necessary fields
          role: user.role,
          position: user.position,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        // @ts-expect-error it is expected
        token.firstName = user.firstName; // Include firstName
        // @ts-expect-error it is expected
        token.lastName = user.lastName; // Include lastName
        token.image = user.image; // Include other necessary fields
        // @ts-expect-error it is expected
        token.role = user.role; // Include other necessary fields
      }
      return Promise.resolve(token);
    },
    session: async ({ token, session }) => {
      // @ts-expect-error it is expected
      session.user = token;
      return Promise.resolve(session);
    },
  },
};
/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
