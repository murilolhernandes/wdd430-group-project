import AddListingForm from '../ui/add-listing/add-listing-form';
import { auth } from '@/auth'; 
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Listing',
};

export default async function AddListingPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className='flex w-full items-center justify-center p-4 py-16 md:py-24'>
      <div className='flex w-full max-w-5xl flex-col items-center gap-8 md:flex-row md:items-stretch md:gap-12'>
        <div className="flex w-full max-w-[450px] flex-col justify-center md:w-1/2">
          <Suspense fallback={<div>Loading form...</div>}>
            <AddListingForm />
          </Suspense>
        </div>
      </div >
    </div>
  );
}