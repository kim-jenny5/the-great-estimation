import ConstructionBanner from '@/components/ConstructionBanner';

export default function Navbar() {
  return (
    <>
      <ConstructionBanner />
      {/* remove pt-12 upon construction banner removal */}
      <nav className='wrapper items-center justify-between border-b border-black/25 pt-12'>
        <div className='flex flex-col text-xl leading-none font-black tracking-tight text-neutral-800'>
          The Great Estimation
        </div>
        <div className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-800'>
          JK
        </div>
      </nav>
    </>
  );
}
