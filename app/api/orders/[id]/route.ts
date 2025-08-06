import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
	try {
		const body = await req.json();
		const { name, status, totalBudget, deliverableDueAt } = body;

		const updated = await prisma.order.update({
			where: { id: params.id },
			data: {
				name,
				status,
				totalBudget,
				deliverableDueAt: new Date(deliverableDueAt),
			},
		});

		return NextResponse.json(updated);
	} catch (error) {
		console.error('Error updating order:', error);
		return new NextResponse('Failed to update order', { status: 500 });
	}
}
