import { z } from "zod";
import { publicprocedure, router } from "../trpc";

export const profileRouter = router({
  // 1. Get user profile data
  getProfile: publicprocedure.query(async ({ ctx }) => {
    const userProfile = await ctx.db.prisma.user.findUnique({
      where: {
        id: ctx.userId,
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
        avatar: z.string().optional(), // Avatar URL (optional)
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, email, avatar } = input;

      const updatedProfile = await ctx.db.prisma.user.update({
        where: {
          id: ctx.userId,
        },
        data: {
          name,
          email,
          avatar: avatar || undefined, // Only update if avatar is provided
        },
      });

      return {
        message: "Profile updated successfully.",
        updatedProfile,
      };
    }),
});

