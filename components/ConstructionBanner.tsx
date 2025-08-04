export default function ConstructionBanner() {
	return (
		<div className='fixed top-0 z-50 w-full bg-orange-100 px-4 py-2 text-center text-sm font-semibold text-orange-600'>
			🚧 This project is still under construction. Check out the progress on
			{` `}
			<a
				href='https://github.com/kim-jenny5/the-great-estimation'
				target='_blank'
				rel='noopener noreferrer'
				className='underline hover:text-orange-800'
			>
				GitHub
			</a>
			. 🚧
		</div>
	);
}
