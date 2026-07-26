import z from "zod";

const passwordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(128, "Password must not exceed 128 characters")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/\d/, "Password must include a number");

export const signupUserSchema = z
  .object({
    name: z.string().trim().min(3).max(100),
    email: z.string().trim().toLowerCase().email(),
    phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    password: passwordSchema,
  })
  .strict();

export const loginUserSchema = z
  .object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1),
  })
  .strict();

export type SignupUserInput = z.infer<typeof signupUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
