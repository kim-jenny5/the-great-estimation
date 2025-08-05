'use client';

import { useState, useEffect, useRef } from 'react';
import { StatusValue, StatusOption } from '@/util/types';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const statusStyles: Record<StatusValue, string> = {
	'In progress': 'bg-yellow-500',
	Completed: 'bg-green-500',
	Lost: 'bg-red-500',
};

type SelectInputProps = {
	name?: string;
	defaultValue?: StatusOption;
	onChange?: (value: StatusOption) => void;
	style: string;
};

export default function SelectInput({
	name = 'status',
	defaultValue = 'In progress',
	onChange,
	style: styleFromProps,
}: SelectInputProps) {
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [selected, setSelected] = useState<StatusOption>(defaultValue ?? null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		onChange?.(selected);
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

	return (
		<div ref={dropdownRef} className='relative w-full'>
			<input type='hidden' name={name} value={selected ?? ''} />
			<button type='button' className={styleFromProps} onClick={() => setOpen((prev) => !prev)}>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						{selected ? (
							<>
								<span className={`h-2 w-2 rounded-full ${statusStyles[selected]}`} />
								<span>{selected}</span>
							</>
						) : (
							<span className='text-gray-400 italic'>Select status</span>
						)}
					</div>
					<ChevronDownIcon width={15} height={15} />
				</div>
			</button>
			{open && (
				<ul className='absolute z-10 mt-1 w-full divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
					{(Object.keys(statusStyles) as StatusValue[]).map((status) => (
						<li
							key={status}
							className='flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-900 hover:bg-gray-100'
							onClick={() => {
								setSelected(status);
								setOpen(false);
							}}
						>
							<span className={`h-2 w-2 rounded-full ${statusStyles[status]}`} />
							{status}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
