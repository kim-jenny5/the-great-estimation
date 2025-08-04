import { prisma } from '@/prisma/client';

async function main() {
	// Clean slate
	await prisma.lineItem.deleteMany();
	await prisma.order.deleteMany();
	await prisma.user.deleteMany();
	await prisma.product.deleteMany();
	console.log(`🩵 Database reset 🩵`);

	// Insert user
	const jenny = await prisma.user.create({
		data: { name: `Jenny Kim`, email: `jennykimdev@gmail.com` },
	});

	// Insert order
	const nikeOrder = await prisma.order.create({
		data: {
			name: `Nike – Back to School – Q3 2025`,
			creatorId: jenny.id,
			status: `In progress`,
			totalBudget: 45000,
			deliverableDueAt: new Date('2025-08-18'),
		},
	});

	// Insert products
	const insertedProducts = await prisma.$transaction([
		prisma.product.create({ data: { name: `Newsletter` } }),
		prisma.product.create({ data: { name: `Sponsored Article` } }),
		prisma.product.create({ data: { name: `Display Ads` } }),
	]);

	const newsletter = insertedProducts.find((p) => p.name === `Newsletter`)!;
	const sponsored = insertedProducts.find((p) => p.name === `Sponsored Article`)!;
	const displayAd = insertedProducts.find((p) => p.name === `Display Ads`)!;

	// Insert line items
	const lineItemData = [
		{
			orderId: nikeOrder.id,
			productId: newsletter.id,
			name: `Back to School`,
			startDate: new Date(`2025-08-01`),
			type: `Flat`,
			rate: 2500,
			quantity: 1,
			subtotal: 2500,
		},
		{
			orderId: nikeOrder.id,
			productId: newsletter.id,
			name: `Labor Day`,
			startDate: new Date(`2025-08-18`),
			type: `Flat`,
			rate: 3000,
			quantity: 1,
			subtotal: 3000,
		},
		{
			orderId: nikeOrder.id,
			productId: sponsored.id,
			name: `Fall Fashion Feature`,
			startDate: new Date(`2025-08-25`),
			endDate: new Date(`2025-11-14`),
			type: `Flat`,
			rate: 4000,
			quantity: 1,
			subtotal: 4000,
		},
		{
			orderId: nikeOrder.id,
			productId: displayAd.id,
			name: `Homepage Takeover`,
			startDate: new Date(`2025-08-15`),
			endDate: new Date(`2025-08-17`),
			type: `Flat`,
			rate: 5000,
			quantity: 1,
			subtotal: 5000,
		},
		{
			orderId: nikeOrder.id,
			productId: displayAd.id,
			name: `Sidebar Ad`,
			startDate: new Date(`2025-08-20`),
			endDate: new Date(`2025-08-31`),
			type: `CPM`,
			rate: 1500,
			quantity: 2,
			subtotal: 3000,
		},
	];

	await prisma.lineItem.createMany({ data: lineItemData });

	console.log(`🌱 Seed complete 🌱`);
}

try {
	await main();
} catch (error) {
	console.error(`❌ Seed error:`, error);
	throw error;
} finally {
	await prisma.$disconnect();
}
