'use client';

import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useState, useEffect, useRef } from 'react';

import { formatLabel, formatPlaceholder } from '@/util/formatters';

type SelectInputProps = {
	name: string;
	defaultValue?: string;
	value?: string;
	options: readonly string[];
	onChange?: (value: string) => void;
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
	value,
	options,
	onChange,
}: SelectInputProps) {
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [selected, setSelected] = useState<string>(value ?? defaultValue ?? '');
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (value !== undefined) setSelected(value);
	}, [value]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

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
			{formatLabel(name, { required: true })}
			<div ref={dropdownRef} className='relative w-full'>
				<input required type='hidden' name={name} value={selected ?? ''} />
				<button type='button' className='input' onClick={() => setOpen((prev) => !prev)}>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							{selected ? (
								<>
									{showDot && <span className={`h-2 w-2 rounded-full ${statusStyles[selected]}`} />}
									<span>{selected}</span>
								</>
							) : (
								<span className='text-gray-400 italic'>Select {formatPlaceholder(name)}</span>
							)}
						</div>
						<ChevronDownIcon width={15} height={15} />
					</div>
				</button>
				{open && (
					<ul className='absolute z-10 mt-1 max-h-[215px] w-full divide-y divide-gray-100 overflow-y-auto rounded-md bg-white shadow-xl ring-1 ring-black/5 focus:outline-none'>
						{options.map((option) => (
							<li
								key={option}
								className='flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-900 hover:bg-gray-100'
								onClick={() => {
									if (option !== selected) {
										setSelected(option);
										onChange?.(option);
									}
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
