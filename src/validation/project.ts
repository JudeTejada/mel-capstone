import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  status: z.enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED"]).default("ACTIVE"),
  startDate: z.date(),
  endDate: z.date(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  budget: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

export const editProjectSchema = projectSchema.extend({
  id: z.string(),
});

export type IProjectSchema = z.infer<typeof projectSchema>;
export type IEditProjectSchema = z.infer<typeof editProjectSchema>;