// prisma/repopulate.ts
import { faker } from '@faker-js/faker';

import { prisma } from '@/prisma/client';
import { convertToUTC } from '@/util/formatters';
import { RATE_TYPES } from '@/util/types';

export async function repopulate() {
	await prisma.$transaction(async (tx) => {
		// 1) Ensure user
		const jenny = await tx.user.upsert({
			where: { email: 'jennykimdev@gmail.com' },
			update: { name: 'Jenny Kim' },
			create: { name: 'Jenny Kim', email: 'jennykimdev@gmail.com' },
		});

		// 2) Ensure products (one-and-done; skips if they exist)
		const productNames = [
			'Newsletter',
			'Sponsored Article',
			'Display Ads',
			'Social Media Post',
			'Podcast Ad',
			'Homepage Takeover',
			'Branded Video',
			'Event Sponsorship',
		];

		await tx.product.createMany({
			data: productNames.map((name) => ({ name })),
			skipDuplicates: true, // requires @unique on Product.name
		});

		const products = await tx.product.findMany({
			where: { name: { in: productNames } },
			select: { id: true, name: true },
		});
		const byName = Object.fromEntries(products.map((p) => [p.name, p.id]));

		// 3) Ensure order (unique on [creatorId, name])
		const order = await tx.order.upsert({
			where: { creatorId_name: { creatorId: jenny.id, name: 'Nike – Back to School – Q3 2025' } },
			update: {}, // leave existing as-is; totals recalculated below
			create: {
				name: 'Nike – Back to School – Q3 2025',
				creatorId: jenny.id,
				status: 'In progress',
				totalBudget: 0,
				totalSpend: 0,
				productsCount: 0,
				lineItemsCount: 0,
				deliverableDueAt: convertToUTC('2025-08-18'),
			},
		});

		// 4) Build items (random but stable shape). If called twice without wipe:
		//    createMany(skipDuplicates) ensures no duplicate line items by (orderId, name)
		const items = [
			{ name: 'Back to School', productName: 'Newsletter', start: '2025-08-01' },
			{ name: 'Labor Day', productName: 'Newsletter', start: '2025-08-18' },
			{
				name: 'Fall Fashion Feature',
				productName: 'Sponsored Article',
				start: '2025-08-25',
				end: '2025-11-14',
			},
			{
				name: 'Homepage Takeover',
				productName: 'Display Ads',
				start: '2025-08-15',
				end: '2025-08-17',
			},
			{ name: 'Sidebar Ad', productName: 'Display Ads', start: '2025-08-20', end: '2025-08-31' },
		];

		const itemsData = items.map((it) => {
			const rate = faker.number.float({ min: 5, max: 100, multipleOf: 0.01 });
			const quantity = faker.number.int({ min: 1, max: 3 });
			return {
				orderId: order.id,
				productId: byName[it.productName],
				name: it.name,
				startDate: convertToUTC(it.start),
				endDate: it.end ? convertToUTC(it.end) : null,
				rateType: faker.helpers.arrayElement(RATE_TYPES),
				rate,
				quantity,
				subtotal: rate * quantity,
			};
		});

		await tx.lineItem.createMany({
			data: itemsData,
			skipDuplicates: true, // requires @@unique([orderId, name])
		});

		// 5) Recalculate order totals from DB (covers both fresh + incremental runs)
		const litems = await tx.lineItem.findMany({
			where: { orderId: order.id },
			select: { productId: true, subtotal: true },
		});

		const totalSpend = litems.reduce((s, li) => s + Number(li.subtotal), 0);
		const productsCount = new Set(litems.map((li) => li.productId)).size;
		const lineItemsCount = litems.length;
		const totalBudget = Math.ceil((totalSpend * 1.5) / 50) * 50; // deterministic formula

		await tx.order.update({
			where: { id: order.id },
			data: { totalSpend, productsCount, lineItemsCount, totalBudget },
		});
	});

	console.log('Data repopulated. 📦');
}
