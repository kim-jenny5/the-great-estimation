// import { useState } from 'react';

type StatusColor = { bg: string; text: string } | undefined;

export default function Header() {
  const status = 'In progress'; // change later

  const getStatusColor = (status?: string): StatusColor => {
    switch (status) {
      case 'In progress':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      case 'Completed':
        return { bg: 'bg-green-100', text: 'text-green-800' };
      case 'Lost':
        return { bg: 'bg-red-100', text: 'text-red-800' };
      default:
        return;
    }
  };

  const handleExport = () => {
    console.log('exporting in process');
  };

  const handleEdit = () => {
    console.log('editing in process');
  };

  return (
    <div className='flex h-full w-full flex-col gap-y-2'>
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-x-3'>
          <div className='text-3xl font-medium tracking-tight text-neutral-800'>
            Nike – Back to School – Q3 2025
          </div>
          {status && (
            <span
              className={`inline-flex h-fit w-fit items-center rounded-full ${getStatusColor(status)?.bg} px-2 py-1 text-xs font-medium ${getStatusColor(status)?.text} capitalize`}
            >
              {status}
            </span>
          )}
        </div>
        <div className='flex gap-x-4'>
          <button onClick={handleExport} className='secondary-btn'>
            Export
          </button>
          <button onClick={handleEdit} className='primary-btn'>
            Edit
          </button>
        </div>
      </div>
      <div>
        Deliverable due <span className='font-semibold'>August 18, 2025</span>
      </div>
    </div>
  );
}
