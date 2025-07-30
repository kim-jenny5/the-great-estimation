import { getLineItems } from '@/db/queries/select';

export async function GET() {
  try {
    const data = await getLineItems();
    return Response.json(data);
  } catch (err) {
    console.error('Failed to fetch LINE ITEMS:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
