export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LineItemsChart from '@/components/LineItemsChart';
import Navbar from '@/components/Navbar';
import Slider from '@/components/Slider';
import StatGroup from '@/components/StatGroup';
import { getCurrentUser, getOrderByIdOrFirst } from '@/util/queries';

export default async function Dashboard() {
	let user, order;

	try {
		user = await getCurrentUser();
		order = await getOrderByIdOrFirst(user);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Error fetching data:', error);

		return (
			<>
				<Navbar user='Demo User' />
				<main className='wrapper min-h-[calc(100vh-153px)] flex-col'>
					<h1 className='text-xl font-semibold'>App unavailable</h1>
					<p className='text-sm text-gray-600'>Please try again in a moment.</p>
				</main>
				<Footer />
			</>
		);
	}

	const { totalBudget, totalSpend, productsCount, lineItemsCount, lineItems } = order;

	return (
		<>
			<Navbar user={user.name} />
			<main className='wrapper min-h-screen flex-col gap-y-6'>
				<Header order={{ ...order }} />
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
