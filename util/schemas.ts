import { z } from 'zod';

export const lineItemFormSchema = z
	.object({
		productId: z.string().optional(),
		name: z.string().min(1, 'Name is required'),
		startDate: z.string().min(1, 'Start date is required'),
		endDate: z.string().optional(),
		rateType: z.string().optional(),
		rate: z.string().optional(),
		quantity: z.string().min(1, 'Quantity is required'),
	})
	.superRefine((data, ctx) => {
		if (data.endDate && data.startDate && data.endDate < data.startDate) {
			ctx.addIssue({
				code: 'custom',
				message: 'End date must be on or after start date',
				path: ['endDate'],
			});
		}
		if (data.quantity) {
			const n = Number.parseInt(data.quantity, 10);
			if (Number.isNaN(n) || n < 1 || n > 9999) {
				ctx.addIssue({
					code: 'custom',
					message: 'Quantity must be between 1 and 9999',
					path: ['quantity'],
				});
			}
		}
		if (data.rate) {
			const n = Number.parseFloat(data.rate);
			if (Number.isNaN(n) || n < 0) {
				ctx.addIssue({
					code: 'custom',
					message: 'Rate must be a valid positive number',
					path: ['rate'],
				});
			}
		}
	});

export const updateOrderFormSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	status: z.string().optional(),
	totalBudget: z.number().min(0, 'Total budget must be 0 or greater'),
	deliverableDueAt: z.string().min(1, 'Deliverable due date is required'),
});
