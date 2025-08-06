import { prisma } from '@/prisma/client';
import { convertToUTC } from '@/util/formatters';

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
	]);
	// 	const [
	// 	newsletter,
	// 	sponsored,
	// 	displayAd,
	// 	socialPost,
	// 	podcastAd,
	// 	homepageTakeover,
	// 	brandedVideo,
	// 	eventSponsorship,
	// ] = await prisma.$transaction([
	// 	prisma.product.create({ data: { name: 'Newsletter' } }),
	// 	prisma.product.create({ data: { name: 'Sponsored Article' } }),
	// 	prisma.product.create({ data: { name: 'Display Ads' } }),
	// 	prisma.product.create({ data: { name: 'Social Media Post' } }),
	// 	prisma.product.create({ data: { name: 'Podcast Ad' } }),
	// 	prisma.product.create({ data: { name: 'Homepage Takeover' } }),
	// 	prisma.product.create({ data: { name: 'Branded Video' } }),
	// 	prisma.product.create({ data: { name: 'Event Sponsorship' } }),
	// ]);

	await prisma.lineItem.createMany({
		data: [
			{
				orderId: nikeOrder.id,
				productId: newsletter.id,
				name: 'Back to School',
				startDate: convertToUTC('2025-08-01'),
				type: 'Flat',
				rate: 2500,
				quantity: 1,
				subtotal: 2500,
			},
			{
				orderId: nikeOrder.id,
				productId: newsletter.id,
				name: 'Labor Day',
				startDate: convertToUTC('2025-08-18'),
				type: 'Flat',
				rate: 3000,
				quantity: 1,
				subtotal: 3000,
			},
			{
				orderId: nikeOrder.id,
				productId: sponsored.id,
				name: 'Fall Fashion Feature',
				startDate: convertToUTC('2025-08-25'),
				endDate: convertToUTC('2025-11-14'),
				type: 'Flat',
				rate: 4000,
				quantity: 1,
				subtotal: 4000,
			},
			{
				orderId: nikeOrder.id,
				productId: displayAd.id,
				name: 'Homepage Takeover',
				startDate: convertToUTC('2025-08-15'),
				endDate: convertToUTC('2025-08-17'),
				type: 'Flat',
				rate: 5000,
				quantity: 1,
				subtotal: 5000,
			},
			{
				orderId: nikeOrder.id,
				productId: displayAd.id,
				name: 'Sidebar Ad',
				startDate: convertToUTC('2025-08-20'),
				endDate: convertToUTC('2025-08-31'),
				type: 'CPM',
				rate: 1500,
				quantity: 2,
				subtotal: 3000,
			},
		],
	});

	console.log('🌱 Seed complete');
}

// called if seeding is run directly inside the terminal
/* eslint-disable-next-line unicorn/prefer-module */
if (require.main === module) {
	try {
		await seed();
	} catch (error) {
		console.error('❌ Seed error:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}
