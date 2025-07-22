import Header from './components/Header';
import Slider from './components/Slider';
import StatGroup from './components/StatGroup';

export default function Dashboard() {
  return (
    <div className='wrapper flex-col gap-y-6'>
      <Header />
      <StatGroup />
      <Slider />
    </div>
  );
}
