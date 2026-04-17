import { NextResponse } from 'next/server';

import { processExportJob } from '@/util/process-export-job';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id: jobId } = await params;
	const { orderId } = await _request.json();
	processExportJob(jobId, orderId).catch(console.error);

	return NextResponse.json({ ok: true });
}
