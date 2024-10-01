import { router } from "../trpc";
import { expenseRouter } from "./expense";
import { categories } from "./categories";
export const appRouter = router({
  expense: expenseRouter,
  categories: categories,
})

export type appRouter = typeof appRouter;
