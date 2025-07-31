import { getOrders } from '@/db/queries/select';

export async function GET() {
  try {
    const data = await getOrders();
    return Response.json(data);
  } catch (error) {
    console.error('Failed to fetch ORDERS:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
