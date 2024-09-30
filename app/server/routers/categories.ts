import { z } from "zod";
import { publicprocedure, router } from "../trpc";

export const categoryRouter = router({
  // 1. Create a category with title, description, and amount spent
  createCategory: publicprocedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required."),
        description: z.string().optional(), // Optional description
        amount: z.number().min(0, "Amount must be a positive number."), // Amount field
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { title, description, amount } = input;

      // Create category for the logged-in user
      const category = await ctx.db.prisma.category.create({
        data: {
          name: title,
          description: description || null,
          amount, // Capture the amount spent
          userId: ctx.userId, // Assuming userId is fetched from session
        },
      });

      return {
        message: "Category created successfully.",
        category,
      };
    }),

  // 2. Get all categories for the user and return the total sum of amounts
  getCategories: publicprocedure.query(async ({ ctx }) => {
    const categories = await ctx.db.prisma.category.findMany({
      where: {
        userId: ctx.userId, // Fetch categories only for the logged-in user
      },
    });

    // Calculate the total amount spent
    const totalAmount = categories.reduce((sum: number, category: any) => sum + category.amount, 0);

    return {
      categories,
      totalAmount, // Return the total sum of amounts
    };
  }),

  // 3. Update a category
  updateCategory: publicprocedure
    .input(
      z.object({
        categoryId: z.string().min(1, "Category ID is required."),
        title: z.string().optional(),
        description: z.string().optional(),
        amount: z.number().optional(), // Allow updating the amount
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { categoryId, title, description, amount } = input;

      const updatedCategory = await ctx.db.prisma.category.update({
        where: {
          id: categoryId,
        },
        data: {
          name: title || undefined, // Only update if a new title is provided
          description: description || undefined, // Only update if a new description is provided
          amount: amount || undefined, // Only update if a new amount is provided
        },
      });

      return {
        message: "Category updated successfully.",
        updatedCategory,
      };
    }),

  // 4. Delete a category
  deleteCategory: publicprocedure
    .input(
      z.object({
        categoryId: z.string().min(1, "Category ID is required."),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { categoryId } = input;

      await ctx.db.prisma.category.delete({
        where: {
          id: categoryId,
        },
      });

      return {
        message: "Category deleted successfully.",
      };
    }),
});

