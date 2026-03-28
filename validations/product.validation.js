import { z } from "zod";

export const productValidation = z.object({
  title: z.string().min(3),
  description: z.string().min(6).max(150),
  price: z.string().transform((val) => parseFloat(val)),
  stock: z.string().transform((val) => parseInt(val)),

  categoryId: z.string().uuid(),
});
