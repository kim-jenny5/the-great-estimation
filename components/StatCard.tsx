import { formatCurrency, formatPercentage } from '@/util/formatters';
import { stylePercentage } from '@/util/stylizers';

type StatCardProps = {
	title: string;
	value: number;
	originalValue?: number;
	percentage?: number;
	badge?: string;
	isCurrency?: boolean;
};

export default function StatCard({
	title,
	value,
	originalValue,
	percentage,
	badge,
	isCurrency,
}: StatCardProps) {
	return (
		<div className='flex flex-col gap-y-2 px-6 py-5'>
			<dt className='flex items-center justify-between text-sm font-medium text-neutral-500'>
				<span>{title}</span>
			</dt>
			<dd className='flex flex-1 flex-col justify-end tracking-tight text-neutral-800'>
				{originalValue !== undefined && (
					<span className='text-lg font-normal text-neutral-400 line-through'>
						{isCurrency ? formatCurrency(originalValue) : originalValue}
					</span>
				)}
				<span className='text-3xl font-semibold'>
					{isCurrency ? formatCurrency(value) : value}
					{percentage && (
						<span className={`ml-2 text-sm ${stylePercentage(percentage)}`}>
							{formatPercentage(percentage)}
						</span>
					)}
					{!percentage && badge && (
						<span className='ml-2 text-sm font-bold text-red-500'>{badge}</span>
					)}
				</span>
			</dd>
		</div>
	);
}
