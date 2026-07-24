import z from "zod";

export const signupUserSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  password: z.string().min(10),
});

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string(),
});
