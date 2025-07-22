import StatCard from './StatCard';

export default function StatGroup() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      <StatCard
        title='Total Estimated Revenue'
        value='$45,678.90'
        trend='+20% month over month'
        trendColor='positive'
      />
      <StatCard
        title='Impressions'
        value='2,405'
        trend='+33% month over month'
        trendColor='positive'
      />
      <StatCard title='CPM' value='$37.50' trend='-8% month over month' trendColor='negative' />
    </div>
  );
}
