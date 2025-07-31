import { pgTable, uuid, text, numeric, integer, timestamp, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  creator: uuid('creator').references(() => users.id),
  status: text('status'),
  totalBudget: numeric('total_budget').notNull().$type<number>(),
  totalSpend: numeric('total_spend').default('0').$type<number>(),
  deliverableDueAt: date('deliverable_due_at').notNull().$type<Date>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const lineItems = pgTable('line_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id),
  productId: uuid('product_id').references(() => products.id),
  name: text('name').notNull(),
  startDate: date('start_date').notNull().$type<Date>(),
  endDate: date('end_date').$type<Date>(),
  type: text('type').notNull(),
  rate: numeric('rate').notNull().$type<number>(),
  quantity: integer('quantity').notNull(),
  subtotal: numeric('subtotal').notNull().$type<number>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({ orders: many(orders) }));

export const ordersRelations = relations(orders, ({ many, one }) => ({
  creator: one(users, { fields: [orders.creator], references: [users.id] }),
  lineItems: many(lineItems),
}));

export const productsRelations = relations(products, ({ many }) => ({
  lineItems: many(lineItems),
}));

export const lineItemsRelations = relations(lineItems, ({ one }) => ({
  order: one(orders, { fields: [lineItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [lineItems.productId], references: [products.id] }),
}));

// Type definition
export type SelectUser = typeof users.$inferSelect;
export type SelectOrder = typeof orders.$inferSelect;
export type SelectLineItem = typeof lineItems.$inferSelect;
export type SelectProduct = typeof products.$inferSelect;
