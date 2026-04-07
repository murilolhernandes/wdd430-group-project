import HeroImage from "@/components/hero-image";
import LoginForm from '@/app/ui/login/login-form';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Login',
};

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect('/account-info');
  }
  
  return (
    <div className='flex w-full items-center justify-center p-4 py-16 md:py-24'>
      <div className='flex w-full max-w-5xl flex-col items-center gap-8 md:flex-row md:items-stretch md:gap-12'>
        <div className="relative hidden w-full flex-1 items-center justify-center overflow-hidden rounded-2xl md:flex md:w-1/2">
          <HeroImage />
        </div>
        <div className="flex w-full max-w-[450px] flex-col justify-center md:w-1/2">
          <Suspense fallback={<div>Loading form...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div >
    </div>
  );
}
