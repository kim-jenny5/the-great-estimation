/* eslint-disable drizzle/enforce-delete-with-where */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, orders, products, lineItems } from './schema';

config({ path: '.env.local', quiet: true });

const db = drizzle(process.env.DATABASE_URL!);

// Clean slate
await db.delete(lineItems);
await db.delete(orders);
await db.delete(users);
console.log('🩵 Database reset 🩵');

// Insert user
const [jenny] = await db
  .insert(users)
  .values({ name: 'Jenny Kim', email: 'jennykimdev@gmail.com' })
  .returning();

// Insert order
const [nikeOrder] = await db
  .insert(orders)
  .values({
    name: 'Nike – Back to School – Q3 2025',
    creator: jenny.id,
    status: 'In progress',
    totalBudget: 45_000,
    deliverableDueAt: new Date('2025-08-18'),
  })
  .returning();

// Insert products
const insertedProducts = await db
  .insert(products)
  .values([{ name: 'Newsletter' }, { name: 'Sponsored Article' }, { name: 'Display Ads' }])
  .returning();

const newsletter = insertedProducts.find((p) => p.name === 'Newsletter')!;
const sponsored = insertedProducts.find((p) => p.name === 'Sponsored Article')!;
const displayAd = insertedProducts.find((p) => p.name === 'Display Ads')!;

// Insert line items
const lineItemData = [
  {
    orderId: nikeOrder.id,
    productId: newsletter.id,
    name: 'Back to School',
    startDate: new Date('2025-08-01'),
    type: 'Flat',
    rate: 2500,
    quantity: 1,
    subtotal: 2500,
  },
  {
    orderId: nikeOrder.id,
    productId: newsletter.id,
    name: 'Labor Day',
    startDate: new Date('2025-08-18'),
    type: 'Flat',
    rate: 3000,
    quantity: 1,
    subtotal: 3000,
  },
  {
    orderId: nikeOrder.id,
    productId: sponsored.id,
    name: 'Fall Fashion Feature',
    startDate: new Date('2025-08-25'),
    endDate: new Date('2025-11-14'),
    type: 'Flat',
    rate: 4000,
    quantity: 1,
    subtotal: 4000,
  },
  {
    orderId: nikeOrder.id,
    productId: displayAd.id,
    name: 'Homepage Takeover',
    startDate: new Date('2025-08-15'),
    endDate: new Date('2025-08-17'),
    type: 'Flat',
    rate: 5000,
    quantity: 1,
    subtotal: 5000,
  },
  {
    orderId: nikeOrder.id,
    productId: displayAd.id,
    name: 'Sidebar Ad',
    startDate: new Date('2025-08-20'),
    endDate: new Date('2025-08-31'),
    type: 'CPM',
    rate: 1500,
    quantity: 2,
    subtotal: 3000,
  },
];

await db.insert(lineItems).values(lineItemData).returning();

console.log('🌱 Seed complete 🌱');
