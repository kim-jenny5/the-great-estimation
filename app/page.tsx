import DashboardView from '@/components/DashboardView';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import { getCurrentUser, getOrderByIdOrFirst } from '@/util/queries';

export default async function Dashboard() {
	const user = await getCurrentUser();
	const order = await getOrderByIdOrFirst(user);

	const { totalBudget, totalSpend, productsCount, lineItemsCount, lineItems } = order;

	return (
		<>
			<Navbar user={user.name} />
			<main className='wrapper min-h-screen flex-col gap-y-6'>
				<Header order={{ ...order }} />
				<DashboardView
					orderId={order.id}
					totalBudget={totalBudget}
					totalSpend={totalSpend}
					productsCount={productsCount}
					lineItemsCount={lineItemsCount}
					lineItems={lineItems}
				/>
			</main>
			<Footer />
		</>
	);
}
