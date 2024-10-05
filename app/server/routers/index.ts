import { router } from "../trpc";
import { expenseRouter } from "./expense";
import { categoryRouter } from "./categories";
import { earningRouter } from "./earning";
import AppRouter from "next/dist/client/components/app-router";

export const appRouter = router({
  expense: expenseRouter,
  categories: categoryRouter,
  earnings: earningRouter,
});

export type AppRouter = typeof appRouter;
