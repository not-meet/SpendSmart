import { z } from "zod";
import { publicprocedure, router } from "../trpc";

export const expenseRouter = router({
  createExpense: publicprocedure
    .input(
      z.object({
        totalSalary: z.number().min(0, "Total salary must be a positive number."),
        categories: z.array(
          z.object({
            title: z.string().min(1, "Title is required."),
            description: z.string().optional(), // Optional description for the expense, not category
            amount: z.number().min(0, "Amount must be a positive number."),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { totalSalary, categories } = input;

      // Convert userId to a number
      const userId = parseInt(ctx.userId as string, 10);

      if (isNaN(userId)) {
        throw new Error("Invalid user ID");
      }

      // Create categories and associate them with the created expense
      for (const category of categories) {
        const newCategory = await ctx.db.prisma.category.create({
          data: {
            name: category.title,
            userId: userId, // Associate the category with the user
          },
        });

        // Create the expense and associate it with the category
        await ctx.db.prisma.expense.create({
          data: {
            amount: category.amount, // Use the amount for the expense
            description: category.description || null, // Optional description
            categoryId: newCategory.id, // Link the expense to the category
            date: new Date(), // Optional: set the date of the expense
          },
        });
      }

      return {
        message: "Expense and categories created successfully.",
      };
    }),
});

