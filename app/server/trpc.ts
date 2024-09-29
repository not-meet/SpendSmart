import { initTRPC } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";
import { prisma } from "@/prisma/lib/prisma";

// Create the context with session and Prisma
export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getSession({ req: opts.req });
  const userId = session?.user?.id;

  return {
    db: {
      prisma, // Prisma client for database operations
    },
    userId, // User ID from the session, if available
  };
};

// Explicitly infer the type from the context return
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicprocedure = t.procedure;
export const middleware = t.middleware;

