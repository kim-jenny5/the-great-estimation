import { formatLabel } from '@/util/formatters';

type TextInputCurrencyProps = {
	name: string;
	value: string | number;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export default function TextInputCurrency({ name, value, onChange }: TextInputCurrencyProps) {
	return (
		<>
			{formatLabel(name, { required: true })}
			<div className='relative mt-1'>
				<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
					<span className='text-gray-500 sm:text-sm'>$</span>
				</div>
				<input
					required
					type='text'
					id={name}
					name={name}
					value={value}
					onChange={onChange}
					className='block w-full rounded-md bg-white py-1.5 pr-3 pl-7 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-lime-300 sm:text-sm/6'
				/>
				<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
					<span className='text-gray-500 sm:text-sm'>USD</span>
				</div>
			</div>
		</>
	);
}
