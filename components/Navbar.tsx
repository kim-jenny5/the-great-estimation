import ConstructionBanner from '@/components/ConstructionBanner';
import ResetDatabaseBtn from './ResetDatabaseBtn';
import { formatInitials } from '@/util/formatters';

export default function Navbar({ user }: { user: string }) {
	return (
		<>
			<ConstructionBanner />
			{/* remove pt-12 upon construction banner removal */}
			<nav className='wrapper items-center justify-between border-b border-black/25 pt-12'>
				<div className='flex flex-col text-xl leading-none font-black tracking-tight text-neutral-800'>
					The Great Estimation
				</div>
				<div className='flex items-center gap-x-4'>
					<ResetDatabaseBtn />
					<div className='flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-800'>
						{formatInitials(user)}
					</div>
				</div>
			</nav>
		</>
	);
}
