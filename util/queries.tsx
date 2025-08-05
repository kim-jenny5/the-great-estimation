import { prisma } from '@/prisma/client';
import { SerializedOrder, StatusOption } from './types';

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

	const serializedOrder: SerializedOrder = {
		...selectedOrder,
		status: selectedOrder.status as StatusOption,
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
			product: {
				...item.product,
				createdAt: item.product.createdAt.toISOString(),
				updatedAt: item.product.updatedAt.toISOString(),
			},
		})),
	};

	return serializedOrder;
}

export async function deleteLineItem(lineItemId: string) {
	try {
		const res = await fetch(`/api/line-items/${lineItemId}`, {
			method: 'DELETE',
		});

		if (!res.ok) throw new Error('Failed to delete line item');

		return await res.json();
	} catch (error) {
		console.error('Error deleting line item:', error);
		throw error;
	}
}
