type StatCardProps = {
  title: string;
  value: string | number;
  trend?: string;
  trendColor?: 'positive' | 'negative' | 'neutral';
};

export default function StatCard({ title, value, trend, trendColor = 'neutral' }: StatCardProps) {
  const trendTextColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500',
  };

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
      <div className='text-sm font-medium text-gray-500'>{title}</div>
      <div className='mt-1 text-3xl font-bold text-black'>{value}</div>
      {trend && <div className={`mt-2 text-sm ${trendTextColor[trendColor]}`}>{trend}</div>}
    </div>
  );
}
