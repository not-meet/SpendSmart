// server/context.ts
import { prisma } from '@/prisma/lib/prisma'; // Adjust the path to your Prisma client file
import { getSession } from 'next-auth/react'; // Assuming you're using next-auth for authentication
import type { NextApiRequest, NextApiResponse } from 'next';
import { inferAsyncReturnType } from '@trpc/server';
// Create context for tRPC
export async function createContext({ req, res }: { req: NextApiRequest; res: NextApiResponse }) {
  // Get the session from NextAuth (assuming you're using next-auth)
  const session = await getSession({ req });

  // Return the required context
  return {
    db: { prisma }, // Provide Prisma instance to the context
    userId: session?.user?.id, // Assuming the session contains user ID from next-auth
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

