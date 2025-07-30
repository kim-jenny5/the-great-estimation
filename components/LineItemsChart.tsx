import React from 'react';
import { formatCurrency, formatStartEndDates } from '../util/formatters';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

type GroupedLineItems = { product: string; items: LineItem[] };

type LineItem = {
	id: string;
	description: string;
	startDate: Date;
	endDate?: Date;
	type: 'Flat' | 'CPM' | 'CPC';
	rate: number;
	quantity: number;
	unit?: string;
	subtotal: number;
};

const GROUPED_LINE_ITEMS: GroupedLineItems[] = [
	{
		product: 'Newsletter',
		items: [
			{
				id: '1',
				description: 'Back to School',
				startDate: new Date('August 1, 2025'),
				type: 'Flat',
				rate: 2500,
				quantity: 1,
				subtotal: 2500,
			},
			{
				id: '2',
				description: 'Labor Day',
				startDate: new Date('August 18, 2025'),
				type: 'Flat',
				rate: 3000,
				quantity: 1,
				subtotal: 3000,
			},
		],
	},
	{
		product: 'Sponsored Article',
		items: [
			{
				id: '3',
				description: 'Fall Fashion Feature',
				startDate: new Date('August 25, 2025'),
				endDate: new Date('November 14, 2025'),
				type: 'Flat',
				rate: 4000,
				quantity: 1,
				subtotal: 4000,
			},
		],
	},
	{
		product: 'Display Ads',
		items: [
			{
				id: '4',
				description: 'Homepage Takeover',
				startDate: new Date('August 15, 2025'),
				endDate: new Date('August 17, 2025'),
				type: 'Flat',
				rate: 5000,
				quantity: 1,
				subtotal: 5000,
			},
			{
				id: '5',
				description: 'Sidebar Ad',
				startDate: new Date('August 20, 2025'),
				endDate: new Date('August 31, 2025'),
				type: 'CPM',
				rate: 1500,
				quantity: 2,
				subtotal: 3000,
			},
		],
	},
];

export default function LineItemsChart() {
	const grandTotal = GROUPED_LINE_ITEMS.flatMap((g) => g.items).reduce(
		(sum, item) => sum + item.subtotal,
		0
	);

	return (
		<div className='card'>
			<table className='min-w-full divide-y divide-neutral-300 text-sm text-neutral-800'>
				<thead className='bg-neutral-100 text-neutral-500 uppercase'>
					<tr>
						<th className='py-3 pr-4 pl-6 text-left font-normal'>
							Description
						</th>
						<th className='px-4 py-3 text-left font-normal'>Start/End Dates</th>
						<th className='px-4 py-3 text-left font-normal'>Type</th>
						<th className='px-4 py-3 text-right font-normal'>Rate</th>
						<th className='px-4 py-3 text-right font-normal'>Qty</th>
						<th className='px-4 py-3 text-right font-normal'>Total</th>
						<th className='py-3 pr-6 pl-4 text-right font-normal'></th>
					</tr>
				</thead>
				<tbody className='divide-y divide-neutral-100 bg-white'>
					{GROUPED_LINE_ITEMS.map((group) => {
						const groupTotal = group.items.reduce(
							(sum, item) => sum + item.subtotal,
							0
						);

						return (
							<React.Fragment key={group.product}>
								<tr className='bg-neutral-100'>
									<td
										colSpan={7}
										className='px-6 py-2 font-medium text-neutral-800'
									>
										{group.product}
									</td>
								</tr>
								{group.items.map((item) => (
									<tr key={item.id}>
										<td className='py-2.5 pr-4 pl-8'>
											<div className='flex items-center gap-2'>
												<div className='h-6 w-1 rounded-full bg-neutral-300' />
												<span className='text-neutral-800'>
													{item.description}
												</span>
											</div>
										</td>
										<td
											aria-label={formatStartEndDates(
												item.startDate,
												item.endDate,
												{
													forAccessibility: true,
												}
											)}
											className='px-4 py-2.5'
										>
											{formatStartEndDates(item.startDate, item.endDate)}
										</td>
										<td className='px-4 py-2.5'>{item.type}</td>
										<td className='px-4 py-2.5 text-right'>
											{formatCurrency(item.rate)}
										</td>
										<td className='px-4 py-2.5 text-right'>{item.quantity}</td>
										<td className='px-4 py-2.5 text-right font-medium'>
											{formatCurrency(item.subtotal)}
										</td>
										<td>
											<div className='flex items-center justify-end gap-x-4 px-4 py-2.5'>
												<button className='cursor-pointer rounded-full p-2 transition hover:scale-110 hover:bg-neutral-100 hover:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300'>
													<PencilIcon className='h-4.5 w-4.5' />
												</button>
												<button className='cursor-pointer rounded-full p-2 transition hover:scale-110 hover:bg-neutral-100 hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300'>
													<TrashIcon className='h-4.5 w-4.5' />
												</button>
											</div>
										</td>
									</tr>
								))}
								<tr className='border-b-neutral-200 bg-neutral-50'>
									<td
										colSpan={5}
										className='p-4 text-right font-semibold text-neutral-600'
									>
										{group.product} Total
									</td>
									<td className='p-4 text-right font-semibold'>
										{formatCurrency(groupTotal)}
									</td>
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
						<td className='p-4 text-right font-bold'>
							{formatCurrency(grandTotal)}
						</td>
						<td colSpan={1}></td>
					</tr>
				</tfoot>
			</table>
		</div>
	);
}
