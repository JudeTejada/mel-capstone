import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const projectsRouter = createTRPCRouter({
  getAllProjects: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({});

    return {
      status: 200,
      result: projects,
    };
  }),
  getProjectsWithTaskCount: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      where: {
        id: {
          not: ctx.session.user.id,
        },
      },
      select: {
        id: true,
        title: true,
        ownerId: true,
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
    return {
      status: 200,
      result: projects,
    };
  }),
  getProjectById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input },
        include: {
          tasks: {
            select: {
              id: true,
              title: true,
              status: true,
              deadline: true,
              assignees: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        } as const); // Use 'as const' to make the type more specific
      }

      return {
        status: 200,
        result: project,
      };
    }),

  createProject: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string(),
        status: z
          .enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED"])
          .default("ACTIVE"),
        startDate: z.date(),
        endDate: z.date(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
        budget: z.number().optional(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const project = await ctx.db.project.create({
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          startDate: input.startDate,
          endDate: input.endDate,
          priority: input.priority,
          budget: input.budget,
          tags: input.tags,
          owner: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return {
        status: 201,
        message: "Project created successfully",
        result: project,
      };
    }),

  updateProject: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Title is required"),
        description: z.string(),
        status: z.enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED"]),
        startDate: z.date(),
        endDate: z.date(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
        budget: z.number().optional(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const project = await ctx.db.project.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          startDate: input.startDate,
          endDate: input.endDate,
          priority: input.priority,
          budget: input.budget,
          tags: input.tags,
        },
      });

      return {
        status: 200,
        message: "Project updated successfully",
        result: project,
      };
    }),

  deleteProject: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await ctx.db.project.delete({
        where: { id: input },
      });

      return {
        status: 200,
        message: "Project deleted successfully",
      };
    }),
});
