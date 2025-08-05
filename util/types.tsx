export type SerializedOrder = {
	id: string;
	name: string;
	status: string | null;
	totalBudget: number;
	totalSpend: number;
	productsCount: number;
	lineItemsCount: number;
	deliverableDueAt: string;
	createdAt: string;
	updatedAt: string;
};
