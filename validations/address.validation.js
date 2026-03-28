import { z } from "zod";

export const addressValidation = z.object({
  phoneNumber: z
    .string()
    .min(7)
    .max(20)
    .regex(/^\+?[0-9\s\-]+$/, "Invalid phone number"),
  address: z.string().min(3).max(255),
  buildingName: z.string().min(1).max(255),
  roomNumber: z.string().min(1).max(255),
  city: z.string().min(2).max(100),
});
