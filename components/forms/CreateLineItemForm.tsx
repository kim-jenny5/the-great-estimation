import { PlusIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

import { createLineItem } from '@/util/queries';

import DrawerWrapper from '../DrawerWrapper';
import LineItemForm from './LineItemForm';

type CreateLineItemFormProps = {
	orderId: string;
	products: { id: string; name: string }[];
};

export default function CreateLineItemForm({ orderId, products }: CreateLineItemFormProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [productId, setProductId] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [rateType, setRateType] = useState<string>('');
	const [rate, setRate] = useState<string>('');
	const [quantity, setQuantity] = useState('');

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
				<LineItemForm
					initialValues={{ productId, name, startDate, endDate, rateType, rate, quantity }}
					products={products}
					submitFn={createLineItem}
					setters={{
						setProductId,
						setName,
						setStartDate,
						setEndDate,
						setRateType,
						setRate,
						setQuantity,
					}}
					extraData={{ orderId }}
					closeDrawer={() => setIsOpen(false)}
					submitLabel='Create'
				/>
			</DrawerWrapper>
		</>
	);
}
