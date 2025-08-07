import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LineItemsChart from '@/components/LineItemsChart';
import Navbar from '@/components/Navbar';
import Slider from '@/components/Slider';
import StatGroup from '@/components/StatGroup';
import { getCurrentUser, getOrderByIdOrFirst } from '@/util/queries';
import { StatusTypes } from '@/util/types';

export default async function Dashboard() {
	const user = await getCurrentUser();
	const order = await getOrderByIdOrFirst(user);

	const { status, totalBudget, totalSpend, productsCount, lineItemsCount, lineItems } = order;

	return (
		<>
			<Navbar user={user.name} />
			<main className='wrapper min-h-screen flex-col gap-y-6'>
				<Header order={{ ...order, status: status as StatusTypes }} />
				<StatGroup
					totalBudget={totalBudget}
					totalSpend={totalSpend}
					productsCount={productsCount}
					lineItemsCount={lineItemsCount}
				/>
				<Slider />
				<LineItemsChart orderId={order.id} lineItems={lineItems} />
			</main>
			<Footer />
		</>
	);
}
