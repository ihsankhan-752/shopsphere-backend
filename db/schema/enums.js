import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("role", ["user", "admin"]);

export const orderStatusEnum = pgEnum("status", [
  "pending",
  "processing",
  "shipped",
  "cancelled",
  "delivered",
]);
