import { Priority, Status } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  addCommentSchema,
  deleteTaskSchema,
  editTaskSchema,
  getCommentsByTaskIdSchema,
  taskSchema,
  updateStatusSchema,
} from "~/validation/task";

export const tasksRouter = createTRPCRouter({
  addTask: protectedProcedure
    .input(taskSchema)
    .mutation(async ({ input, ctx }) => {
      const task = await ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          assigned: {
            connect: { id: input.userId },
          },
          deadline: new Date(input.deadline),
          priority: input.priority,
        },
      });

      return {
        status: 201,
        message: "Task Successfully created!",
        data: task,
      };
    }),
  editTask: protectedProcedure
    .input(editTaskSchema)
    .mutation(async ({ input, ctx }) => {
      const task = await ctx.db.task.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          assigned: {
            connect: { id: input.userId },
          },
          deadline: new Date(input.deadline),
          priority: input.priority,
        },
      });

      return {
        status: 200,
        message: "Task Successfully updated!",
        data: task,
      };
    }),
  updateStatus: protectedProcedure
    .input(updateStatusSchema)
    .mutation(async ({ input, ctx }) => {
      const task = await ctx.db.task.update({
        where: { id: input.id },
        data: {
          status: input.status,
        },
      });

      return {
        status: 200,
        message: "Task status  updated!",
        data: task,
      };
    }),

  deleteTask: protectedProcedure
    .input(deleteTaskSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.task.delete({
        where: { id: input.id },
      });

      return {
        status: 200,
        message: "Task Successfully deleted!",
      };
    }),

  getTaskById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const task = await ctx.db.task.findUnique({
        where: { id: input },
        select: {
          id: true,
          title: true,
          status: true,
          assigned: true,
          deadline: true,
          priority: true,
          createdAt: true,
          assignedId: true,
          description: true,
        },
      });

      if (!task) {
        return {
          status: 404,
          message: "Task not found!",
        };
      }

      return {
        status: 201,
        message: "Task Successfully retrieved!",
        task: task,
      };
    }),
  getRecentTasks: protectedProcedure.query(async ({ input, ctx }) => {
    const tasks = await ctx.db.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        status: "INPROGRESS" || "TODO",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        assigned: true,

        deadline: true,
        priority: true,
        createdAt: true,
      },
    });

    return {
      status: 201,
      data: tasks,
    };
  }),

  getAllTasks: protectedProcedure.query(async ({ input, ctx }) => {
    const tasks = await ctx.db.task.findMany({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        title: true,
        status: true,
        assigned: true,
        deadline: true,
        priority: true,
        createdAt: true,
        assignedId: true,
        description: true,
      },
    });

    return {
      status: 201,
      data: tasks,
    };
  }),
  getMainTasks: protectedProcedure.query(async ({ ctx }) => {
    const taskCounts = await ctx.db.task.groupBy({
      by: ["priority"],
      _count: {
        priority: true,
      },
    });

    const inProgressCount =
      taskCounts.find((count) => count.priority === Priority.LOW)?._count
        .priority ?? 0;
    const mediumCount =
      taskCounts.find((count) => count.priority === Priority.MEDIUM)?._count
        .priority ?? 0;
    const highCount =
      taskCounts.find((count) => count.priority === Priority.HIGH)?._count
        .priority ?? 0;

    return {
      status: 201,
      data: {
        low: inProgressCount,
        medium: mediumCount,
        high: highCount,
      },
    };
  }),
  addComment: protectedProcedure
    .input(addCommentSchema)
    .mutation(async ({ input, ctx }) => {
      const comment = await ctx.db.comment.create({
        data: {
          text: input.text,
          taskId: input.taskId,
          userId: ctx.session.user.id,
        },
      });

      return {
        status: 201,
        message: "Comment Successfully added!",
        data: comment,
      };
    }),

  getAllCommentsByTaskID: protectedProcedure
    .input(getCommentsByTaskIdSchema)
    .query(async ({ input, ctx }) => {
      const comments = await ctx.db.comment.findMany({
        where: { taskId: input },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (comments.length === 0) {
        return {
          status: 200,
          message: "Comments Successfully retrieved!",
          data: [],
        };
      }

      return {
        status: 200,
        message: "Comments Successfully retrieved!",
        data: comments,
      };
    }),
});

// export type GetAllCommentsByTaskIDReturnType = inferAsyncReturnType<
//   typeof tasksRouter.getAllCommentsByTaskID._def.type
// >;

export type GetAllCommentsByTaskIDReturnType = Awaited<
  ReturnType<typeof tasksRouter.getAllCommentsByTaskID>
>;
type test = GetAllCommentsByTaskIDReturnType["data"];
