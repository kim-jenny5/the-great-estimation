'use client';

import { useState, useEffect } from 'react';

import { formatLabel } from '@/util/formatters';
import { updateOrder } from '@/util/queries';
import { updateOrderFormSchema } from '@/util/schemas';
import { STATUSES } from '@/util/types';

import DrawerWrapper from '../DrawerWrapper';
import SelectInput from '../ui/SelectInput';
import TextInputCurrency from '../ui/TextInputCurrency';

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
	const [totalBudget, setTotalBudget] = useState<number>(order.totalBudget);
	const [dueDate, setDueDate] = useState(order.deliverableDueAt);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		setName(order.name);
		setStatus(order.status ?? null);
		setTotalBudget(order.totalBudget);
		setDueDate(order.deliverableDueAt);
	}, [order]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const result = updateOrderFormSchema.safeParse({ name, status, totalBudget, deliverableDueAt: dueDate });
		if (!result.success) {
			const fieldErrors: Record<string, string> = {};
			for (const issue of result.error.issues) {
				const key = issue.path[0] as string;
				if (key) fieldErrors[key] = issue.message;
			}
			setErrors(fieldErrors);
			return;
		}
		setErrors({});

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
								{formatLabel('Name', { required: true })}
								<input
									type='text'
									id='name'
									name='name'
									value={name}
									onChange={(e) => setName(e.target.value)}
									className='input'
								/>
								{errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name}</p>}
							</div>
							<div className='sm:col-span-1'>
								{formatLabel('Deliverable Due At', { required: true })}
								<input
									id='deliverableDueAt'
									name='deliverableDueAt'
									type='date'
									value={dueDate.slice(0, 10)}
									onChange={(e) => setDueDate(e.target.value)}
									className='input'
								/>
								{errors.deliverableDueAt && <p className='mt-1 text-sm text-red-500'>{errors.deliverableDueAt}</p>}
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
								<TextInputCurrency
									name='totalBudget'
									value={totalBudget}
									onChange={(e) => setTotalBudget(Number(e.target.value))}
								/>
								{errors.totalBudget && <p className='mt-1 text-sm text-red-500'>{errors.totalBudget}</p>}
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
