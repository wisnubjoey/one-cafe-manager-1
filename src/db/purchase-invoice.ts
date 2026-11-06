import {
  date,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const purchaseInvoiceTable = pgTable("tb_purchaseinvoice", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceDate: date("invoice_date").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
