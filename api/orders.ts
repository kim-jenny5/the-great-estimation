import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { orders } from '../db/schema';

const db = drizzle(neon(process.env.DATABASE_URL!));

export async function GET() {
  try {
    const data = await db.select().from(orders);
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Failed to fetch ORDERS:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
