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
	type: string;
	rate: number;
	subtotal: number;
	quantity: number;
	startDate: string;
	endDate: string | null;
	orderId: string | null;
	productId: string | null;
	createdAt: string;
	updatedAt: string;
	product: SerializedProduct;
};

export type SerializedOrder = {
	id: string;
	name: string;
	status: 'In progress' | 'Completed' | 'Lost' | null;
	totalBudget: number;
	totalSpend: number;
	productsCount: number;
	lineItemsCount: number;
	deliverableDueAt: string;
	createdAt: string;
	updatedAt: string;
	lineItems: SerializedLineItem[];
};

export type StatusValue = 'In progress' | 'Completed' | 'Lost';
export type StatusOption = StatusValue | null;
