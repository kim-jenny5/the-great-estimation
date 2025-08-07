import type { User } from '@prisma/client';

export type CurrentUser = User;

type SerializedProduct = {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
};

type SerializedLineItem = {
	id: string;
	name: string;
	rateType: string;
	rate: number;
	subtotal: number;
	quantity: number;
	startDate: string;
	endDate: string;
	orderId: string;
	productId: string;
	createdAt: string;
	updatedAt: string;
	product: SerializedProduct;
};

export type SerializedOrder = {
	id: string;
	name: string;
	status: string;
	totalBudget: number;
	totalSpend: number;
	productsCount: number;
	lineItemsCount: number;
	deliverableDueAt: string;
	createdAt: string;
	updatedAt: string;
	lineItems: SerializedLineItem[];
};

export const STATUSES = ['Pending', 'In progress', 'Completed', 'Lost'] as const;
// type StatusType = (typeof STATUSES)[number];
// export type StatusTypes = StatusType | null;

export const RATE_TYPES = ['Flat', 'CPM', 'CPC', 'CPA'] as const;
