'use client'

import { ArrowRightIcon, ExclamationCircleIcon, CurrencyDollarIcon, TruckIcon, PhotoIcon, TagIcon, LinkIcon, Square2StackIcon, CubeIcon, PencilSquareIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import { useActionState } from 'react';
import { addListing } from '@/app/lib/actions';

export default function AddListingForm() {
  const [state, formAction, isPending] = useActionState(addListing, undefined);
  

  return (
    <div className='earth-card flex-1 p-8 mt-10'>
      <form action={formAction} className='w-full mx-auto'>
        <div>
          <label className='mb-3 mt-5 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='name'>
            Name of the Product
          </label>
          <div className='relative'>
            <input
              className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
              id='name' type='text' name='name' placeholder='Enter the material of the product. (E.g. "River Reed Basket")' required
              defaultValue={state?.fields?.name || ''}
              />
            <TagIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
          </div>
        </div>
        <div>
          <label className='mb-3 mt-5 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='slug'>
            Slug
          </label>
          <div className='relative'>
            <input
              className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
              id='slug' type='text' name='slug' placeholder='Enter the slug of the product. (E.g "river-reed-basket")' required
              defaultValue={state?.fields?.slug || ''}
            />
            <LinkIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
          </div>
        </div>
        <div>
          <label className='mb-3 mt-5 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='category'>
            Category
          </label>
          <div className='relative'>
            <input
              className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
              id='category' type='text' name='category' placeholder='Enter the gategory of the product. (E.g. "Storage")' required
              defaultValue={state?.fields?.category || ''}
              />
            <Square2StackIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
          </div>
        </div>
        <div>
          <label className='mb-3 mt-5 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='description'>
            Product Description
          </label>
          <div className='relative'>
            <textarea
              rows={2}
              name='description'
              id='description'
              defaultValue={state?.fields?.description || ''}
              placeholder='Enter the description of the product. (E.g. "A structured woven basket designed for blankets, books, or entryway essentials.")' required
              className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
              />
              <PencilSquareIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
          </div>
        </div>
        <div>
          <label className='mb-3 mt-5 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='imageSrc'>
            Image
          </label>
          <div className='relative'>
            <input
              className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200'
              id='imageSrc' type='file' name='imageSrc' required
              accept='image/jpeg, image/png, image/webp, image/svg+xml, image/svg'
              />
            <PhotoIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
          </div>
        </div>
        <div>
          <label className='mb-3 mt-5 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='imageAlt'>
            Image Description
          </label>
          <div className='relative'>
            <input
              className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
              id='imageAlt' type='text' name='imageAlt' placeholder='Enter the image description of the product. (E.g. "Woven reed basket in soft earth tones")' required
              defaultValue={state?.fields?.imageAlt || ''}
              />
            <PencilSquareIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
          </div>
        </div>
        <div>
          <label className='mb-3 mt-5 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='material'>
            Material
          </label>
          <div className='relative'>
            <input
              className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
              id='material' type='text' name='material' placeholder='Enter the material of the product. (E.g. "Handwoven reed and natural dye")' required
              defaultValue={state?.fields?.material || ''}
              />
            <CubeIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className='mb-3 mt-5 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='price'>
              Price
            </label>
            <div className='relative'>
              <input
                className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
                id='price' type='number' name='price' placeholder='Enter the price of the product. (E.g. "48")' required
                defaultValue={state?.fields?.price || ''}
                />
              <CurrencyDollarIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
            </div>
          </div>
          <div>
            <label className='mb-3 mt-5 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='stock'>
              Stock
            </label>
            <div className='relative'>
              <input
                className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
                id='stock' type='number' name='stock' placeholder='Enter the stock quantity of the product. (E.g. "7")' required
                defaultValue={state?.fields?.material || ''}
                />
              <CircleStackIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
            </div>
          </div>
        </div>
        <div>
          <label className='mb-3 mt-5 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='shippingEstimate'>
            Shipping Estimate
          </label>
          <div className='relative'>
            <input
              className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
              id='shippingEstimate' type='text' name='shippingEstimate' placeholder='Enter the shipping estimate of the product. (E.g. "Ships in 2-4 business days")' required
              defaultValue={state?.fields?.shippingEstimate || ''}
              />
            <TruckIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button 
            type="submit"
            className="earth-button-primary mt-6 w-full flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending ? 'Creating Listing...' : 'Submit your Product'}
            <ArrowRightIcon className='h-5 w-5' />
          </button>
        </div>
        <div
            className='flex items-center space-x-1 empty:hidden mt-2'
            aria-live='polite'
            aria-atomic='true'
          >
            {state?.message && (
              <>
                <ExclamationCircleIcon className='h-5 w-5 text-red-500' />
                <p className='text-sm text-red-500'>{state.message}</p>
              </>
            )}
          </div>
      </form>
    </div>
  );
}