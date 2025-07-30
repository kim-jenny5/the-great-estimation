import { db } from '../client';
import { users, orders, lineItems, products } from '../schema';
import { SelectUser, SelectOrder, SelectLineItem, SelectProduct } from '../schema';

// Users
export async function getUsers(): Promise<SelectUser[]> {
  return db.select().from(users);
}

export async function getUsersWithOrders(): Promise<SelectUser[]> {
  return db.query.users.findMany({ with: { orders: true } });
}

export async function getUsersWithOrdersAndLineItems(): Promise<SelectUser[]> {
  return db.query.users.findMany({ with: { orders: { with: { lineItems: true } } } });
}

// Orders
export async function getOrders(): Promise<SelectOrder[]> {
  return db.select().from(orders);
}

// Line Items
export async function getLineItems(): Promise<SelectLineItem[]> {
  return db.select().from(lineItems);
}

// Products
export async function getProducts(): Promise<SelectProduct[]> {
  return db.select().from(products);
}
