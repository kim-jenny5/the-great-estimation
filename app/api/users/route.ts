import { prisma } from '@/prisma/client';

export async function GET() {
	try {
		// const users = await prisma.users.findMany({
		//   include: { orders: { include: { line_items: true } } },
		// });
		const jenny = await prisma.user.findFirstOrThrow({
			include: { orders: { include: { lineItems: true } } },
		});

		return Response.json(jenny);
	} catch (error) {
		console.error(`Failed to fetch USERS:`, error);
		return new Response(`Internal Server Error`, { status: 500 });
	}
}
