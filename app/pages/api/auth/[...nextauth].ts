import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from '@/prisma/lib/prisma';
import { AuthOptions } from "next-auth";

declare module 'next-auth' {
  interface Session {
    user: {
      id: string,
      name?: string | null,
      email?: string | null,
      image?: string | null,
    }
  }
}

export const authOptions: AuthOptions = {
  // Configuration of the NextAuth options
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Enter your username" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" },
      },

      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.username },
        });

        // User does not exist, create new user
        if (!user) {
          const newUser = await prisma.user.create({
            data: {
              email: credentials.username,
              password: credentials.password,  // Note: Consider hashing the password before storing!
            },
          });
          return { id: newUser.id, email: newUser.email };
        }

        // Check password (consider using a proper hashing method here)
        if (user.password !== credentials.password) {
          throw new Error("Invalid credentials");
        }

        // Successful login
        return { id: user.id, email: user.email };
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {

  },

  callbacks: {
    async session({ session, user, token }) {
      if (session?.user) {
        session.user.id = user.id as string;
      }
      return session;
    }
  }
};

export default NextAuth(authOptions);

