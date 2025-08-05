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
					lineItems: {
						include: {
							product: true,
						},
					},
				},
			},
		},
	});

	const selectedOrder =
		orderId == undefined
			? userWithOrders.orders[0]
			: userWithOrders.orders.find((order) => order.id === orderId);

	if (!selectedOrder) throw new Error('User has no orders.');

	const serializedOrder = {
		...selectedOrder,
		totalBudget: selectedOrder.totalBudget.toNumber(),
		totalSpend: selectedOrder.totalSpend.toNumber(),
		deliverableDueAt: selectedOrder.deliverableDueAt.toISOString(),
		createdAt: selectedOrder.createdAt.toISOString(),
		updatedAt: selectedOrder.updatedAt.toISOString(),
		lineItems: selectedOrder.lineItems.map((item) => ({
			...item,
			rate: item.rate.toNumber(),
			subtotal: item.subtotal.toNumber(),
			startDate: item.startDate.toISOString(),
			endDate: item.endDate?.toISOString() ?? null,
			createdAt: item.createdAt.toISOString(),
			updatedAt: item.updatedAt.toISOString(),
		})),
	};

	return serializedOrder;
}

// export async function updateOrders(orderId: string) {
// 	const lineItems = await prisma.lineItem.findMany({
// 		where: { orderId },
// 	});

// const totalSpend = lineItems.reduce((sum, item) => {
// 	return sum + item.subtotal.toNumber();
// }, 0);

// const uniqueProducts = new Set(lineItems.map((item) => item.productId));
// const productsCount = uniqueProducts.size;
// const lineItemsCount = lineItems.length;

// await prisma.order.update({
// 	where: { id: orderId },
// 	data: {
// 		totalSpend,
// 		productsCount,
// 		lineItemsCount,
// 	},
// });
// }
