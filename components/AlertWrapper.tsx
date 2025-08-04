import { ReactNode } from 'react';
import { AlertDialog } from 'radix-ui';

export default function AlertWrapper({ children }: { children: ReactNode }) {
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className='fixed inset-0 z-40 bg-black/50' />
				<AlertDialog.Content className='fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none'>
					<AlertDialog.Title className='text-lg font-semibold'>Are you sure?</AlertDialog.Title>
					<AlertDialog.Description className='mt-2 text-sm text-gray-600'>
						This action cannot be undone.
					</AlertDialog.Description>
					<div className='mt-6 flex justify-end gap-4'>
						<AlertDialog.Cancel asChild>
							<button className='cursor-pointer rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
								Cancel
							</button>
						</AlertDialog.Cancel>
						<AlertDialog.Action asChild>
							<button className='cursor-pointer rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600'>
								Delete
							</button>
						</AlertDialog.Action>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}
