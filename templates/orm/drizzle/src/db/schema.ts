import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

/**
 * Users table definition
 * This defines the structure for the users table in PostgreSQL
 */
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Type inference helpers
 * Use these types throughout your app for type safety
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
