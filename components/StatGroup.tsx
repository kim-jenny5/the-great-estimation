import { formatCurrency } from '@/util/formatters';

import StatCard from './StatCard';

type StatGroupProps = {
	totalBudget: number;
	totalSpend: number;
	productsCount: number;
	lineItemsCount: number;
	discount?: number;
};

export default function StatGroup({
	totalBudget,
	totalSpend,
	productsCount,
	lineItemsCount,
	discount = 0,
}: StatGroupProps) {
	const percentage = totalBudget > 0 ? totalSpend / totalBudget : undefined;
	const badge = totalBudget === 0 && totalSpend > 0 ? `+${formatCurrency(totalSpend)} over` : undefined;
	const originalSpend = discount > 0 ? totalSpend / (1 - discount) : undefined;

	return (
		<div className='overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-xs'>
			<dl className='grid grid-cols-4 divide-x divide-neutral-300'>
				<StatCard title='Total Budget' value={totalBudget} isCurrency />
				<StatCard title='Total Spend' value={totalSpend} originalValue={originalSpend} percentage={percentage} badge={badge} isCurrency />
				<StatCard title='Total No. of Products' value={productsCount} />
				<StatCard title='Total No. of Line Items' value={lineItemsCount} />
			</dl>
		</div>
	);
}
