import { router } from "../trpc";
import { expenseRouter } from "./expense";

export const appRouter = router({
  expense: expenseRouter,
})

export type appRouter = typeof appRouter;
