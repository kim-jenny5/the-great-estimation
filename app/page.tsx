import { getCurrentUser, getOrderByIdOrFirst } from '@/util/queries';
import { formatStartEndDates } from '@/util/formatters';
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';
import Slider from '@/components/Slider';
import StatGroup from '@/components/StatGroup';
import LineItemsChart from '@/components/LineItemsChart';
import Footer from '@/components/Footer';

export default async function Dashboard() {
	const user = await getCurrentUser();
	const order = await getOrderByIdOrFirst();

	const lineItems = order.lineItems.map((item) => ({
		...item,
		startDate: item.startDate.toISOString(),
		endDate: item.endDate ? item.endDate.toISOString() : null,
		rate: item.rate.toString(),
		subtotal: item.subtotal.toString(),
		product: {
			name: item.product.name,
		},
	}));

	return (
		<>
			<Navbar user={user.name} />
			<main className='wrapper min-h-screen flex-col gap-y-6'>
				<Header name={order.name} status={order.status} deliverableDueAt={order.deliverableDueAt} />
				<StatGroup
					totalBudget={order.totalBudget.toNumber()}
					totalSpend={order.totalSpend?.toNumber() ?? 0}
					totalProducts={order.totalProducts ?? 0}
					totalLineItems={order.totalLineItems ?? 0}
				/>
				<Slider />
				<LineItemsChart lineItems={lineItems} />
			</main>
			<Footer />
		</>
	);
}
