import { useState, useEffect } from 'react';

import { formatLabel } from '@/util/formatters';
import { RATE_TYPES } from '@/util/types';

import SelectInput from '../ui/SelectInput';
import TextInputCurrency from '../ui/TextInputCurrency';

type LineItemFormProps = {
	initialValues: {
		productId: string;
		name: string;
		startDate: string;
		endDate: string;
		rateType: string;
		rate: string;
		quantity: string;
	};
	products: { id: string; name: string }[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	submitFn: (data: any) => Promise<any>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	extraData?: Record<string, any>;
	closeDrawer: () => void;
	resetOnSubmit?: boolean;
	resetKey?: boolean;
	submitLabel: string;
};

export default function LineItemForm({
	initialValues,
	products,
	submitFn,
	extraData = {},
	closeDrawer,
	resetOnSubmit = false,
	resetKey,
	submitLabel,
}: LineItemFormProps) {
	const [values, setValues] = useState(initialValues);

	const set =
		<K extends keyof typeof initialValues>(k: K) =>
		(v: (typeof initialValues)[K]) =>
			setValues((prev) => ({ ...prev, [k]: v }));

	useEffect(() => {
		setValues(initialValues);
	}, [resetKey, initialValues]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await submitFn({
				...extraData,
				productId: values.productId,
				name: values.name,
				startDate: values.startDate,
				endDate: values.endDate,
				rateType: values.rateType,
				rate: Number.parseFloat(values.rate),
				quantity: Number.parseInt(values.quantity, 10),
			});

			if (resetOnSubmit) {
				setValues({
					productId: '',
					name: '',
					startDate: '',
					endDate: '',
					rateType: '',
					rate: '',
					quantity: '',
				});
			}

			closeDrawer();
		} catch (error) {
			throw new Error(`Failed to submit line item: ${error}`);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className='border-b border-gray-900/10 pb-6'>
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					<div className='sm:col-span-full'>
						<SelectInput
							name='product'
							value={products.find((product) => product.id === values.productId)?.name ?? ''}
							options={products.map((product) => product.name)}
							onChange={(name) => {
								const matched = products.find((product) => product.name === name);
								set('productId')(matched?.id ?? '');
							}}
						/>
					</div>
					<div className='sm:col-span-full'>
						{formatLabel('Name', { required: true })}
						<input
							required
							type='text'
							id='name'
							value={values.name}
							onChange={(e) => set('name')(e.target.value)}
							className='input'
						/>
					</div>
					<div className='sm:col-span-1'>
						{formatLabel('Start Date', { required: true })}
						<input
							required
							type='date'
							id='startDate'
							value={values.startDate}
							onChange={(e) => set('startDate')(e.target.value)}
							className='input'
						/>
					</div>
					<div className='sm:col-span-1'>
						{formatLabel('End Date')}
						<input
							type='date'
							id='endDate'
							value={values.endDate}
							onChange={(e) => set('endDate')(e.target.value)}
							className='input'
						/>
					</div>
					<div className='sm:col-span-1'>
						<SelectInput
							name='rateType'
							value={values.rateType}
							onChange={(value) => set('rateType')(value)}
							options={RATE_TYPES}
						/>
					</div>
					<div className='sm:col-span-1'>
						<TextInputCurrency
							name='rate'
							value={values.rate}
							onChange={(e) => set('rate')(e.target.value)}
						/>
					</div>
					<div className='sm:col-span-full'>
						{formatLabel('Quantity', { required: true })}
						<input
							required
							type='number'
							id='quantity'
							value={values.quantity}
							onChange={(e) => set('quantity')(e.target.value)}
							min={1}
							max={9999}
							className='input'
						/>
					</div>
				</div>
			</div>
			<div className='pt-6 text-end'>
				<button type='submit' className='primary-btn'>
					{submitLabel}
				</button>
			</div>
		</form>
	);
}
