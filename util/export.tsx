'use client';

import Papa from 'papaparse';

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

export default function ExportButtons({
	orderName,
	totalBudget,
	lineItems,
}: {
	orderName: string;
	totalBudget: number;
	lineItems: LineItem[];
}) {
	const toYMD = (date: string | Date | null) =>
		date ? new Date(date).toISOString().slice(0, 10) : '';

	const handleExportCSV = () => {
		const byProduct = new Map<string, LineItem[]>();
		for (const li of lineItems) {
			const key = li.product?.name ?? 'Uncategorized';
			if (!byProduct.has(key)) byProduct.set(key, []);
			byProduct.get(key)!.push(li);
		}

		// Grand total
		const grandTotal = lineItems.reduce((sum, li) => sum + Number(li.subtotal), 0);

		// Build AOA (array of arrays) so we can inject custom rows
		const aoa: (string | number)[][] = [];

		// Title + Budget (top)
		aoa.push([orderName]); // title row
		aoa.push(['Budget Total', Number(totalBudget)]); // budget row
		aoa.push([]); // empty spacer row

		// Table header
		aoa.push([
			'Description',
			'Product',
			'StartDate',
			'EndDate',
			'RateType',
			'Rate',
			'Quantity',
			'Subtotal',
		]);

		// Product groups
		for (const [productName, items] of byProduct.entries()) {
			// Group header row (light gray style is visual; CSV will just have the text)
			aoa.push([`${productName}`]);

			// Item rows
			for (const li of items) {
				aoa.push([
					li.name,
					productName,
					toYMD(li.startDate),
					toYMD(li.endDate),
					li.rateType,
					Number(li.rate),
					Number(li.quantity),
					Number(li.subtotal),
				]);
			}

			// Group subtotal
			const groupTotal = items.reduce((sum, li) => sum + Number(li.subtotal), 0);
			aoa.push(['', '', '', '', '', '', `${productName} Total`, Number(groupTotal)]);

			// Spacer between groups
			aoa.push([]);
		}

		// Grand total at bottom
		aoa.push(['', '', '', '', '', '', 'Grand Total', Number(grandTotal)]);

		// Export
		const csv = Papa.unparse(aoa, { header: false });
		const blob = new Blob(
			['\uFEFF' + csv], // keep BOM so Excel shows UTF-8 correctly
			{ type: 'text/csv;charset=utf-8;' }
		);
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		const slug = orderName
			.replace(/[^\w]+/g, '-')
			.replace(/^-|-$/g, '')
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
