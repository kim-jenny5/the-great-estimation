import { prisma } from '@/prisma/client';

// no real auth is to be implemented in this project
// this function just returns the first user in the DB as the "current" user
export async function getCurrentUser() {
	return await prisma.user.findFirstOrThrow();
}

export async function getOrderByIdOrFirst(orderId?: string) {
	const user = await getCurrentUser();
	const userWithOrders = await prisma.user.findUniqueOrThrow({
		where: { id: user.id },
		include: {
			orders: {
				include: {
					lineItems: true,
				},
			},
		},
	});

	const selectedOrder =
		orderId != null
			? userWithOrders.orders.find((order) => order.id === orderId)
			: userWithOrders.orders[0];

	if (!selectedOrder) throw new Error('User has no orders.');

	return selectedOrder;
}

// export async function updateOrders(orderId: string) {
// 	const lineItems = await prisma.lineItem.findMany({
// 		where: { orderId },
// 	});

// const totalSpend = lineItems.reduce((sum, item) => {
// 	return sum + item.subtotal.toNumber();
// }, 0);

// const uniqueProducts = new Set(lineItems.map((item) => item.productId));
// const totalProducts = uniqueProducts.size;
// const totalLineItems = lineItems.length;

// await prisma.order.update({
// 	where: { id: orderId },
// 	data: {
// 		totalSpend,
// 		totalProducts,
// 		totalLineItems,
// 	},
// });
// }
