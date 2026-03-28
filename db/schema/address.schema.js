import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema.js";

export const addressTable = pgTable("address", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),

  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  address: varchar({ length: 255 }).notNull(),
  buildingName: varchar("building_name", { length: 255 }).notNull(),
  roomNumber: varchar("room_number").notNull(),
  city: varchar({ length: 30 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
