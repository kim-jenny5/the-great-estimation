'use client';

import { DateTime } from 'luxon';
import Papa from 'papaparse';

import { TIMEZONE } from './formatters';

type LineItem = {
	name: string;
	product: { name: string };
	startDate: string | Date | null;
	endDate: string | Date | null;
	rateType: string;
	rate: number | string;
	quantity: number | string;
	subtotal: number | string;
};

// Luxon-friendly YMD, consistent with your other formatters
const toYMD = (date: string | Date | null) => {
	if (!date) return '';
	const dt =
		typeof date === 'string'
			? DateTime.fromISO(date, { zone: TIMEZONE })
			: DateTime.fromJSDate(date, { zone: TIMEZONE });
	return dt.toISODate() ?? '';
};

export default function ExportButtons({
	orderName,
	totalBudget,
	lineItems,
}: {
	orderName: string;
	totalBudget: number;
	lineItems: LineItem[];
}) {
	const handleExportCSV = () => {
		// group by product
		const byProduct = new Map<string, LineItem[]>();
		for (const li of lineItems) {
			const key = li.product?.name ?? 'Uncategorized';
			if (!byProduct.has(key)) byProduct.set(key, []);
			byProduct.get(key)!.push(li);
		}

		const grandTotal = lineItems.reduce((sum, li) => sum + Number(li.subtotal), 0);

		// AOA: batch pushes to satisfy unicorn/prefer-single-call
		const aoa: (string | number)[][] = [];

		aoa.push(
			// Title + Budget + header
			[orderName],
			['Budget Total', Number(totalBudget)],
			[],
			[
				'Description',
				'Product',
				'StartDate',
				'EndDate',
				'RateType',
				'Rate',
				'Quantity',
				'Subtotal',
			],

			// Product groups (each group contributes multiple rows)
			...[...byProduct.entries()].flatMap(([productName, items]) => {
				const rowsForItems = items.map((li) => [
					li.name,
					productName,
					toYMD(li.startDate),
					toYMD(li.endDate),
					li.rateType,
					Number(li.rate),
					Number(li.quantity),
					Number(li.subtotal),
				]);

				const groupTotal = items.reduce((sum, li) => sum + Number(li.subtotal), 0);

				// Return: group header, all item rows, group total row, spacer
				return [
					[productName],
					...rowsForItems,
					['', '', '', '', '', '', `${productName} Total`, Number(groupTotal)],
					[],
				];
			}),

			// Grand total
			['', '', '', '', '', '', 'Grand Total', Number(grandTotal)]
		);

		const csv = Papa.unparse(aoa, { header: false });
		const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		const slug = orderName
			.replaceAll(/[^\w]+/g, '-')
			.replaceAll(/^-|-$/g, '')
			.slice(0, 60);
		a.href = url;
		a.download = `TGE Demo ${slug || 'Order'}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<button className='secondary-btn' onClick={handleExportCSV}>
			Export
		</button>
	);
}
