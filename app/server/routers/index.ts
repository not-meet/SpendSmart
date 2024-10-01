import { router } from "../trpc";
import { expenseRouter } from "./expense";
import { categoryRouter } from "./categories";
import { earningRouter } from "./earning";

export const appRouter = router({
  expense: expenseRouter,
  categories: categoryRouter,
  earnings: earningRouter,
});

