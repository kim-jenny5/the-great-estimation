'use client';

import { ReactNode, useState, useEffect } from 'react';
import { deleteLineItem } from '@/util/queries';

type AlertWrapperProps = {
	children: ReactNode;
	lineItemId: string;
	onConfirm?: () => void;
};

export default function AlertWrapper({ children, lineItemId, onConfirm }: AlertWrapperProps) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsOpen(false);
		};

		globalThis.addEventListener('keydown', handleEsc);

		return () => globalThis.removeEventListener('keydown', handleEsc);
	}, []);

	const handleDelete = async () => {
		try {
			await deleteLineItem(lineItemId);
			onConfirm?.();
		} catch (error) {
			console.error('Failed to delete line item:', error);
		} finally {
			setIsOpen(false);
		}
	};

	return (
		<>
			<span onClick={() => setIsOpen(true)}>{children}</span>
			{isOpen && (
				<div
					className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200'
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
				<div className='flex justify-end gap-4'>
					<button
						onClick={() => setIsOpen(false)}
						className='cursor-pointer rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'
					>
						Cancel
					</button>
					<button
						onClick={handleDelete}
						className='cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700'
					>
						Delete
					</button>
				</div>
			</div>
		</>
	);
}
