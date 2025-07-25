import { formatCurrency, formatPercentage } from '../util/formatters';

type StatCardProps = { title: string; value: number; percentage?: number };

export default function StatCard({ title, value, percentage }: StatCardProps) {
  return (
    <div className='flex flex-col gap-y-2 px-6 py-5'>
      <dt className='flex items-center justify-between text-sm font-medium text-neutral-500'>
        <span>{title}</span>
      </dt>
      <dd className='text-3xl font-semibold tracking-tight text-neutral-800'>
        {formatCurrency(value, { withCents: true })}
        {percentage && (
          <span className='ml-2 text-sm font-medium text-neutral-500'>
            {formatPercentage(percentage)}
          </span>
        )}
      </dd>
    </div>
  );
}
