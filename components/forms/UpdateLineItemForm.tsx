import { PencilIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

import DrawerWrapper from '../DrawerWrapper';
import { updateLineItem } from '@/util/queries';

import { strippedDate } from '@/util/formatters';
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
	const [productId, setProductId] = useState<string>(lineItem.productId ?? '');
	const [name, setName] = useState<string>(lineItem.name);
	const [startDate, setStartDate] = useState<string>(strippedDate(lineItem.startDate).toISODate()!);
	const [endDate, setEndDate] = useState<string>(strippedDate(lineItem.endDate).toISODate() ?? '');
	const [rateType, setRateType] = useState<string>(lineItem.rateType);
	const [rate, setRate] = useState<string>(String(lineItem.rate));
	const [quantity, setQuantity] = useState<string>(String(lineItem.quantity));

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
					initialValues={{ productId, name, startDate, endDate, rateType, rate, quantity }}
					products={products}
					submitFn={updateLineItem}
					setters={{
						setProductId,
						setName,
						setStartDate,
						setEndDate,
						setRateType,
						setRate,
						setQuantity,
					}}
					extraData={{ id: lineItem.id }}
					closeDrawer={() => setIsOpen(false)}
					submitLabel='Save'
				/>
			</DrawerWrapper>
		</>
	);
}
