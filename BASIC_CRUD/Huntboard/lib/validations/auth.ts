import { z } from "zod";

const email = z
  .email("Enter a valid email")
  .transform((value) => value.toLowerCase().trim());

// bcrypt only considers the first 72 bytes of a password.
const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters");

export const loginSchema = z.object({
  email,
  password,
});

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email,
  password,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
