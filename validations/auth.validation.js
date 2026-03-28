import { z } from "zod";

export const authSignUpValidation = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const authLoginValidation = z.object({
  email: z.string().email(),
  password: z.string(),
});
