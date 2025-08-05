import { DateTime } from 'luxon';

import { prisma } from '@/prisma/client';

function toESTDate(date: string) {
	return DateTime.fromISO(date, { zone: 'America/New_York' }).toUTC().toJSDate();
}

async function main() {
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
			deliverableDueAt: toESTDate('2025-08-18'),
		},
	});

	const [newsletter, sponsored, displayAd] = await prisma.$transaction([
		prisma.product.create({ data: { name: 'Newsletter' } }),
		prisma.product.create({ data: { name: 'Sponsored Article' } }),
		prisma.product.create({ data: { name: 'Display Ads' } }),
	]);

	await prisma.lineItem.createMany({
		data: [
			{
				orderId: nikeOrder.id,
				productId: newsletter.id,
				name: 'Back to School',
				startDate: toESTDate('2025-08-01'),
				type: 'Flat',
				rate: 2500,
				quantity: 1,
				subtotal: 2500,
			},
			{
				orderId: nikeOrder.id,
				productId: newsletter.id,
				name: 'Labor Day',
				startDate: toESTDate('2025-08-18'),
				type: 'Flat',
				rate: 3000,
				quantity: 1,
				subtotal: 3000,
			},
			{
				orderId: nikeOrder.id,
				productId: sponsored.id,
				name: 'Fall Fashion Feature',
				startDate: toESTDate('2025-08-25'),
				endDate: toESTDate('2025-11-14'),
				type: 'Flat',
				rate: 4000,
				quantity: 1,
				subtotal: 4000,
			},
			{
				orderId: nikeOrder.id,
				productId: displayAd.id,
				name: 'Homepage Takeover',
				startDate: toESTDate('2025-08-15'),
				endDate: toESTDate('2025-08-17'),
				type: 'Flat',
				rate: 5000,
				quantity: 1,
				subtotal: 5000,
			},
			{
				orderId: nikeOrder.id,
				productId: displayAd.id,
				name: 'Sidebar Ad',
				startDate: toESTDate('2025-08-20'),
				endDate: toESTDate('2025-08-31'),
				type: 'CPM',
				rate: 1500,
				quantity: 2,
				subtotal: 3000,
			},
		],
	});

	console.log('🌱 Seed complete');
}

try {
	await main();
} catch (error) {
	console.error('❌ Seed error:', error);
	throw error;
} finally {
	await prisma.$disconnect();
}
