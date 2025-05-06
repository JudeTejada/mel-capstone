import { z } from "zod";

export const ticketSchema = z.object({
  type: z.enum(["INSTALLATION", "RECTIFICATION"]),
  remarks: z.string().optional(),
  userId: z.string().optional(),
  activityType: z.string().max(100).optional(),
});

export const installationProgressSchema = z.object({
  poleExcavation: z.number().min(0).max(100),
  cableLaid: z.number().min(0).max(100),
  napLcpMounted: z.number().min(0).max(100),
  poleErected: z.number().min(0).max(100),
  cableFixed: z.number().min(0).max(100),
  napLcpSpliced: z.number().min(0).max(100),
});

export const ticketUpdateSchema = z.object({
  status: z.enum(["IN_PROGRESS", "DONE", "ON_HOLD"]).optional(),
  remarks: z.string().optional(),
  userId: z.string().optional(),
  activityType: z.string().max(100).optional(),
});

export type CreateTicketInput = z.infer<typeof ticketSchema>;
export type UpdateTicketInput = z.infer<typeof ticketUpdateSchema>;
export type InstallationProgressInput = z.infer<
  typeof installationProgressSchema
>;
