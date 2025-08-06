import { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';
import { deleteLineItem } from '@/util/queries';

type DeleteLineItemFormProps = {
	lineItemId: string;
};

export default function DeleteLineItemForm({ lineItemId }: DeleteLineItemFormProps) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsOpen(false);
		};

		globalThis.addEventListener('keydown', handleEsc);

		return () => globalThis.removeEventListener('keydown', handleEsc);
	}, []);

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className='cursor-pointer rounded-full p-2 transition hover:scale-110 hover:bg-neutral-100 hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300'
			>
				<TrashIcon className='h-4.5 w-4.5' />
			</button>
			{isOpen && (
				<div
					className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200'
					onClick={() => setIsOpen(false)}
				/>
			)}
			<div
				className={`fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-white p-6 shadow-xl transition duration-300 ease-out ${
					isOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
				}`}
			>
				<h2 className='text-xl font-medium text-slate-800'>Are you sure?</h2>
				<p className='mt-2 mb-5 text-slate-700'>This action cannot be undone.</p>
				<form action={deleteLineItem} className='flex justify-end gap-4'>
					<input type='hidden' name='id' value={lineItemId} />
					<button
						type='button'
						onClick={() => setIsOpen(false)}
						className='cursor-pointer rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'
					>
						Cancel
					</button>
					<button
						type='submit'
						className='cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700'
					>
						Delete
					</button>
				</form>
			</div>
		</>
	);
}
