import { db } from '../client';
import { users, orders, lineItems } from '../schema';
import { SelectUser, SelectOrder, SelectLineItems } from '../schema';

// Fetch all users
export async function getUsers(): Promise<SelectUser[]> {
  return db.select().from(users);
}

// Fetch all orders
export async function getOrders(): Promise<SelectOrder[]> {
  return db.select().from(orders);
}

// Fetch all line items
export async function getLineItems(): Promise<SelectLineItems[]> {
  return db.select().from(lineItems);
}
