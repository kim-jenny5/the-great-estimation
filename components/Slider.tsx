import { Slider as MultiSlider , Tooltip } from 'radix-ui';

export default function Slider() {
	const values = [25, 75]; // TODO: change this to state

	return (
		<form className='flex justify-center pt-4'>
			<MultiSlider.Root
				className='relative flex h-5 w-full touch-none items-center select-none'
				defaultValue={values}
				max={100} // TODO: change these to be dynamic
				step={1}
			>
				<MultiSlider.Track className='relative h-4 grow rounded-full bg-black/15'>
					<MultiSlider.Range className='absolute h-full rounded-full' />
				</MultiSlider.Track>
				{values.map((value, index) => (
					<Tooltip.Provider key={index} delayDuration={100}>
						<Tooltip.Root>
							<Tooltip.Trigger asChild>
								<MultiSlider.Thumb
									className='block h-7 w-5 cursor-grab rounded-full border bg-white shadow-xs shadow-black/40 hover:bg-neutral-800 focus:ring-3 focus:ring-neutral-800/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300'
									aria-label='Volume'
								/>
							</Tooltip.Trigger>
							<Tooltip.Portal>
								<Tooltip.Content
									className='rounded-full bg-black px-3 py-1.5 text-sm text-white shadow-md select-none'
									side='top'
									align='center'
								>
									{value}
									<Tooltip.Arrow className='mb-2 fill-black' />
								</Tooltip.Content>
							</Tooltip.Portal>
						</Tooltip.Root>
					</Tooltip.Provider>
				))}
			</MultiSlider.Root>
		</form>
	);
}
