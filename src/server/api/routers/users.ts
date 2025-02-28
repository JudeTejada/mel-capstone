import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      where: {
        id: {
          not: ctx.session.user.id,
        },
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        firstName: true,
        lastName: true,
        image: true,
        role: true,
      },
    });

    return {
      status: 201,
      result: users,
    };
  }),

  getUserDetails: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          tasks: {
            select: {
              id: true,
              title: true,
              status: true,
              deadline: true,
            },
            orderBy: {
              deadline: "asc",
            },
          },
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return {
        ...user,
        taskCount: user._count.tasks,
      };
    }),
  getUsersWithTaskCount: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      where: {
        id: {
          not: ctx.session.user.id,
        },
      },
      take: 5,
      select: {
        position: true,
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    return {
      status: 201,
      result: users.map((user) => ({
        ...user,
        taskCount: user._count.tasks,
      })),
    };
  }),
  
  // Add the updateProfile mutation
  updateProfile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        position: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Ensure the user can only update their own profile
      if (ctx.session.user.id !== input.id) {
        throw new Error("You can only update your own profile");
      }

      const updatedUser = await ctx.db.user.update({
        where: { id: input.id },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          position: input.position,
        },
      });

      return {
        status: 200,
        message: "Profile updated successfully",
        user: updatedUser,
      };
    }),
});
