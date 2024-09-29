import { z } from "zod";
import { publicprocedure, router } from "../trpc"; // Ensure this import path is correct

export const expenseRouter = router({
  createExpense: publicprocedure
    .input(
      z.object({
        totalSalary: z.number().min(0, "Total salary must be a positive number."),
        categories: z.array(
          z.object({
            title: z.string().min(1, "Title is required."),
            description: z.string().optional(), // Optional description
            amount: z.number().min(0, "Amount must be a positive number."),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { totalSalary, categories } = input;

      // Ensure ctx.db and ctx.userId are correctly typed
      const expense = await ctx.db.prisma.expense.create({
        data: {
          amount: totalSalary,
          userId: ctx.userId,
        },
      });

      for (const category of categories) {
        await ctx.db.prisma.category.create({
          data: {
            name: category.title,
            description: category.description || null, // Optional description
            userId: ctx.userId,
            expenses: {
              connect: { id: expense.id }, // Connect the expense
            },
          },
        });
      }

      return {
        message: "Expense and categories created successfully.",
        expenseId: expense.id,
      };
    }),
});

