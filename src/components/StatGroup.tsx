import StatCard from './StatCard';

export default function StatGroup() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      <StatCard title='Total Budget' value={45000} />
      <StatCard title='Total Spend' value={12000} />
    </div>
  );
}
