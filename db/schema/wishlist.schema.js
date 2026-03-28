import { uuid, pgTable } from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema.js";
import { productsTable } from "./product.schema.js";

export const wishlistTable = pgTable("wishlist", {
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),

  productId: uuid("product_id")
    .notNull()
    .references(() => productsTable.id),
});
