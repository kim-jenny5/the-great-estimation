import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import DrawerWrapper from '../DrawerWrapper';

export default function AddLineItemForm() {
	const [isOpen, setIsOpen] = useState(false);

	const handleSubmit = async () => {
		console.log('edit line item submit btn clicked');
		setIsOpen(false);
	};

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className='primary-btn flex items-center justify-between gap-x-2'
			>
				Add a line item
				<PlusIcon width={15} height={15} />
			</button>
			<DrawerWrapper
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title='Add line item'
				description='Add a line item below and click create when done.'
			>
				<form onSubmit={handleSubmit}></form>
			</DrawerWrapper>
		</>
	);
}
