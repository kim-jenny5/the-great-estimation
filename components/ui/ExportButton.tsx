// components/ExportButtons.tsx
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
	lineItems,
}: {
	orderName: string;
	lineItems: LineItem[];
}) {
	const rows = lineItems.map((li) => ({
		Description: li.name,
		Product: li.product?.name ?? '',
		StartDate: li.startDate ? new Date(li.startDate).toISOString().slice(0, 10) : '',
		EndDate: li.endDate ? new Date(li.endDate).toISOString().slice(0, 10) : '',
		RateType: li.rateType,
		Rate: Number(li.rate),
		Quantity: Number(li.quantity),
		Subtotal: Number(li.subtotal),
	}));

	const makeFilename = () => {
		const slug = orderName
			.replaceAll(/[^\w]+/g, '-')
			.replaceAll(/^-|-$/g, '')
			.slice(0, 60);
		return `TGE Demo ${slug || 'Order'}.csv`;
	};

	const exportCSV = () => {
		const csv = Papa.unparse(rows, { header: true });
		const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = makeFilename();
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className='flex gap-2'>
			<button className='secondary-btn' onClick={exportCSV}>
				Export
			</button>
		</div>
	);
}
