import { faker } from '@faker-js/faker';

import { prisma } from '@/prisma/client';
import { convertToUTC } from '@/util/formatters';
import { RATE_TYPES } from '@/util/types';

export async function seed() {
	const jenny = await prisma.user.create({
		data: { name: 'Jenny Kim', email: 'jennykimdev@gmail.com' },
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

	const items = [
		{
			productId: newsletter.id,
			name: 'Back to School',
			startDate: '2025-08-01',
		},
		{ productId: newsletter.id, name: 'Labor Day', startDate: '2025-08-18' },
		{
			productId: sponsored.id,
			name: 'Fall Fashion Feature',
			startDate: '2025-08-25',
			endDate: '2025-11-14',
		},
		{
			productId: displayAd.id,
			name: 'Homepage Takeover',
			startDate: '2025-08-15',
			endDate: '2025-08-17',
		},
		{
			productId: displayAd.id,
			name: 'Sidebar Ad',
			startDate: '2025-08-20',
			endDate: '2025-08-31',
		},
	];

	const itemsData = items.map((item) => {
		const rate = faker.number.float({ min: 5, max: 100, multipleOf: 0.01 });
		const quantity = faker.number.int({ min: 1, max: 3 });

		return {
			...item,
			startDate: convertToUTC(item.startDate),
			endDate: item.endDate ? convertToUTC(item.endDate) : null,
			rateType: faker.helpers.arrayElement(RATE_TYPES),
			rate,
			quantity,
			subtotal: rate * quantity,
		};
	});

	const totalSpend = itemsData.reduce((sum, i) => sum + i.subtotal, 0);
	const totalBudget =
		Math.round((totalSpend * faker.number.float({ min: 1, max: 3, multipleOf: 0.01 })) / 50) * 50;
	const productsCount = new Set(itemsData.map((i) => i.productId)).size;

	await prisma.$transaction(async (tx) => {
		const nikeOrder = await tx.order.create({
			data: {
				name: 'Nike – Back to School – Q3 2025',
				creatorId: jenny.id,
				status: 'In progress',
				totalBudget,
				totalSpend,
				productsCount,
				lineItemsCount: itemsData.length,
				deliverableDueAt: convertToUTC('2025-08-18'),
			},
		});

		await tx.lineItem.createMany({
			data: itemsData.map((i) => ({ ...i, orderId: nikeOrder.id })),
		});
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
