export type StatusColor = { bg: string; text: string } | undefined;

export const styleStatus = (status?: string): StatusColor => {
	switch (status) {
		case 'Pending': {
			return { bg: 'bg-gray-100', text: 'text-gray-800' };
		}
		case 'In progress': {
			return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
		}
		case 'Completed': {
			return { bg: 'bg-green-100', text: 'text-green-800' };
		}
		case 'Lost': {
			return { bg: 'bg-red-100', text: 'text-red-800' };
		}
		default: {
			return;
		}
	}
};

export const stylePercentage = (percentage: number) => {
	if (Math.abs(percentage - 1) < 1e-9) {
		return 'font-bold text-green-500';
	} else if (percentage > 1) {
		return 'font-bold text-red-500';
	} else {
		return 'font-medium text-neutral-500';
	}
};
