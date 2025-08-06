'use client';

import { useState } from 'react';

import { resetDatabase } from '@/util/queries';

import NotificationBanner from './NotificationBanner';

export default function ResetDatabaseBtn() {
	const [showNotification, setShowNotification] = useState(false);

	const handleReset = async () => {
		await resetDatabase();
		setShowNotification(true);
		setTimeout(() => setShowNotification(false), 3300);
	};

	return (
		<>
			<button
				onClick={handleReset}
				className='cursor-pointer rounded border border-red-600 bg-white px-2 py-1.5 text-xs font-semibold text-red-600 uppercase hover:bg-red-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300'
			>
				Reset Data
			</button>
			{showNotification && <NotificationBanner />}
		</>
	);
}
