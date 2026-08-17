import { z } from "zod";

const serviceFields = {
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(2_000),
  price: z.coerce.number().int().positive().max(10_000_000),
  categoryId: z.string().uuid("Invalid category ID"),
  image: z.string().trim().url("Image must be a valid URL"),
};

export const createServiceSchema = z.object(serviceFields).strict();

export const updateServiceSchema = createServiceSchema
  .partial()
  .strict()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Provide at least one field to update",
  });

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
