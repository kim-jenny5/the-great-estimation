import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';

import { prisma } from '@/prisma/client';
import { TIMEZONE, convertToUTC } from '@/util/formatters';
import { RATE_TYPES } from '@/util/types';

const fakeLineItem = (orderId: string, productId: string) => {
	const start = faker.date.soon({ days: 30 });
	const maybeHasEnd = faker.datatype.boolean();
	const end = maybeHasEnd
		? faker.date.soon({ days: faker.number.int({ min: 3, max: 90 }), refDate: start })
		: null;

	const rateType = faker.helpers.arrayElement(RATE_TYPES as readonly string[]);
	const rate = faker.number.float({ min: 5, max: 100, multipleOf: 0.01 });
	const quantity = faker.number.int({ min: 1, max: 5 });
	const subtotal = rate * quantity;

	return {
		orderId,
		productId,
		name: faker.commerce.productName(),
		startDate: convertToUTC(DateTime.fromJSDate(start, { zone: TIMEZONE }).toISO() ?? ''),
		endDate: end ? convertToUTC(DateTime.fromJSDate(end, { zone: TIMEZONE }).toISO() ?? '') : null,
		rateType,
		rate,
		quantity,
		subtotal,
	};
};

export async function seed() {
	const jenny = await prisma.user.create({
		data: { name: 'Jenny Kim', email: 'jennykimdev@gmail.com' },
	});

	const nikeOrder = await prisma.order.create({
		data: {
			name: 'Nike – Back to School – Q3 2025',
			creatorId: jenny.id,
			status: 'In progress',
			totalBudget: 45_000,
			totalSpend: 17_500,
			productsCount: 3,
			lineItemsCount: 5,
			deliverableDueAt: convertToUTC('2025-08-18'),
		},
	});

	const [newsletter, sponsored, displayAd] = await prisma.$transaction([
		prisma.product.create({ data: { name: 'Newsletter' } }),
		prisma.product.create({ data: { name: 'Sponsored Article' } }),
		prisma.product.create({ data: { name: 'Display Ads' } }),
		prisma.product.create({ data: { name: 'Social Media Post' } }),
		prisma.product.create({ data: { name: 'Podcast Ad' } }),
		prisma.product.create({ data: { name: 'Homepage Takeover' } }),
		prisma.product.create({ data: { name: 'Branded Video' } }),
		prisma.product.create({ data: { name: 'Event Sponsorship' } }),
	]);

	// await prisma.lineItem.createMany({
	// 	data: [
	// 		{
	// 			orderId: nikeOrder.id,
	// 			productId: newsletter.id,
	// 			name: 'Back to School',
	// 			startDate: convertToUTC('2025-08-01'),
	// 			rateType: 'Flat',
	// 			rate: 2500,
	// 			quantity: 1,
	// 			subtotal: 2500,
	// 		},
	// 		{
	// 			orderId: nikeOrder.id,
	// 			productId: newsletter.id,
	// 			name: 'Labor Day',
	// 			startDate: convertToUTC('2025-08-18'),
	// 			rateType: 'Flat',
	// 			rate: 3000,
	// 			quantity: 1,
	// 			subtotal: 3000,
	// 		},
	// 		{
	// 			orderId: nikeOrder.id,
	// 			productId: sponsored.id,
	// 			name: 'Fall Fashion Feature',
	// 			startDate: convertToUTC('2025-08-25'),
	// 			endDate: convertToUTC('2025-11-14'),
	// 			rateType: 'Flat',
	// 			rate: 4000,
	// 			quantity: 1,
	// 			subtotal: 4000,
	// 		},
	// 		{
	// 			orderId: nikeOrder.id,
	// 			productId: displayAd.id,
	// 			name: 'Homepage Takeover',
	// 			startDate: convertToUTC('2025-08-15'),
	// 			endDate: convertToUTC('2025-08-17'),
	// 			rateType: 'Flat',
	// 			rate: 5000,
	// 			quantity: 1,
	// 			subtotal: 5000,
	// 		},
	// 		{
	// 			orderId: nikeOrder.id,
	// 			productId: displayAd.id,
	// 			name: 'Sidebar Ad',
	// 			startDate: convertToUTC('2025-08-20'),
	// 			endDate: convertToUTC('2025-08-31'),
	// 			rateType: 'CPM',
	// 			rate: 1500,
	// 			quantity: 2,
	// 			subtotal: 3000,
	// 		},
	// 	],
	// });
	await prisma.lineItem.createMany({
		data: [
			fakeLineItem(nikeOrder.id, newsletter.id),
			fakeLineItem(nikeOrder.id, newsletter.id),
			fakeLineItem(nikeOrder.id, sponsored.id),
			fakeLineItem(nikeOrder.id, displayAd.id),
			fakeLineItem(nikeOrder.id, displayAd.id),
		],
	});

	console.log('🌱 Seed complete');
}

// called if seeding is run directly inside the terminal
if (import.meta.url === `file://${process.argv[1]}`) {
	try {
		await seed();
	} catch (error) {
		throw new Error(`❌ Seed error: ${error}`);
	} finally {
		await prisma.$disconnect();
	}
}
