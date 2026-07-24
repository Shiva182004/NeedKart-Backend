import z from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.email().optional(),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/)
    .optional(),
  profileImage: z.string().optional(),
});

export type UpdateUserType = z.infer<typeof updateUserSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(10),
    newPassword: z.string().min(10),
    confirmPassword: z.string().min(10),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export type ChangePasswordType = z.infer<typeof changePasswordSchema>;
