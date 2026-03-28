import {
  uuid,
  pgTable,
  numeric,
  timestamp,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema.js";
import { orderStatusEnum } from "./enums.js";
import { addressTable } from "./address.schema.js";
import { productsTable } from "./product.schema.js";

export const ordersTable = pgTable("orders", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),

  addressId: uuid("address_id")
    .notNull()
    .references(() => addressTable.id),

  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),

  orderStatus: orderStatusEnum("status").notNull().default("pending"),

  paymentMethod: varchar("payment_method", { length: 55 }).notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// -------- I Create this to Store Product Information ------------//

export const orderItemTable = pgTable("order_item", {
  id: uuid().primaryKey().defaultRandom(),

  orderId: uuid("order_id")
    .notNull()
    .references(() => ordersTable.id),

  productId: uuid("product_id")
    .notNull()
    .references(() => productsTable.id),

  perProductQuantity: integer("per_product_quantity").notNull(),

  perProductPrice: numeric("per_product_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
});
