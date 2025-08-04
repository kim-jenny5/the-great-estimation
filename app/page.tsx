import { getOrderByIdOrFirst } from '@/util/queries';
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';
import Slider from '@/components/Slider';
import StatGroup from '@/components/StatGroup';
import LineItemsChart from '@/components/LineItemsChart';
import Footer from '@/components/Footer';

export default async function Dashboard() {
	const order = await getOrderByIdOrFirst();

	return (
		<>
			<Navbar />
			<main className='wrapper min-h-screen flex-col gap-y-6'>
				<Header name={order.name} status={order.status} deliverableDueAt={order.deliverableDueAt} />
				<StatGroup
					totalBudget={order.totalBudget.toNumber()}
					totalSpend={order.totalSpend?.toNumber() ?? 0}
					totalProducts={order.totalProducts ?? 0}
					totalLineItems={order.totalLineItems ?? 0}
				/>
				{/* <Slider order={order} />
				<LineItemsChart order={order} /> */}
				<Slider />
				<LineItemsChart />
			</main>
			<Footer />
		</>
	);
}
