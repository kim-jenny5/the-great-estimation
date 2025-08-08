import { faker } from '@faker-js/faker';
import { PlusIcon } from '@heroicons/react/24/solid';
import { DateTime } from 'luxon';
import { useState, useRef, useEffect } from 'react';

import { TIMEZONE } from '@/util/formatters';
import { createLineItem } from '@/util/queries';
import { RATE_TYPES } from '@/util/types';

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

	const seededOnceRef = useRef(false);

	useEffect(() => {
		if (!isOpen) {
			seededOnceRef.current = false;
			return;
		}
		if (seededOnceRef.current) return;
		if (!products?.length) return;
		seededOnceRef.current = true;

		const prod = faker.helpers.arrayElement(products);
		const start = faker.date.soon({ days: 30 });
		const maybeHasEnd = faker.datatype.boolean();
		const end = maybeHasEnd
			? faker.date.soon({ days: faker.number.int({ min: 3, max: 90 }), refDate: start })
			: null;

		setProductId(prod.id);
		setName(faker.commerce.productName());
		setStartDate(DateTime.fromJSDate(start, { zone: TIMEZONE }).toISODate() ?? '');
		setEndDate(end ? (DateTime.fromJSDate(end, { zone: TIMEZONE }).toISODate() ?? '') : '');
		setRateType(faker.helpers.arrayElement(RATE_TYPES as readonly string[]));
		setRate(String(faker.number.float({ min: 5, max: 100, multipleOf: 0.01 }).toFixed(2)));
		setQuantity(String(faker.number.int({ min: 1, max: 3 })));
	}, [isOpen, products.length ?? 0]); // eslint-disable-line react-hooks/exhaustive-deps

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
