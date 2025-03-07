import { z } from "zod";

export const adminUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  position: z.string().min(1, "Position is required"),
  role: z.enum(["USER", "ADMIN"], {
    required_error: "Role is required",
    invalid_type_error: "Role must be either USER or ADMIN",
  }),
});

export type IAdminUserSchema = z.infer<typeof adminUserSchema>;