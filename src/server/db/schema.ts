import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ecommerce-sa-espana_${name}`);

import { pgTable, text, decimal, timestamp, uuid, serial, integer } from "drizzle-orm/pg-core";

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }),
  image: text('image'),
});

export const zipCodes = pgTable("zip_codes", {
  id: serial("id").primaryKey(),
  province: text("province").notNull(),
  zone: integer("zone").notNull(),
  minimum: integer("minimum").notNull(),
  maximum: integer("maximum").notNull(),
});
