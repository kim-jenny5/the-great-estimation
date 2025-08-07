'use client';

import { useState, useEffect } from 'react';

import { updateOrder } from '@/util/queries';
import { STATUSES } from '@/util/types';

import SelectInput from './SelectInputField';
import DrawerWrapper from '../DrawerWrapper';

type UpdateOrderFormProps = {
	order: {
		id: string;
		name: string;
		status: string;
		totalBudget: number;
		deliverableDueAt: string;
	};
};

export default function UpdateOrderForm({ order }: UpdateOrderFormProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [name, setName] = useState<string>(order.name);
	const [status, setStatus] = useState<string>(order.status);
	const [totalBudget, setTotalBudget] = useState(order.totalBudget);
	const [dueDate, setDueDate] = useState(order.deliverableDueAt);

	useEffect(() => {
		setName(order.name);
		setStatus(order.status ?? null);
		setTotalBudget(order.totalBudget);
		setDueDate(order.deliverableDueAt);
	}, [order]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		await updateOrder({
			id: order.id,
			name,
			status: status || '',
			totalBudget,
			deliverableDueAt: dueDate,
		});

		setIsOpen(false);
	};

	return (
		<>
			<button onClick={() => setIsOpen(true)} className='primary-btn'>
				Edit
			</button>
			<DrawerWrapper
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title='Edit order'
				description='Edit order details below and click save when done.'
			>
				<form onSubmit={handleSubmit}>
					<input type='hidden' name='id' value={order.id} />
					<div className='border-b border-gray-900/10 pb-6'>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<div className='sm:col-span-2'>
								<label htmlFor='name' className='block text-sm/6 font-medium text-gray-900'>
									Name
								</label>
								<input
									type='text'
									id='name'
									name='name'
									value={name}
									onChange={(e) => setName(e.target.value)}
									className='input'
								/>
							</div>
							<div className='sm:col-span-1'>
								<label htmlFor='status' className='block text-sm/6 font-medium text-gray-900'>
									Deliverable due at
								</label>
								<input
									id='deliverableDueAt'
									name='deliverableDueAt'
									type='date'
									value={dueDate.slice(0, 10)}
									onChange={(e) => setDueDate(e.target.value)}
									required
									className='input'
								/>
							</div>
							<div className='sm:col-span-1'>
								<SelectInput
									name='status'
									defaultValue={status}
									onChange={(newStatus) => setStatus(newStatus)}
									options={STATUSES}
								/>
							</div>
							<div className='sm:col-span-2'>
								<label htmlFor='totalBudget' className='block text-sm/6 font-medium text-gray-900'>
									Total Budget
								</label>
								<div className='relative mt-1'>
									<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
										<span className='text-gray-500 sm:text-sm'>$</span>
									</div>
									<input
										type='text'
										id='totalBudget'
										name='totalBudget'
										value={totalBudget}
										onChange={(e) => setTotalBudget(Number(e.target.value))}
										className='block w-full rounded-md bg-white py-1.5 pr-3 pl-7 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-lime-300 sm:text-sm/6'
									/>
									<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
										<span className='text-gray-500 sm:text-sm'>USD</span>
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
			</DrawerWrapper>
		</>
	);
}
