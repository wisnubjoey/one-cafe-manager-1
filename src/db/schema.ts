import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export * from "@/lib/auth-schema";
export * from "./absen";
export * from "./menu";
export * from "./purchase-invoice";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
