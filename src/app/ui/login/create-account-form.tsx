'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useActionState } from 'react';
import { authenticate, googleAuthenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';


export default function CreateAccountForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/'; // Not sure where to redirect to yet.
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div className='space-y-3'>
      <div className='earth-card flex-1 p-8'>
        <h1 className='mb-6 text-2xl font-bold text-stone-800'>
          Please create an account to continue.
        </h1>

        <form action={formAction} className='w-full'>
          <div>
            <label className='mb-3 mt-5 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='email'>
              Email
            </label>
            <div className='relative'>
              <input
                className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
                id='email' type='email' name='email' placeholder='Enter your email address' required
              />
              <AtSymbolIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
            </div>
          </div>
          <div className='mt-4'>
            <label className='mb-3 mt-5 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='password'>
              Password
            </label>
            <div className='relative'>
              <input
                className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
                id='password' type='password' name='password' placeholder='Enter your password' required minLength={6}
              />
              <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
            </div>
          </div>

          <input type='hidden' name='redirectTo' value={callbackUrl} />

          <button
            type='submit'
            className='earth-button-primary mt-6 w-full flex items-center justify-center gap-2'
            aria-disabled={isPending}
            disabled={isPending}
          >
            {isPending ? 'Logging in...' : 'Log in'} <ArrowRightIcon className='h-5 w-5' />
          </button>

          <div className='flex items-center space-x-1 empty:hidden mt-2' aria-live='polite' aria-atomic='true'>
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </form>

        <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-stone-200'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='bg-white px-2 text-stone-500'>Or</span>
          </div>
        </div>

        <form action={googleAuthenticate}>
          <button
            type='submit'
            className='w-full flex items-center justify-center gap-3 bg-white border border-stone-300 rounded-md p-3 text-stone-700 hover:bg-stone-50 transition-colors font-medium shadow-sm cursor-pointer'
          >
            <svg className='w-5 h-5' viewBox='0 0 24 24'>
            <path
              d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              fill='#4285F4'
            />
            <path
              d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              fill='#34A853'
            />
            <path
              d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              fill='#FBBC05'
            />
            <path
              d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              fill='#EA4335'
            />
            </svg>
            Sign in with Google
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-stone-600'>
          Already have an account?{' '}
          <Link href='/login' className='font-semibold text-stone-800 hover:underline'>
            Log in!
          </Link>
        </p>
    </div>
  </div>
  );
}
