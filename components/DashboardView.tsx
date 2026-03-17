'use client';

import { useState } from 'react';

import LineItemsChart from './LineItemsChart';
import StatGroup from './StatGroup';

type LineItem = {
	id: string;
	orderId: string;
	productId: string;
	name: string;
	startDate: string;
	endDate: string;
	rateType: string;
	rate: number;
	quantity: number;
	subtotal: number;
	product: { name: string };
};

type DashboardViewProps = {
	orderId: string;
	totalBudget: number;
	totalSpend: number;
	productsCount: number;
	lineItemsCount: number;
	lineItems: LineItem[];
};

export default function DashboardView({
	orderId,
	totalBudget,
	totalSpend,
	productsCount,
	lineItemsCount,
	lineItems,
}: DashboardViewProps) {
	const [discount, setDiscount] = useState(0);

	const simulatedSpend =
		discount > 0
			? lineItems.reduce((sum, item) => sum + item.rate * (1 - discount) * item.quantity, 0)
			: totalSpend;

	return (
		<>
			<StatGroup
				totalBudget={totalBudget}
				totalSpend={simulatedSpend}
				productsCount={productsCount}
				lineItemsCount={lineItemsCount}
				discount={discount}
			/>
			<LineItemsChart
				orderId={orderId}
				lineItems={lineItems}
				discount={discount}
				onDiscountChange={setDiscount}
			/>
		</>
	);
}
