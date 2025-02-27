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
});
