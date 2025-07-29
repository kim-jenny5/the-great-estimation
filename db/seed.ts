import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { users, orders, lineItems } from './schema';
// import { faker } from '@faker-js/faker';

const client = new Client({ connectionString: process.env.DATABASE_URL });
const db = drizzle(client);

export default async function seed() {
  await client.connect();

  await db.delete(lineItems);
  await db.delete(orders);
  await db.delete(users);

  const [jenny] = await db
    .insert(users)
    .values({ name: 'Jenny Kim', email: 'jennykimdev@gmail.com' })
    .returning();

  const [nikeOrder] = await db
    .insert(orders)
    .values({
      name: 'Nike – Back to School – Q3 2025',
      creator: jenny.id,
      status: 'In progress',
      totalBudget: 45000,
      deliverableDueAt: new Date('2025-08-18'),
    })
    .returning();

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

  // FAKE DATA
  // for (let i = 0; i < 3; i++) {
  //   const [user] = await db
  //     .insert(users)
  //     .values({ name: faker.person.fullName(), email: faker.internet.email() })
  //     .returning();

  //   const [fakeOrder] = await db
  //     .insert(orders)
  //     .values({
  //       name: faker.commerce.productName() + ' Campaign',
  //       creatorId: user.id,
  //       status: faker.helpers.arrayElement(['In progress', 'Paused', 'Completed']),
  //       totalBudget: faker.number.float({ min: 10000, max: 75000 }),
  //       deliverableDueAt: faker.date.future(),
  //     })
  //     .returning();

  //   const itemCount = faker.number.int({ min: 1, max: 3 });
  //   const items = Array.from({ length: itemCount }).map(() => {
  //     const quantity = faker.number.int({ min: 1, max: 3 });
  //     const rate = faker.number.float({ min: 1000, max: 5000, precision: 0.01 });
  //     return {
  //       orderId: fakeOrder.id,
  //       product: faker.helpers.arrayElement(['Newsletter', 'Sponsored Article', 'Display Ads']),
  //       name: faker.company.catchPhrase(),
  //       startDate: faker.date.recent(),
  //       endDate: faker.date.future(),
  //       type: faker.helpers.arrayElement(['Flat', 'CPM']),
  //       rate,
  //       quantity,
  //       subtotal: rate * quantity,
  //     };
  //   });

  //   await db.insert(lineItems).values(items);
  // }

  console.log('🌱 Seed complete');
  await client.end();
}
