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

export const categoryRouter = router({
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

