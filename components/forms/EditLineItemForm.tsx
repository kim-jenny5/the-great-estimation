'use client';

import { PencilIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

import DrawerWrapper from '../DrawerWrapper';
import SelectInput from './SelectInput';
import { getAllProducts, updateLineItem } from '@/util/queries';
import { RATE_TYPES } from '@/util/types';

import { strippedDate } from '@/util/formatters';

type EditLineItemFormProps = {
	lineItem: {
		id: string;
		orderId: string;
		productId: string;
		name: string;
		startDate: string;
		endDate: string;
		rateType: string;
		rate: number;
		quantity: number;
	};
};

export default function EditLineItemForm({ lineItem }: EditLineItemFormProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
	const [productId, setProductId] = useState<string>(lineItem.productId ?? null);
	const [name, setName] = useState<string>(lineItem.name);
	const [startDate, setStartDate] = useState<string>(strippedDate(lineItem.startDate).toISODate()!);
	const [endDate, setEndDate] = useState<string>(strippedDate(lineItem.endDate).toISODate() ?? '');
	const [rateType, setRateType] = useState<string>(lineItem.rateType);
	const [rate, setRate] = useState<string>(String(lineItem.rate));
	const [quantity, setQuantity] = useState<string>(String(lineItem.quantity));

	useEffect(() => {
		async function fetchProducts() {
			const data = await getAllProducts();
			setProducts(data);
		}
		fetchProducts();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		await updateLineItem({
			id: lineItem.id,
			productId,
			name,
			startDate,
			endDate,
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
				className='cursor-pointer rounded-full p-2 transition hover:scale-110 hover:bg-neutral-100 hover:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300'
			>
				<PencilIcon className='h-4.5 w-4.5' />
			</button>
			<DrawerWrapper
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title='Edit line item'
				description='Edit line item details below and click save when done.'
			>
				<form onSubmit={handleSubmit}>
					<div className='border-b border-gray-900/10 pb-6'>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<div className='sm:col-span-2'>
								<SelectInput
									name='product'
									defaultValue={productId}
									onChange={(newProductId) => setProductId(newProductId)}
									options={products.map((product) => product.name)}
								/>
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
									className='input'
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
									className='input'
								/>
							</div>
							<div className='sm:col-span-1'>
								<label htmlFor='endDate' className='block text-sm/6 font-medium text-gray-900'>
									End date (optional)
								</label>
								<input
									type='date'
									id='endDate'
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									className='input'
								/>
							</div>
							<div className='sm:col-span-1'>
								<SelectInput
									name='rateType'
									defaultValue={rateType}
									onChange={(newRateType) => setRateType(newRateType)}
									options={RATE_TYPES}
								/>
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
									className='input'
								/>
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
