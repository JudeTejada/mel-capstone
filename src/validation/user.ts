import { z } from "zod";





export const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  emailVerified: z.union([z.date(), z.null()]),
  firstName: z.string().min(1, "First name is required"),
  id: z.string().min(1, "User ID is required"),
  image: z.union([z.string().url("Invalid URL"), z.null()]),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["USER", "ADMIN"]), // Adjust roles as needed
});


export type IUserSchema = z.infer<typeof userSchema>;
