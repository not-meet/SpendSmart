import { z } from "zod";
import { router, publicprocedure } from "../trpc";

// Input for creating a new category
const createCategoryInput = z.object({
  name: z.string().min(1, "Category name is required"),
});

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

const categoryRouter = router({
  // Create a new category for the user
  createCategory: publicprocedure
    .input(createCategoryInput)
    .mutation(async ({ input, ctx }) => {
      const userId = parseInt(ctx.userId as string, 10);

      if (isNaN(userId)) {
        throw new Error("Invalid user ID");
      }

      // Create a new category for the user
      const category = await ctx.db.prisma.category.create({
        data: {
          name: input.name,
          userId: userId,
        },
      });

      return {
        message: "Category created successfully.",
        category,
      };
    }),

  // Get all categories with their associated expenses
  getCategoriesWithExpenses: publicprocedure.query(async ({ ctx }) => {
    const userId = parseInt(ctx.userId as string, 10);

    if (isNaN(userId)) {
      throw new Error("Invalid user ID");
    }

    const categories = await ctx.db.prisma.category.findMany({
      where: {
        userId: userId, // Fetch categories for the logged-in user
      },
      include: {
        expenses: true, // Include related expenses for each category
      },
    });

    return {
      categories,
    };
  }),
});

const earningRouter = router({
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
              date: new Date(), // Optional: use current date
            },
          });
        })
      );

      return {
        message: "Income allocated successfully to categories.",
        expenses, // Return created expenses for confirmation
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

// Combine all routes into one app router
export const appRouter = router({
  earnings: earningRouter,
  categories: categoryRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;

