import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";

export const expenses = pgTable("expenses", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    date: timestamp("date").defaultNow().notNull(),
});