'use client';

import React from 'react';
import { formatCurrency, formatStartEndDates } from '@/util/formatters';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import DrawerWrapper from './DrawerWrapper';
import AlertWrapper from './AlertWrapper';

type LineItem = {
	id: string;
	name: string;
	startDate: Date;
	endDate?: Date | null;
	type: string;
	rate: number;
	quantity: number;
	subtotal: number;
	product: {
		name: string;
	};
};

type LineItemsChartProps = {
	lineItems: LineItem[];
};

export default function LineItemsChart({ lineItems }: LineItemsChartProps) {
	const groupedLineItems: Record<string, LineItem[]> = {};

	for (const item of lineItems) {
		const groupKey = item.product.name;
		if (!groupedLineItems[groupKey]) {
			groupedLineItems[groupKey] = [];
		}
		groupedLineItems[groupKey].push(item);
	}

	const grouped = Object.entries(groupedLineItems).map(([product, items]) => ({ product, items }));
	const grandTotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);

	return (
		<div className='card'>
			<table className='min-w-full divide-y divide-neutral-300 text-sm text-neutral-800'>
				<thead className='bg-neutral-100 text-neutral-500 uppercase'>
					<tr>
						<th className='py-3 pr-4 pl-6 text-left font-normal'>Description</th>
						<th className='px-4 py-3 text-left font-normal'>Start/End Dates</th>
						<th className='px-4 py-3 text-left font-normal'>Type</th>
						<th className='px-4 py-3 text-right font-normal'>Rate</th>
						<th className='px-4 py-3 text-right font-normal'>Qty</th>
						<th className='px-4 py-3 text-right font-normal'>Total</th>
						<th className='py-3 pr-6 pl-4 text-right font-normal'></th>
					</tr>
				</thead>
				<tbody className='divide-y divide-neutral-100 bg-white'>
					{grouped.map((group) => {
						const groupTotal = group.items.reduce((sum, item) => sum + item.subtotal, 0);

						return (
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
											aria-label={formatStartEndDates(item.startDate, item.endDate ?? undefined, {
												forAccessibility: true,
											})}
											className='px-4 py-2.5'
										>
											{formatStartEndDates(item.startDate, item.endDate ?? undefined)}
										</td>
										<td className='px-4 py-2.5'>{item.type}</td>
										<td className='px-4 py-2.5 text-right'>{formatCurrency(item.rate)}</td>
										<td className='px-4 py-2.5 text-right'>{item.quantity}</td>
										<td className='px-4 py-2.5 text-right font-medium'>
											{formatCurrency(item.rate)}
										</td>
										<td>
											<div className='flex items-center justify-end gap-x-4 px-4 py-2.5'>
												<DrawerWrapper
													title='Edit line item'
													description='Edit line item details below and click save when done.'
												>
													<button className='cursor-pointer rounded-full p-2 transition hover:scale-110 hover:bg-neutral-100 hover:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300'>
														<PencilIcon className='h-4.5 w-4.5' />
													</button>
												</DrawerWrapper>
												<AlertWrapper>
													<button className='cursor-pointer rounded-full p-2 transition hover:scale-110 hover:bg-neutral-100 hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300'>
														<TrashIcon className='h-4.5 w-4.5' />
													</button>
												</AlertWrapper>
											</div>
										</td>
									</tr>
								))}
								<tr className='border-b-neutral-200 bg-neutral-50'>
									<td colSpan={5} className='p-4 text-right font-semibold text-neutral-600'>
										{group.product} Total
									</td>
									<td className='p-4 text-right font-semibold'>{formatCurrency(groupTotal)}</td>
									<td colSpan={1}></td>
								</tr>
							</React.Fragment>
						);
					})}
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
	);
}
