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
    <div className="container-earth section-padding min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className='text-4xl font-bold mb-10 text-center'>
          Create a Product Listing!
        </h1>
        <Suspense fallback={<div>Loading form...</div>}>
          <AddListingForm />
        </Suspense>
      </div>
    </div>
  );
}