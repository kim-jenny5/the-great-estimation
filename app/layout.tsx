import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
	title: 'The Great Estimation',
	description: 'Estimate campaign spend with clarity.',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className='antialiased'>
				<Navbar />
				<main className='min-h-screen p-8'>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
