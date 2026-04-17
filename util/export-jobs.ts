'use server';

import { headers } from 'next/headers';

import { prisma } from '@/prisma/client';

export type ExportJobSummary = {
	id: string;
	name: string;
	status: string;
	createdAt: string;
};

export async function createExportJob(orderId: string, orderName: string): Promise<{ jobId: string }> {
	const baseName = orderName
		.replaceAll(/[^\w]+/g, '-')
		.replaceAll(/^-|-$/g, '')
		.slice(0, 60) || 'Order';
	const name = `TGE Demo ${baseName}.xlsx`;

	const job = await prisma.exportJob.create({
		data: { name, status: 'pending' },
	});

	const h = await headers();
	const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
	const proto = h.get('x-forwarded-proto') ?? 'http';
	const url = `${proto}://${host}/api/export-jobs/${job.id}/process`;

	fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ orderId }),
	}).catch(console.error);

	return { jobId: job.id };
}

export async function getExportJobs(): Promise<ExportJobSummary[]> {
	const jobs = await prisma.exportJob.findMany({
		orderBy: { createdAt: 'desc' },
		take: 10,
		select: { id: true, name: true, status: true, createdAt: true },
	});

	return jobs.map((job) => ({
		...job,
		createdAt: job.createdAt.toISOString(),
	}));
}
