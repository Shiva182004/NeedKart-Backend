import z from "zod";

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(3).max(100).optional(),
    email: z.string().trim().toLowerCase().email().optional(),
    phone: z.string().regex(/^[0-9]{10}$/).optional(),
    profileImage: z.string().trim().url().nullable().optional(),
  })
  .strict()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Provide at least one field to update",
  });

export type UpdateUserType = z.infer<typeof updateUserSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(10, "Password must be at least 10 characters")
      .max(128, "Password must not exceed 128 characters")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/\d/, "Password must include a number"),
    confirmPassword: z.string(),
  })
  .strict()
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export type ChangePasswordType = z.infer<typeof changePasswordSchema>;
