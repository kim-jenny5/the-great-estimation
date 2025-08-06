'use server';

import { prisma } from '@/prisma/client';
import { seed } from '@/prisma/seed';
import { revalidatePath } from 'next/cache';
import { CurrentUser, SerializedOrder, StatusOption } from './types';

export async function resetDatabase() {
	await prisma.lineItem.deleteMany({});
	await prisma.order.deleteMany({});
	await prisma.user.deleteMany({});

	await seed();

	revalidatePath('/');
}

// no real auth is to be implemented in this project
// this function just returns the first user in the DB as the "current" user
export async function getCurrentUser() {
	return await prisma.user.findFirstOrThrow();
}

export async function getOrderByIdOrFirst(user: CurrentUser, orderId?: string) {
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

export async function updateOrder(data: {
	id: string;
	name: string;
	status: string;
	deliverableDueAt: string;
	totalBudget: number;
}) {
	const { id, name, status, deliverableDueAt, totalBudget } = data;

	await prisma.order.update({
		where: { id },
		data: {
			name,
			status,
			totalBudget,
			deliverableDueAt: new Date(deliverableDueAt),
		},
	});

	revalidatePath('/');
}

export async function deleteLineItem(formData: FormData) {
	const id = formData.get('id') as string;
	if (!id) throw new Error('Missing/invalid line item');

	const lineItem = await prisma.lineItem.findUnique({ where: { id } });
	if (!lineItem?.orderId) throw new Error('Order not found');

	const orderId = lineItem.orderId;

	// delete the selected line item
	await prisma.lineItem.delete({ where: { id } });

	// recalculate total products/line items count
	const remainingLineItems = await prisma.lineItem.findMany({ where: { orderId } });

	const totalSpend = remainingLineItems.reduce((sum, item) => sum + item.subtotal.toNumber(), 0);
	const uniqueProducts = new Set(remainingLineItems.map((item) => item.productId));
	const productsCount = uniqueProducts.size;
	const lineItemsCount = remainingLineItems.length;

	await prisma.order.update({
		where: { id: orderId },
		data: {
			totalSpend,
			productsCount,
			lineItemsCount,
		},
	});

	revalidatePath('/');
}
