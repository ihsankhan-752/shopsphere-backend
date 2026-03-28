import {
  varchar,
  text,
  uuid,
  pgTable,
  numeric,
  integer,
} from "drizzle-orm/pg-core";
import { categoriesTable } from "./categories.schema.js";

export const productsTable = pgTable("products", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer().notNull(),
  image: text().notNull(),
  categoryId: uuid("category_id")
    .references(() => categoriesTable.id)
    .notNull(),
});
