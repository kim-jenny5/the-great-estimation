import StatCard from './StatCard';

export default function StatGroup() {
  const totalBudget = 45000;
  const totalSpend = 12000;
  const percentage = totalSpend / totalBudget;

  return (
    <div className='card bg-white'>
      <dl className='grid grid-cols-2 divide-x divide-neutral-300'>
        <StatCard title='Total Budget' value={totalBudget} />
        <StatCard title='Total Spend' value={totalSpend} percentage={percentage} />
      </dl>
    </div>
  );
}
