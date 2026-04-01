import HeroImage from '@/components/hero-image';
import CreateAccountForm from '@/app/ui/login/create-account-form';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign up',
};

export default function LoginPage() {
  return (
    <div className='flex w-full items-center justify-center p-4 py-16 md:py-24'>
      <div className='flex w-full max-w-5xl flex-col items-center gap-8 md:flex-row md:items-stretch md:gap-12'>
        <div className="relative flex w-full flex-1 items-center justify-center overflow-hidden rounded-2xl md:w-1/2">
          <HeroImage />
        </div>
        <div className="flex w-full max-w-[450px] flex-col justify-center md:w-1/2">
          <Suspense>
            <CreateAccountForm />
          </Suspense>
        </div>
      </div >
    </div>
  );
}