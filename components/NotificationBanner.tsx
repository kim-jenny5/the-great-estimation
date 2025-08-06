'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function NotificationBanner() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const enterTimeout = setTimeout(() => setVisible(true), 10);
		const exitTimeout = setTimeout(() => setVisible(false), 3010);

		return () => {
			clearTimeout(enterTimeout);
			clearTimeout(exitTimeout);
		};
	}, []);

	return (
		<div
			className={`fixed top-4 right-4 z-50 flex transform items-center gap-x-2 rounded-md bg-white p-3 text-sm text-gray-800 shadow-lg ring-1 ring-gray-900/10 transition-all duration-400 ${
				visible ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-8 opacity-0'
			}`}
		>
			<CheckCircleIcon width={20} height={20} className='text-green-500' />
			Successfully reset!
		</div>
	);
}
