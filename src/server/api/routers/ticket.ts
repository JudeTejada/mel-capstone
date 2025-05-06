import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  ticketSchema,
  ticketUpdateSchema,
  installationProgressSchema,
} from "~/lib/validations/ticket";

export const ticketRouter = createTRPCRouter({
  create: protectedProcedure
    .input(ticketSchema)
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.create({
        data: {
          ...input,
          userId: input.userId,
        },
      });

      if (input.type === "INSTALLATION") {
        await ctx.db.installationProgress.create({
          data: {
            ticketId: ticket.id,
          },
        });
      }

      return ticket;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: ticketUpdateSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.update({
        where: { id: input.id },
        data: {
          ...input.data,
          dateCompleted: input.data.status === "DONE" ? new Date() : undefined,
        },
      });

      return ticket;
    }),

  updateProgress: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        data: installationProgressSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const progress = await ctx.db.installationProgress.update({
        where: { ticketId: input.ticketId },
        data: input.data,
      });

      return progress;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.ticket.delete({
        where: { id: input },
      });

      return true;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.ticket.findMany({
      include: {
        assignedTo: true,
        installationProgress: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.ticket.findUnique({
        where: { id: input },
        include: {
          assignedTo: true,
          installationProgress: true,
        },
      });
    }),
});
