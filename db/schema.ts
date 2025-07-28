import { pgTable, uuid, text, numeric, integer, timestamp, date } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  creator: uuid('creator').references(() => users.id),
  status: text('status'),
  totalBudget: numeric('total_budget'),
  totalSpend: numeric('total_spend'),
  deliverableDueAt: date('deliverable_due_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const lineItems = pgTable('line_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id),
  product: text('product'),
  description: text('description'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  type: text('type'),
  rate: numeric('rate'),
  quantity: integer('quantity'),
  subtotal: numeric('subtotal'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
