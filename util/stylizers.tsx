export type StatusColor = { bg: string; text: string } | undefined;

export const styleStatus = (status?: string): StatusColor => {
	switch (status) {
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
