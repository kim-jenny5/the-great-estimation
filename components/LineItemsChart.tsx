'use client';

import React, { useState, useEffect } from 'react';

import { formatCurrency, formatStartEndDates } from '@/util/formatters';

import CreateLineItemForm from './forms/CreateLineItemForm';
import DeleteLineItemForm from './forms/DeleteLineItemForm';
import EditLineItemForm from './forms/UpdateLineItemForm';

import { getAllProducts } from '@/util/queries';

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
	product: {
		name: string;
	};
};

type LineItemsChartProps = {
	orderId: string;
	lineItems: LineItem[];
};

export default function LineItemsChart({ orderId, lineItems }: LineItemsChartProps) {
	const grouped: { product: string; items: LineItem[]; total: number }[] = [];

	for (const item of lineItems) {
		const group = grouped.find((g) => g.product === item.product.name);

		if (group) {
			group.items.push(item);
			group.total += item.subtotal;
		} else {
			grouped.push({
				product: item.product.name,
				items: [item],
				total: item.subtotal,
			});
		}
	}

	const [products, setProducts] = useState<{ id: string; name: string }[]>([]);

	useEffect(() => {
		async function fetchProducts() {
			const data = await getAllProducts();
			setProducts(data);
		}
		fetchProducts();
	}, []);

	const grandTotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);

	return (
		<>
			<div className='flex justify-end'>
				<CreateLineItemForm orderId={orderId} products={products} />
			</div>
			<div className='card'>
				<table className='min-w-full divide-y divide-neutral-300 text-sm text-neutral-800'>
					<thead className='bg-neutral-100 text-neutral-500 uppercase'>
						<tr>
							<th className='py-3 pr-4 pl-6 text-left font-normal'>Description</th>
							<th className='px-4 py-3 text-left font-normal'>Start/End Dates</th>
							<th className='px-4 py-3 text-left font-normal'>Rate Type</th>
							<th className='px-4 py-3 text-left font-normal'>Rate</th>
							<th className='px-4 py-3 text-left font-normal'>Qty</th>
							<th className='px-4 py-3 text-right font-normal'>Total</th>
							<th className='py-3 pr-6 pl-4 text-right font-normal'></th>
						</tr>
					</thead>
					<tbody className='divide-y divide-neutral-100 bg-white'>
						{grouped.map((group) => (
							<React.Fragment key={group.product}>
								<tr className='bg-neutral-100'>
									<td colSpan={7} className='px-6 py-2 font-medium text-neutral-800'>
										{group.product}
									</td>
								</tr>
								{group.items.map((item) => (
									<tr key={item.id}>
										<td className='py-2.5 pr-4 pl-8'>
											<div className='flex items-center gap-2'>
												<div className='h-6 w-1 rounded-full bg-neutral-300' />
												<span className='text-neutral-800'>{item.name}</span>
											</div>
										</td>
										<td
											aria-label={formatStartEndDates(item.startDate, item.endDate, {
												forAccessibility: true,
											})}
											className='px-4 py-2.5'
										>
											{formatStartEndDates(item.startDate, item.endDate)}
										</td>
										<td className='px-4 py-2.5'>{item.rateType}</td>
										<td className='px-4 py-2.5 text-left'>{formatCurrency(item.rate)}</td>
										<td className='px-4 py-2.5 text-left'>{item.quantity}</td>
										<td className='px-4 py-2.5 text-right font-medium'>
											{formatCurrency(item.rate * item.quantity)}
										</td>
										<td>
											<div className='flex items-center justify-end gap-x-4 px-4 py-2.5'>
												<EditLineItemForm lineItem={item} products={products} />
												<DeleteLineItemForm lineItemId={item.id} />
											</div>
										</td>
									</tr>
								))}
								<tr className='border-b-neutral-200 bg-neutral-50'>
									<td colSpan={5} className='p-4 text-right font-semibold text-neutral-600'>
										{group.product} Total
									</td>
									<td className='p-4 text-right font-semibold'>{formatCurrency(group.total)}</td>
									<td colSpan={1}></td>
								</tr>
							</React.Fragment>
						))}
					</tbody>
					<tfoot>
						<tr className='border-y border-neutral-300'>
							<td colSpan={7} className='h-5' />
						</tr>
						<tr>
							<td colSpan={5} className='p-4 text-right font-semibold uppercase'>
								Total
							</td>
							<td className='p-4 text-right font-bold'>{formatCurrency(grandTotal)}</td>
							<td colSpan={1}></td>
						</tr>
					</tfoot>
				</table>
			</div>
		</>
	);
}
