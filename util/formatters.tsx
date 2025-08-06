import { DateTime } from 'luxon';

const TIMEZONE = 'America/New_York';

export const formatInitials = (name: string) =>
	name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.toUpperCase();

export const formatCurrency = (amount: number): string => {
	return amount.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

export const formatPercentage = (value: number): string => {
	return value.toLocaleString('en-US', {
		style: 'percent',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		useGrouping: false,
	});
};

// formats dates for database storing
export const convertToUTC = (date: string) =>
	DateTime.fromISO(date).setZone(TIMEZONE).toUTC().toJSDate();

// format dates for display on the UI
export const formatDate = (date: string) =>
	DateTime.fromISO(date).setZone(TIMEZONE).toFormat('MMMM d, yyyy');

export const formatMonth = (date: string) =>
	DateTime.fromISO(date).setZone(TIMEZONE).toFormat('MMMM d');

export const formatStartEndDates = (
	startDate: string,
	endDate?: string,
	options: { forAccessibility?: boolean } = {}
): string => {
	const { forAccessibility = false } = options;

	const start = DateTime.fromISO(startDate).setZone(TIMEZONE);
	const end = endDate ? DateTime.fromISO(endDate).setZone(TIMEZONE) : undefined;

	if (!end) return start.toFormat('MMMM d, yyyy');

	if (forAccessibility) return `${start.toFormat('MMMM d')} to ${end.toFormat('MMMM d, yyyy')}`;

	const sameYear = start.year === end.year;
	const sameMonth = start.month === end.month;

	if (sameYear && sameMonth) {
		return `${start.toFormat('MMMM')} ${start.day}–${end.day}, ${start.year}`;
	}

	if (sameYear) {
		return `${start.toFormat('MMMM d')} – ${end.toFormat('MMMM d')}, ${start.year}`;
	}

	return `${start.toFormat('MMMM d, yyyy')} – ${end.toFormat('MMMM d, yyyy')}`;
};
