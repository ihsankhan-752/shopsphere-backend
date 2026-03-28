import { z } from "zod";

export const categoryValidation = z.object({
  title: z.string(),
});
