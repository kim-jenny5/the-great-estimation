'use client';

import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useState, useEffect, useRef } from 'react';

import { formatLabel } from '@/util/formatters';

type SelectInputProps = {
	name: string;
	defaultValue: string;
	onChange?: (value: string) => void;
	options: readonly string[];
};

const statusStyles: Record<string, string> = {
	Pending: 'bg-gray-500',
	'In progress': 'bg-yellow-500',
	Completed: 'bg-green-500',
	Lost: 'bg-red-500',
};

export default function SelectInput({
	name = '',
	defaultValue = '',
	onChange,
	options,
}: SelectInputProps) {
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [selected, setSelected] = useState<string>(defaultValue);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		onChange?.(selected ?? '');
	}, [selected, onChange]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const showDot = name === 'status';

	return (
		<>
			<label htmlFor={name} className='block text-sm/6 font-medium text-gray-900'>
				{formatLabel(name)}
			</label>
			<div ref={dropdownRef} className='relative w-full'>
				<input type='hidden' name={name} value={selected ?? ''} />
				<button type='button' className='input' onClick={() => setOpen((prev) => !prev)}>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							{selected ? (
								<>
									{showDot && <span className={`h-2 w-2 rounded-full ${statusStyles[selected]}`} />}
									<span>{selected}</span>
								</>
							) : (
								<span className='text-gray-400 italic'>
									Select {formatLabel(name).toLowerCase()}
								</span>
							)}
						</div>
						<ChevronDownIcon width={15} height={15} />
					</div>
				</button>
				{open && (
					<ul className='absolute z-10 mt-1 w-full divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
						{options.map((option) => (
							<li
								key={option}
								className='flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-900 hover:bg-gray-100'
								onClick={() => {
									setSelected(option);
									setOpen(false);
								}}
							>
								{showDot && <span className={`h-2 w-2 rounded-full ${statusStyles[option]}`} />}
								{option}
							</li>
						))}
					</ul>
				)}
			</div>
		</>
	);
}
