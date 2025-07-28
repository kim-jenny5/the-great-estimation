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
  name: text('name').notNull(),
  creator: uuid('creator').references(() => users.id),
  status: text('status'),
  totalBudget: numeric('total_budget').notNull(),
  totalSpend: numeric('total_spend').default('0'),
  deliverableDueAt: date('deliverable_due_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const lineItems = pgTable('line_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id),
  product: text('product').notNull(),
  name: text('name').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  type: text('type').notNull(),
  rate: numeric('rate').notNull(),
  quantity: integer('quantity').notNull(),
  subtotal: numeric('subtotal').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
