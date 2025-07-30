import { getUsers, getUsersWithOrders, getUsersWithOrdersAndLineItems } from '@/db/queries/select';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const include = url.searchParams.get('include');

  try {
    let data;

    switch (include) {
      case 'orders': {
        data = await getUsersWithOrders();
        break;
      }
      case 'orders,lineItems':
      case 'orders,lineitems': { // allow lowercase
        data = await getUsersWithOrdersAndLineItems();
        break;
      }
      default: {
        data = await getUsers();
      }
    }

    return Response.json(data);
  } catch (error) {
    console.error('Failed to fetch USERS:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
