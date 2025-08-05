import type { SerializedOrder } from '@/util/types';
import { formatDate } from '@/util/formatters';
import StatusBadge from '@/components/StatusBadge';
import DrawerWrapper from './DrawerWrapper';
import EditOrderForm from './forms/EditOrderForm';

export default function Header({ order }: { order: SerializedOrder }) {
	const { name, status, deliverableDueAt } = order;

	return (
		<div className='flex h-full w-full flex-col gap-y-2'>
			<div className='flex w-full items-center justify-between'>
				<div className='flex items-center gap-x-3'>
					<div className='text-3xl font-medium tracking-tight text-neutral-800'>{name}</div>
					{status && <StatusBadge status={status} />}
				</div>
				<div className='flex gap-x-4'>
					<button className='secondary-btn'>Export</button>
					<DrawerWrapper
						title='Edit order'
						description='Edit order details below and click save when done.'
						form={<EditOrderForm order={order} />}
					>
						<button className='primary-btn'>Edit</button>
					</DrawerWrapper>
				</div>
			</div>
			<div>
				Deliverable due <span className='font-semibold'>{formatDate(deliverableDueAt)}</span>
			</div>
		</div>
	);
}
