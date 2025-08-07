import SelectInput from './SelectInputField';
import { RATE_TYPES } from '@/util/types';

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
	submitFn: (data: any) => Promise<any>;
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

		await submitFn({
			...extraData,
			productId,
			name,
			startDate,
			endDate,
			rateType,
			rate: Number.parseFloat(rate),
			quantity: Number.parseInt(quantity),
		});

		closeDrawer();
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className='border-b border-gray-900/10 pb-6'>
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-6'>
					<div className='sm:col-span-full'>
						<SelectInput
							name='product'
							defaultValue={products.find((p) => p.id === productId)?.name ?? ''}
							options={products.map((p) => p.name)}
							onChange={(name) => {
								const matched = products.find((p) => p.name === name);
								setProductId(matched?.id ?? '');
							}}
						/>
					</div>
					<div className='sm:col-span-full'>
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
					<div className='sm:col-span-3'>
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
					<div className='sm:col-span-3'>
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
					<div className='sm:col-span-2'>
						<SelectInput
							name='rateType'
							defaultValue={rateType}
							onChange={(val) => setRateType(val)}
							options={RATE_TYPES}
						/>
					</div>
					<div className='sm:col-span-2'>
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
					<div className='sm:col-span-2'>
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
					{submitLabel}
				</button>
			</div>
		</form>
	);
}
