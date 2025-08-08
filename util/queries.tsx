'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
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
			endDate: item.endDate?.toISOString() ?? '',
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

export async function getAllProducts() {
	return await prisma.product.findMany({
		select: {
			id: true,
			name: true,
		},
	});
}

async function recalculateOrder(
	orderId: string,
	db: PrismaClient | Prisma.TransactionClient = prisma
) {
	const lineItems = await db.lineItem.findMany({
		where: { orderId },
		select: { productId: true, subtotal: true },
	});

	const totalSpend = lineItems.reduce((sum, li) => sum + li.subtotal.toNumber(), 0);
	const productsCount = new Set(lineItems.map((li) => li.productId)).size;
	const lineItemsCount = lineItems.length;

	await db.order.update({
		where: { id: orderId },
		data: { totalSpend, productsCount, lineItemsCount },
	});
}

export async function createLineItem(data: {
	orderId: string;
	productId: string;
	name: string;
	startDate: string;
	endDate?: string;
	rateType: string;
	rate: number;
	quantity: number;
}) {
	const { orderId, productId, name, startDate, endDate, rateType, rate, quantity } = data;

	const subtotal = rate * quantity;

	await prisma.$transaction(async (tx) => {
		await tx.lineItem.create({
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

		await recalculateOrder(orderId, tx);
	});

	revalidatePath('/');
}

export async function updateLineItem(params: {
	id: string;
	productId: string;
	name: string;
	startDate: string;
	endDate?: string;
	rateType: string;
	rate: number;
	quantity: number;
}) {
	const { id, productId, name, startDate, endDate, rateType, rate, quantity } = params;
	const subtotal = rate * quantity;

	await prisma.$transaction(async (tx) => {
		const existing = await tx.lineItem.findUnique({
			where: { id },
			select: { orderId: true },
		});
		if (!existing?.orderId) throw new Error('Order not found for line item');

		await tx.lineItem.update({
			where: { id },
			data: {
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

		await recalculateOrder(existing.orderId, tx);
	});

	revalidatePath('/');
}

export async function deleteLineItem(formData: FormData) {
	const id = formData.get('id') as string;
	if (!id) throw new Error('Missing/invalid line item');

	await prisma.$transaction(async (tx) => {
		const li = await tx.lineItem.findUnique({
			where: { id },
			select: { orderId: true },
		});
		if (!li?.orderId) throw new Error('Order not found');

		await tx.lineItem.delete({ where: { id } });
		await recalculateOrder(li.orderId, tx);
	});

	revalidatePath('/');
}
