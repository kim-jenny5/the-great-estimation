import { prisma } from '@/prisma/client';

export async function getOrderByIdOrFirst(orderId?: string) {
	// for now, fetch the one and only user
	const user = await prisma.user.findFirstOrThrow({
		include: {
			orders: {
				include: {
					lineItems: true,
				},
			},
		},
	});

	const selectedOrder =
		orderId != null ? user.orders.find((order) => order.id === orderId) : user.orders[0];

	if (!selectedOrder) throw new Error('User has no orders.');

	return selectedOrder;
}
