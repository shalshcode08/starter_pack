import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = credentialsSchema.extend({
  name: z.string().trim().min(1, "Name is required").max(80),
});

export const studySetTitleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(100, "Title must be 100 characters or fewer");

export type CredentialsInput = z.infer<typeof credentialsSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
