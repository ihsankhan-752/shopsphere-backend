import { pgTable, uuid, integer } from "drizzle-orm/pg-core";
import { productsTable } from "./product.schema.js";
import { usersTable } from "./user.schema.js";

export const cartTable = pgTable("cart", {
  id: uuid().primaryKey().defaultRandom(),

  productId: uuid("product_id")
    .notNull()
    .references(() => productsTable.id),

  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),

  count: integer().notNull().default(1),
});
