'use client';

import { resetDatabase } from '@/util/queries';

export default function ResetDatabaseBtn() {
	return (
		<form action={resetDatabase}>
			<button
				type='submit'
				className='cursor-pointer rounded border border-red-600 bg-white px-2 py-1.5 text-xs font-bold text-red-600 uppercase hover:bg-red-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300'
			>
				Reset Data
			</button>
		</form>
	);
}
