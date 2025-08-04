import { formatDate } from '@/util/formatters';
import StatusBadge from '@/components/StatusBadge';

type HeaderProps = {
	name: string;
	status: string | null;
	deliverableDueAt: Date;
};

export default function Header({ name, status, deliverableDueAt }: HeaderProps) {
	return (
		<div className='flex h-full w-full flex-col gap-y-2'>
			<div className='flex w-full items-center justify-between'>
				<div className='flex items-center gap-x-3'>
					<div className='text-3xl font-medium tracking-tight text-neutral-800'>{name}</div>
					{status && <StatusBadge status={status} />}
				</div>
				<div className='flex gap-x-4'>
					<button className='secondary-btn'>Export</button>
					<button className='primary-btn'>Edit</button>
				</div>
			</div>
			<div>
				Deliverable due <span className='font-semibold'>{formatDate(deliverableDueAt)}</span>
			</div>
		</div>
	);
}
