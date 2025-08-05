import { getCurrentUser, getOrderByIdOrFirst } from '@/util/queries';
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';
import Slider from '@/components/Slider';
import StatGroup from '@/components/StatGroup';
import LineItemsChart from '@/components/LineItemsChart';
import Footer from '@/components/Footer';

export default async function Dashboard() {
	const user = await getCurrentUser();
	const order = await getOrderByIdOrFirst();

	const { totalBudget, totalSpend, productsCount, lineItemsCount, lineItems } = order;

	return (
		<>
			<Navbar user={user.name} />
			<main className='wrapper min-h-screen flex-col gap-y-6'>
				<Header order={order} />
				<StatGroup
					totalBudget={totalBudget}
					totalSpend={totalSpend}
					productsCount={productsCount}
					lineItemsCount={lineItemsCount}
				/>
				<Slider />
				<LineItemsChart lineItems={lineItems} />
			</main>
			<Footer />
		</>
	);
}
