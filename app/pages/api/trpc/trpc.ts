import { initTRPC } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";
import { prisma } from "@/prisma/lib/prisma";
import { NextApiRequest } from "next";


const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getSession({ req: opts.req });
  const userId = session?.user?.id;
  return {
    db: {
      prisma,
    },
    userId,
  };
};

const t = initTRPC.context<ReturnType<typeof createContext>>().create()

export const router = t.router;
export const publicprocedure = t.procedure;
export const middleware = t.middleware;

export type Context = Awaited<ReturnType<typeof createContext>>;
