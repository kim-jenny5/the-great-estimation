import StatusBadge from '@/components/StatusBadge';
import { formatDate } from '@/util/formatters';

import EditOrderForm from './forms/UpdateOrderForm';
import ExportButtons from './ui/ExportButton';

import type { SerializedOrder } from '@/util/types';

export default function Header({ order }: { order: SerializedOrder }) {
	const { name, status, deliverableDueAt, lineItems, totalBudget } = order;

	return (
		<div className='flex h-full w-full flex-col gap-y-2'>
			<div className='flex w-full items-center justify-between'>
				<div className='flex items-center gap-x-3'>
					<div className='text-3xl font-medium tracking-tight text-neutral-800'>{name}</div>
					{status && <StatusBadge status={status} />}
				</div>
				<div className='flex gap-x-4'>
					<ExportButtons orderName={name} lineItems={lineItems} />
					<EditOrderForm order={order} />
				</div>
			</div>
			<div>
				Deliverable due <span className='font-semibold'>{formatDate(deliverableDueAt)}</span>
			</div>
		</div>
	);
}
