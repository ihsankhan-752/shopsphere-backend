import { uuid, text, pgTable } from "drizzle-orm/pg-core";

export const bannerTable = pgTable("banners", {
  id: uuid().primaryKey().defaultRandom(),
  image: text().notNull(),
});
