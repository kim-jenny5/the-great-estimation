/* eslint-disable drizzle/enforce-delete-with-where */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, orders, lineItems } from './schema';

config({ path: '.env.local', quiet: true });

const db = drizzle(process.env.DATABASE_URL!);

// Clean slate
await db.delete(lineItems);
await db.delete(orders);
await db.delete(users);
console.log('🩵 Database reset 🩵');

console.log('Seeding data');
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

// Insert order line items
await db.insert(lineItems).values([
  {
    orderId: nikeOrder.id,
    product: 'Newsletter',
    name: 'Back to School',
    startDate: new Date('2025-08-01'),
    type: 'Flat',
    rate: 2500,
    quantity: 1,
    subtotal: 2500,
  },
  {
    orderId: nikeOrder.id,
    product: 'Newsletter',
    name: 'Labor Day',
    startDate: new Date('2025-08-18'),
    type: 'Flat',
    rate: 3000,
    quantity: 1,
    subtotal: 3000,
  },
]);

console.log('🌱 Seed complete 🌱');
