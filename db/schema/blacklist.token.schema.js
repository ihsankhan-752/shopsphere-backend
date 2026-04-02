import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const blackListTokenTable = pgTable("blacklist_token", {
  token: text("token").notNull(),
  createAt: timestamp("createdTime").defaultNow(),
});
