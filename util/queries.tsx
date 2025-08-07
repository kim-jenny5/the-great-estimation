'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/prisma/client';
import { seed } from '@/prisma/seed';

import { convertToUTC } from './formatters';
import { CurrentUser, SerializedOrder } from './types';

export async function resetDatabase() {
	await prisma.lineItem.deleteMany({});
	await prisma.product.deleteMany({});
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
		status: selectedOrder.status,
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
			deliverableDueAt: convertToUTC(deliverableDueAt),
		},
	});

	revalidatePath('/');
}

// async function updateOrderTotals(orderId: string) {
// 	const lineItems = await prisma.lineItem.findMany({ where: { orderId } });

// 	const totalSpend = lineItems.reduce((sum, item) => sum + item.subtotal.toNumber(), 0);
// 	const uniqueProducts = new Set(lineItems.map((item) => item.productId));
// 	const productsCount = uniqueProducts.size;
// 	const lineItemsCount = lineItems.length;

// 	await prisma.order.update({
// 		where: { id: orderId },
// 		data: {
// 			totalSpend,
// 			productsCount,
// 			lineItemsCount,
// 		},
// 	});
// }

export async function getAllProducts() {
	return await prisma.product.findMany({
		select: {
			id: true,
			name: true,
		},
	});
}

export async function createLineItem(data: {
	orderId: string;
	productId: string;
	name: string;
	startDate: string;
	endDate: string | null;
	rateType: string;
	rate: number;
	quantity: number;
}) {
	const { orderId, productId, name, startDate, endDate, rateType, rate, quantity } = data;

	const subtotal = rate * quantity;

	await prisma.lineItem.create({
		data: {
			orderId,
			productId,
			name,
			startDate: convertToUTC(startDate),
			endDate: endDate ? convertToUTC(endDate) : null,
			rateType,
			rate,
			quantity,
			subtotal,
		},
	});

	// Optionally recalculate totals for the order
	const lineItems = await prisma.lineItem.findMany({ where: { orderId } });
	const totalSpend = lineItems.reduce((sum, item) => sum + item.subtotal.toNumber(), 0);
	const uniqueProducts = new Set(lineItems.map((item) => item.productId));
	const productsCount = uniqueProducts.size;
	const lineItemsCount = lineItems.length;

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
