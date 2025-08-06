'use client';

import { useState } from 'react';
import { StatusOption } from '@/util/types';
import SelectInput from './SelectInput';

type EditOrderFormProps = {
	order: {
		id: string;
		name: string;
		status: StatusOption;
		totalBudget: number;
		deliverableDueAt: string;
	};
};

export default function EditOrderForm({ order }: EditOrderFormProps) {
	const [name, setName] = useState(order.name);
	const [status, setStatus] = useState<StatusOption>(order.status ?? null);
	const [totalBudget, setTotalBudget] = useState(order.totalBudget);
	const [dueDate, setDueDate] = useState(order.deliverableDueAt);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('submit btn clicked');
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className='border-b border-gray-900/10 pb-6'>
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					<div className='sm:col-span-2'>
						<label htmlFor='name' className='block text-sm/6 font-medium text-gray-900'>
							Name
						</label>
						<div className='mt-1'>
							<input
								type='text'
								id='name'
								name='name'
								value={name}
								onChange={(e) => setName(e.target.value)}
								className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-lime-300 sm:text-sm/6'
							/>
						</div>
					</div>
					<div className='sm:col-span-1'>
						<label htmlFor='status' className='block text-sm/6 font-medium text-gray-900'>
							Deliverable due at
						</label>
						<div className='mt-1'>
							<input
								id='deliverableDueAt'
								name='deliverableDueAt'
								type='date'
								value={dueDate.slice(0, 10)}
								onChange={(e) => setDueDate(e.target.value)}
								required
								className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-lime-300 sm:text-sm/6'
							/>
						</div>
					</div>
					<div className='sm:col-span-1'>
						<label htmlFor='status' className='block text-sm/6 font-medium text-gray-900'>
							Status
						</label>
						<div className='mt-1'>
							<SelectInput
								defaultValue={status}
								onChange={(newStatus) => setStatus(newStatus)}
								style='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-lime-300 sm:text-sm/6'
							/>
						</div>
					</div>
					<div className='sm:col-span-2'>
						<label htmlFor='totalBudget' className='block text-sm/6 font-medium text-gray-900'>
							Total Budget
						</label>
						<div className='mt-1'>
							<div className='relative'>
								<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
									<span className='text-gray-500 sm:text-sm'>$</span>
								</div>
								<input
									type='text'
									id='totalBudget'
									name='totalBudget'
									value={totalBudget}
									onChange={(e) => setTotalBudget(Number(e.target.value))}
									className='-ou tline-offset-1 block w-full rounded-md bg-white py-1.5 pr-3 pl-7 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-lime-300 sm:text-sm/6'
								/>
								<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
									<span className='text-gray-500 sm:text-sm'>USD</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='pt-6 text-end'>
				<button type='submit' className='primary-btn'>
					Save
				</button>
			</div>
		</form>
	);
}
