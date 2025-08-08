import { DateTime } from 'luxon';

export const TIMEZONE = 'America/New_York';

export const formatInitials = (name: string) =>
	name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.toUpperCase();

export const formatPlaceholder = (placeholder: string) =>
	placeholder.replaceAll(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toLowerCase());

export const formatLabel = (label: string, { required = false }: { required?: boolean } = {}) => {
	const formattedLabel = label
		.replaceAll(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/^./, (str) => str.toUpperCase());

	return (
		<label htmlFor={label} className='block text-sm/6 font-medium text-gray-900'>
			{formattedLabel}
			{required && <span className='pl-0.5 text-red-500'>*</span>}
		</label>
	);
};

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

export const strippedDate = (date: string) => DateTime.fromISO(date).setZone(TIMEZONE);

// format dates for display on the UI
export const formatDate = (date: string) => strippedDate(date).toFormat('MMMM d, yyyy');
export const formatMonth = (date: string) => strippedDate(date).toFormat('MMMM d');

export const formatStartEndDates = (
	startDate: string,
	endDate?: string,
	options: { forAccessibility?: boolean } = {}
): string => {
	const { forAccessibility = false } = options;

	const start = strippedDate(startDate);
	const end = endDate ? strippedDate(endDate) : undefined;

	if (!end) return formatDate(startDate);

	if (forAccessibility) {
		return `${start.toFormat('MMMM d')}${endDate && ` to ${formatDate(endDate)}`}`;
	}

	const sameYear = start.year === end.year;
	const sameMonth = start.month === end.month;

	if (sameYear && sameMonth) {
		return `${start.toFormat('MMMM')} ${start.day}–${end.day}, ${start.year}`;
	}

	if (sameYear) {
		return `${start.toFormat('MMMM d')} – ${end.toFormat('MMMM d')}, ${start.year}`;
	}

	return `${formatDate(startDate)} – ${formatDate(endDate!)}`;
};
