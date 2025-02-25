import z from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["BACKLOG", "TODO", "INPROGRESS", "COMPLETED"]),
  projectId: z.string().min(1, "Project is required"),
  assigneeIds: z.array(z.string()).optional(),
  deadline: z.string().refine((value) => !isNaN(Date.parse(value)), "Invalid date"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  estimatedHours: z.number().min(0, "Estimated hours must be positive"),
  actualHours: z.number().min(0, "Actual hours must be positive").optional(),
});

export const editTaskSchema = taskSchema.extend({
  id: z.string().min(1, "Task ID is required"),
});

export const updateStatusSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
  status: z.enum(["BACKLOG", "TODO", "INPROGRESS", "COMPLETED"]),
});

export const deleteTaskSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
});

export const addCommentSchema = z.object({
  text: z.string().min(1, "Comment text is required"),
  taskId: z.string().cuid(),
});

export const getCommentsByTaskIdSchema = z.string().cuid();

export type IDeleteTaskSchema = z.infer<typeof deleteTaskSchema>;
export type IUpdateStatusSchema = z.infer<typeof updateStatusSchema>;
export type IEditTaskSchema = z.infer<typeof editTaskSchema>;
export type ITaskSchema = z.infer<typeof taskSchema>;
