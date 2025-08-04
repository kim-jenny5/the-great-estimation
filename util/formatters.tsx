export const formatInitials = (name: string) =>
	name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.toUpperCase();

export const formatCurrency = (amount: number, options: { withCents?: boolean } = {}): string => {
	return amount.toLocaleString(`en-US`, {
		style: `currency`,
		currency: `USD`,
		minimumFractionDigits: options.withCents ? 2 : 0,
		maximumFractionDigits: options.withCents ? 2 : 0,
	});
};

export const formatPercentage = (value: number): string => {
	return value.toLocaleString(`en-US`, {
		style: `percent`,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		useGrouping: false,
	});
};

export const formatDate = (date: Date) =>
	date.toLocaleDateString(`en-US`, {
		month: `long`,
		day: `numeric`,
		year: `numeric`,
		timeZone: 'UTC',
	});

export const formatMonth = (date: Date) =>
	date.toLocaleDateString(`en-US`, { month: `long`, day: `numeric` });

export const formatStartEndDates = (
	startDate: Date,
	endDate?: Date,
	options: { forAccessibility?: boolean } = {}
): string => {
	const { forAccessibility = false } = options;

	if (!endDate) {
		return formatDate(startDate);
	}

	if (forAccessibility) {
		return `${formatMonth(startDate)} to ${formatDate(endDate)}`;
	}

	const sameYear = startDate.getFullYear() === endDate.getFullYear();
	const sameMonth = startDate.getMonth() === endDate.getMonth();

	if (sameYear && sameMonth) {
		const month = startDate.toLocaleDateString(`en-US`, { month: `long` });
		return `${month} ${startDate.getDate()}–${endDate.getDate()}, ${startDate.getFullYear()}`;
	}

	if (sameYear) {
		return `${formatMonth(startDate)} – ${formatMonth(endDate)}, ${startDate.getFullYear()}`;
	}

	return `${formatDate(startDate)} – ${formatDate(endDate)}`;
};
