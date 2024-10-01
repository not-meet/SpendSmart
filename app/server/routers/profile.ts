import { z } from "zod";
import { publicprocedure, router } from "../trpc";

export const profileRouter = router({
  // 1. Get user profile data
  getProfile: publicprocedure.query(async ({ ctx }) => {
    const userId = parseInt(ctx.userId as string, 10); // Convert userId to number

    if (isNaN(userId)) {
      throw new Error("Invalid user ID");
    }

    const userProfile = await ctx.db.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userProfile) {
      throw new Error("User not found");
    }

    return {
      userProfile,
    };
  }),

  // 2. Update user profile
  updateProfile: publicprocedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required."),
        email: z.string().email("Please enter a valid email."),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = parseInt(ctx.userId as string, 10); // Convert userId to number

      if (isNaN(userId)) {
        throw new Error("Invalid user ID");
      }

      const { name, email } = input;

      const updatedProfile = await ctx.db.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
          email,
        },
      });

      return {
        message: "Profile updated successfully.",
        updatedProfile,
      };
    }),
});

