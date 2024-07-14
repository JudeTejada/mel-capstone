import z from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["TODO", "INPROGRESS", "COMPLETED"]),
  userId: z.string().min(1, "Assigned user is required"),
  deadline: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), "Invalid date"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export const editTaskSchema = taskSchema.extend({
  id: z.string().min(1, "Task ID is required"), // Task ID is required for editing
});

export const updateStatusSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
  status: z.enum(["TODO", "INPROGRESS", "COMPLETED"]),
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

export type ItaskSchema = z.infer<typeof taskSchema>;
