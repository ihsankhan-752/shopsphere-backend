import { varchar, uuid, pgTable } from "drizzle-orm/pg-core";

export const categoriesTable = pgTable("categories", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 155 }).notNull(),
});
