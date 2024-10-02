import { z } from "zod";
import { router, publicprocedure } from "../trpc";

// Input for expense allocation
const expenseAllocationInput = z.object({
  categoryId: z.number(), // Category ID for the expense
  amount: z.number().min(0, "Amount must be positive"), // Amount for the expense
  description: z.string().optional(), // Optional description for the expense
});

// Input for allocating income
const allocateIncomeInput = z.object({
  incomeId: z.number(), // The income ID from which we're allocating
  allocations: z.array(expenseAllocationInput), // Allocations to different categories
});

export const earningRouter = router({
  // Allocate income into categories as expenses
  allocateIncome: publicprocedure
    .input(allocateIncomeInput)
    .mutation(async ({ input, ctx }) => {
      const { incomeId, allocations } = input;

      // Check if income exists
      const income = await ctx.db.prisma.earning.findUnique({
        where: { id: incomeId },
      });

      if (!income) {
        throw new Error("Income not found.");
      }

      // Iterate through allocations and create expenses for each category
      const expenses = await Promise.all(
        allocations.map(async (allocation) => {
          return ctx.db.prisma.expense.create({
            data: {
              amount: allocation.amount,
              description: allocation.description || null,
              categoryId: allocation.categoryId, // Link to the category
              date: new Date(),
            },
          });
        })
      );

      return {
        message: "Income allocated successfully to categories.",
        expenses,
      };
    }),

  // Get all earnings for the user
  getEarnings: publicprocedure.query(async ({ ctx }) => {
    const userId = parseInt(ctx.userId as string, 10);

    if (isNaN(userId)) {
      throw new Error("Invalid user ID");
    }

    const earnings = await ctx.db.prisma.earning.findMany({
      where: {
        userId: userId, // Fetch earnings for the logged-in user
      },
      include: {
        allocations: true, // Optional: include allocations if needed
      },
    });

    return {
      earnings,
    };
  }),
});

