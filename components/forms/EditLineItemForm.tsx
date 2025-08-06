'use client';

import { PencilIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

import DrawerWrapper from '../DrawerWrapper';

export default function EditLineItemForm() {
	const [isOpen, setIsOpen] = useState(false);

	const handleSubmit = async () => setIsOpen(false);

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
				<form onSubmit={handleSubmit}></form>
			</DrawerWrapper>
		</>
	);
}
