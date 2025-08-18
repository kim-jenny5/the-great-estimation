import { PencilIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

import { strippedDate } from '@/util/formatters';
import { updateLineItem } from '@/util/queries';

import DrawerWrapper from '../DrawerWrapper';
import LineItemForm from './LineItemForm';

type UpdateLineItemFormProps = {
	lineItem: {
		id: string;
		orderId: string;
		productId: string;
		name: string;
		startDate: string;
		endDate: string;
		rateType: string;
		rate: number;
		quantity: number;
	};
	products: { id: string; name: string }[];
};

export default function UpdateLineItemForm({ lineItem, products }: UpdateLineItemFormProps) {
	const [isOpen, setIsOpen] = useState(false);

	const initialValues = {
		productId: lineItem.productId ?? '',
		name: lineItem.name ?? '',
		startDate: strippedDate(lineItem.startDate).toISODate() ?? '',
		endDate: lineItem.endDate ? (strippedDate(lineItem.endDate).toISODate() ?? '') : '',
		rateType: lineItem.rateType ?? '',
		rate: String(lineItem.rate ?? ''),
		quantity: String(lineItem.quantity ?? ''),
	};

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
				<LineItemForm
					key={lineItem.id}
					initialValues={initialValues}
					products={products}
					submitFn={updateLineItem}
					extraData={{ id: lineItem.id }}
					closeDrawer={() => setIsOpen(false)}
					resetKey={isOpen}
					submitLabel='Save'
				/>
			</DrawerWrapper>
		</>
	);
}
