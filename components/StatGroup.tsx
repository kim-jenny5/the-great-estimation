import StatCard from './StatCard';

type StatGroupProps = {
	totalBudget: number;
	totalSpend: number;
	productsCount: number;
	lineItemsCount: number;
};

export default function StatGroup({
	totalBudget,
	totalSpend,
	productsCount,
	lineItemsCount,
}: StatGroupProps) {
	const percentage = totalSpend / totalBudget;

	return (
		<div className='overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-xs'>
			<dl className='grid grid-cols-4 divide-x divide-neutral-300'>
				<StatCard title='Total Budget' value={totalBudget} isCurrency />
				<StatCard title='Total Spend' value={totalSpend} percentage={percentage} isCurrency />
				<StatCard title='Total No. of Products' value={productsCount} />
				<StatCard title='Total No. of Line Items' value={lineItemsCount} />
			</dl>
		</div>
	);
}
