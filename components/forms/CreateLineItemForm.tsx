import { PlusIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

import { getAllProducts, createLineItem } from '@/util/queries';
import { RATE_TYPES } from '@/util/types';

import DrawerWrapper from '../DrawerWrapper';

import type { RateType } from '@prisma/client';

export default function CreateLineItemForm({ orderId }: { orderId: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
	const [productId, setProductId] = useState('');
	const [name, setName] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [rateType, setRateType] = useState<RateType>('Flat');
	const [rate, setRate] = useState('');
	const [quantity, setQuantity] = useState('');

	useEffect(() => {
		async function fetchProducts() {
			const data = await getAllProducts();
			setProducts(data);
		}
		fetchProducts();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		await createLineItem({
			orderId,
			productId,
			name,
			startDate,
			endDate: endDate || null,
			rateType,
			rate: Number.parseFloat(rate),
			quantity: Number.parseInt(quantity),
		});

		setIsOpen(false);
	};

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className='primary-btn flex items-center justify-between gap-x-2'
			>
				Add a line item
				<PlusIcon width={15} height={15} />
			</button>
			<DrawerWrapper
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title='Add line item'
				description='Add a line item below and click create when done.'
			>
				<form onSubmit={handleSubmit}>
					<div className='border-b border-gray-900/10 pb-6'>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<div className='sm:col-span-2'>
								<label htmlFor='product' className='block text-sm/6 font-medium text-gray-900'>
									Product
								</label>
								<select
									id='product'
									required
									value={productId}
									onChange={(e) => setProductId(e.target.value)}
									className='mt-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-lime-300 sm:text-sm/6'
								>
									{products.map((product) => (
										<option key={product.id} value={product.id}>
											{product.name}
										</option>
									))}
								</select>
							</div>

							<div className='sm:col-span-2'>
								<label htmlFor='name' className='block text-sm/6 font-medium text-gray-900'>
									Name
								</label>
								<input
									required
									type='text'
									id='name'
									value={name}
									onChange={(e) => setName(e.target.value)}
									className='mt-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-lime-300 sm:text-sm/6'
								/>
							</div>

							<div className='sm:col-span-1'>
								<label htmlFor='startDate' className='block text-sm/6 font-medium text-gray-900'>
									Start date
								</label>
								<input
									required
									type='date'
									id='startDate'
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
									className='mt-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-lime-300 sm:text-sm/6'
								/>
							</div>

							<div className='sm:col-span-1'>
								<label htmlFor='endDate' className='block text-sm/6 font-medium text-gray-900'>
									End date (optional)
								</label>
								<input
									type='date'
									id='endDate'
									value={endDate ?? ''}
									onChange={(e) => setEndDate(e.target.value)}
									className='mt-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-lime-300 sm:text-sm/6'
								/>
							</div>

							<div className='sm:col-span-1'>
								<label htmlFor='rateType' className='block text-sm/6 font-medium text-gray-900'>
									Rate Type
								</label>
								<select
									id='rateType'
									required
									value={rateType}
									onChange={(e) => setRateType(e.target.value as RateType)}
									className='mt-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-lime-300 sm:text-sm/6'
								>
									{RATE_TYPES.map((rateType) => (
										<option key={rateType} value={rateType}>
											{rateType}
										</option>
									))}
								</select>
							</div>
							<div className='sm:col-span-1'>
								<label htmlFor='rate' className='block text-sm/6 font-medium text-gray-900'>
									Rate
								</label>
								<div className='relative mt-1'>
									<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
										<span className='text-gray-500 sm:text-sm'>$</span>
									</div>
									<input
										required
										type='number'
										id='rate'
										value={rate}
										onChange={(e) => setRate(e.target.value)}
										className='block w-full rounded-md bg-white py-1.5 pr-3 pl-7 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-lime-300 sm:text-sm/6'
									/>
								</div>
							</div>

							<div className='sm:col-span-1'>
								<label htmlFor='quantity' className='block text-sm/6 font-medium text-gray-900'>
									Quantity
								</label>
								<input
									required
									type='number'
									id='quantity'
									value={quantity}
									onChange={(e) => setQuantity(e.target.value)}
									className='mt-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-lime-300 sm:text-sm/6'
								/>
							</div>
						</div>
					</div>
					<div className='pt-6 text-end'>
						<button type='submit' className='primary-btn'>
							Create
						</button>
					</div>
				</form>
			</DrawerWrapper>
		</>
	);
}
