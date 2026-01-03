import { z } from "zod";

export const loginSchema = z.object({
  email_id: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export const registerSchema = z.object({
  full_name: z.string().min(1, "full name is required"),
  email_id: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
