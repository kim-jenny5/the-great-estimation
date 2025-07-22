import { useState } from 'react';

export default function Header() {
  const [isHovering, setIsHovering] = useState(false);

  const handleExport = () => {
    console.log('exporting in process');
  };

  const handleEdit = () => {
    console.log('editing in process');
  };

  const handleHover = () => {
    console.log('hovering over the date');
    setIsHovering(!!isHovering ? false : true);
  };

  return (
    <div className='flex h-full w-full flex-col gap-y-2'>
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-x-3'>
          <span className='text-3xl font-medium tracking-tight'>
            Nike – Back to School – Q3 2025
          </span>
          <span className='inline-flex h-fit w-fit items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700'>
            Draft
          </span>
        </div>
        <div className='flex gap-x-4'>
          <button
            onClick={handleExport}
            className='rounded-sm bg-black/5 px-3 py-1.5 text-sm font-medium'
          >
            Export
          </button>
          <button
            onClick={handleEdit}
            className='rounded-sm bg-black px-3 py-1.5 text-sm font-medium text-white'
          >
            Edit
          </button>
        </div>
      </div>
      <div className='text-sm'>
        <span onMouseOver={handleHover} onMouseLeave={handleHover} className='inline-block'>
          Last updated: July 22, 2025
        </span>
        <span
          className={`ml-1 inline-block transform transition-all duration-300 ease-in-out ${
            isHovering
              ? 'translate-x-0 text-gray-500 opacity-100'
              : 'pointer-events-none -translate-x-1 opacity-0'
          }`}
        >
          by Jenny Kim
        </span>
      </div>
    </div>
  );
}
