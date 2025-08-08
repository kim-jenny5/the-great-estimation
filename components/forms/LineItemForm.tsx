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
	setters: {
		setProductId: (id: string) => void;
		setName: (name: string) => void;
		setStartDate: (date: string) => void;
		setEndDate: (date: string) => void;
		setRateType: (type: string) => void;
		setRate: (rate: string) => void;
		setQuantity: (qty: string) => void;
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	submitFn: (data: any) => Promise<any>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	extraData?: Record<string, any>;
	closeDrawer: () => void;
	submitLabel: string;
};

export default function LineItemForm({
	initialValues,
	products,
	setters,
	submitFn,
	extraData = {},
	closeDrawer,
	submitLabel,
}: LineItemFormProps) {
	const { productId, name, startDate, endDate, rateType, rate, quantity } = initialValues;
	const { setProductId, setName, setStartDate, setEndDate, setRateType, setRate, setQuantity } =
		setters;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await submitFn({
				...extraData,
				productId,
				name,
				startDate,
				endDate,
				rateType,
				rate: Number.parseFloat(rate),
				quantity: Number.parseInt(quantity, 10),
			});

			setProductId('');
			setName('');
			setStartDate('');
			setEndDate('');
			setRateType('');
			setRate('');
			setQuantity('');

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
							value={products.find((p) => p.id === productId)?.name ?? ''}
							defaultValue={products.find((p) => p.id === productId)?.name ?? ''}
							options={products.map((p) => p.name)}
							onChange={(name) => {
								const matched = products.find((p) => p.name === name);
								setProductId(matched?.id ?? '');
							}}
						/>
					</div>
					<div className='sm:col-span-full'>
						{formatLabel('Name', { required: true })}
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
						{formatLabel('Start Date', { required: true })}
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
						{formatLabel('End Date')}
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
							value={rateType}
							defaultValue={rateType}
							onChange={(val) => setRateType(val)}
							options={RATE_TYPES}
						/>
					</div>
					<div className='sm:col-span-1'>
						<TextInputCurrency name='rate' value={rate} onChange={(e) => setRate(e.target.value)} />
					</div>
					<div className='sm:col-span-full'>
						{formatLabel('Quantity', { required: true })}
						<input
							required
							type='number'
							id='quantity'
							value={quantity}
							onChange={(e) => setQuantity(e.target.value)}
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
