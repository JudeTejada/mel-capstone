import { Priority, Status } from "@prisma/client";
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
          assignees: {
            connect: input.assigneeIds?.map((id) => ({ id })) ?? [],
          },
          projectId: input.projectId,
          deadline: input.deadline ? new Date(input.deadline) : null,
          priority: input.priority,
          estimatedHours: input.estimatedHours ?? 0,
          actualHours: input.actualHours ?? 0,
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
          assignees: {
            set: input.assigneeIds?.map((id) => ({ id })) ?? [],
          },
          actualHours: input.actualHours ?? 0,
          projectId: input.projectId,
          deadline: input.deadline ? new Date(input.deadline) : null,
          priority: input.priority,
          estimatedHours: input.estimatedHours ?? 0,
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
          assignees: true,
          deadline: true,
          priority: true,
          createdAt: true,
          actualHours: true,
          description: true,
          estimatedHours: true,
          project: {
            select: {
              id: true,
              title: true,
            },
          },
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

      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        assignees: true,

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
        description: true,
        id: true,
        title: true,
        status: true,
        assignees: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        priority: true,
        estimatedHours: true,
        deadline: true,
        createdAt: true,
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
  getTasksByStatus: protectedProcedure.query(async ({ ctx }) => {
    const taskCounts = await ctx.db.task.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const todoCount =
      taskCounts.find((count) => count.status === Status.TODO)?._count.status ??
      0;
    const inProgressCount =
      taskCounts.find((count) => count.status === Status.INPROGRESS)?._count
        .status ?? 0;
    const completedCount =
      taskCounts.find((count) => count.status === Status.COMPLETED)?._count
        .status ?? 0;

    return {
      status: 200,
      data: {
        todo: todoCount,
        inProgress: inProgressCount,
        completed: completedCount,
      },
    };
  }),
});

// export type GetAllCommentsByTaskIDReturnType = inferAsyncReturnType<
//   typeof tasksRouter.getAllCommentsByTaskID._def.type
// >;

// Remove unused test type
export type GetAllCommentsByTaskIDReturnType = Awaited<
  ReturnType<typeof tasksRouter.getAllCommentsByTaskID>
>;
export type GetTaskByIdReturnType = Awaited<
  ReturnType<typeof tasksRouter.getTaskById>
>;
