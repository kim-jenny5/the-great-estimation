import { ReactNode } from 'react';
import { Dialog } from 'radix-ui';
import { XMarkIcon } from '@heroicons/react/24/solid';

type DrawerWrapperProps = {
	children: ReactNode;
	title: string;
	description: string;
};

export default function DrawerWrapper({ children, title, description }: DrawerWrapperProps) {
	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className='fixed inset-0 bg-black/50' />
				<Dialog.Content className='fixed top-0 right-0 z-50 h-full w-80 bg-white p-4 shadow-lg transition-transform duration-300 ease-in-out'>
					<div className='grid grid-cols-2 items-center'>
						<Dialog.Title className='col-start-1 row-start-1 text-2xl capitalize'>
							{title}
						</Dialog.Title>
						<Dialog.Description className='col-span-full row-start-2 text-sm'>
							{description}
						</Dialog.Description>
						<Dialog.Close asChild>
							<button className='col-start-2 row-start-1 w-fit cursor-pointer justify-center place-self-end rounded-full p-2 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300'>
								<XMarkIcon width={20} height={20} />
							</button>
						</Dialog.Close>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
