'use client';

import { useState } from 'react';

type EditOrderFormProps = {
	order: {
		// id: string;
		name: string;
		status: string | null;
		totalBudget: number;
		deliverableDueAt: string;
	};
};

export default function EditOrderForm({ order }: EditOrderFormProps) {
	// const { id, name, status, totalBudget, deliverableDueAt } = order;

	const [name, setName] = useState(order.name);
	const [status, setStatus] = useState(order.status);
	const [totalBudget, setTotalBudget] = useState(order.totalBudget);
	// const [dueDate, setDueDate] = useState(order.deliverableDueAt.slice(0, 10)); // yyyy-mm-dd
	const [dueDate, setDueDate] = useState(order.deliverableDueAt);

	const handleSubmit = () => {
		console.log('submit btn clicked');
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className='space-y-12'>
				<div className='border-b border-gray-900/10 pb-12'>
					<h2 className='text-base/7 font-semibold text-gray-900'>Edit Order</h2>
					<p className='mt-1 text-sm/6 text-gray-600'>Make changes to the order details below.</p>

					<div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
						<div className='sm:col-span-3'>
							<label htmlFor='name' className='block text-sm/6 font-medium text-gray-900'>
								Order name
							</label>
							<div className='mt-2'>
								<input
									type='text'
									id='name'
									name='name'
									value={name}
									onChange={(e) => setName(e.target.value)}
									className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
								/>
							</div>
						</div>

						{/* Repeat similar blocks for status, budget, dueDate, etc. */}
					</div>
				</div>
			</div>
			<button type='submit' className='primary-btn'>
				Save
			</button>
		</form>
	);
}
