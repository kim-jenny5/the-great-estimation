import { getUsers } from '@/db/queries/select';

export async function GET() {
  try {
    const data = await getUsers();
    return Response.json(data);
  } catch (err) {
    console.error('Failed to fetch USERS:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
