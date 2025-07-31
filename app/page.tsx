import ConstructionBanner from '@/components/ConstructionBanner';
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';
import Slider from '@/components/Slider';
import StatGroup from '@/components/StatGroup';
import LineItemsChart from '@/components/LineItemsChart';
import Footer from '@/components/Footer';

export default function Dashboard() {
  return (
    <>
      <ConstructionBanner />
      <Navbar />
      <main className='wrapper min-h-screen flex-col gap-y-6'>
        <Header />
        <StatGroup />
        <Slider />
        <LineItemsChart />
      </main>
      <Footer />
    </>
  );
}
