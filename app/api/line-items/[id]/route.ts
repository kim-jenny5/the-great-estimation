import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
	const { id } = await params;

	try {
		const deleted = await prisma.lineItem.delete({ where: { id } });
		return NextResponse.json(deleted);
	} catch (error) {
		console.error('Error deleting line item:', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
