'use client'

import { ArrowRightIcon, UserCircleIcon, ExclamationCircleIcon, CurrencyDollarIcon, TruckIcon, PhotoIcon, TagIcon, LinkIcon, Square2StackIcon, CubeIcon, PencilSquareIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import { useActionState } from 'react';
import { updateListing } from '@/app/lib/actions';
import Image from 'next/image';

type ProductListing = {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  material: string;
  price: number;
  shippingEstimate: string;
  stock: number;
  artisan: string;
};

export default function EditListingForm({ listing, isAdmin }: { listing: ProductListing, isAdmin?: boolean }) {
  const updateListingWithId = updateListing.bind(null, listing._id, listing.imageSrc);
  const [state, formAction, isPending] = useActionState(updateListingWithId, {});

  return (
    <div className='earth-card flex-1 p-8 mt-2'>
      <form action={formAction} className='w-full mx-auto'>
        
        <div className="mb-6 flex flex-col items-center justify-center p-4 bg-stone-50 rounded-lg border border-stone-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">Current Image</p>
          <div className="relative h-32 w-32 rounded-md overflow-hidden shadow-sm">
            <Image src={listing.imageSrc} alt={listing.imageAlt} fill className="object-cover" />
          </div>
        </div>
        {isAdmin && (
          <div>
            <label className='mb-3 block text-xs font-semibold uppercase tracking-wider text-red-500' htmlFor='artisan'>
              Admin: Edit Artisan Name
            </label>
            <div className='relative mb-5'>
              <input
                className='peer block w-full rounded-md border border-red-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-red-800 focus:ring-red-800'
                id='artisan' type='text' name='artisan' required
                defaultValue={listing.artisan}
              />
              <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-red-400 peer-focus:text-red-800' />
            </div>
          </div>
        )}
        <div>
          <label className='mb-3 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='name'>
            Name of the Product
          </label>
          <div className='relative mb-5'>
            <input
              className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
              id='name' type='text' name='name' required
              defaultValue={listing.name}
              placeholder='Enter the material of the product. (E.g. "River Reed Basket")'
            />
            <TagIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
          </div>
        </div>

        <div>
          <label className='mb-3 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='slug'>
            Slug
          </label>
          <div className='relative mb-5'>
            <input
              className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
              id='slug' type='text' name='slug' required
              defaultValue={listing.slug}
              placeholder='Enter the slug of the product. (E.g "river-reed-basket")'
            />
            <LinkIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
          </div>
        </div>

        <div>
          <label className='mb-3 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='category'>
            Category
          </label>
          <div className='relative mb-5'>
            <input
              className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
              id='category' type='text' name='category' required
              defaultValue={listing.category}
              placeholder='Enter the gategory of the product. (E.g. "Storage")'
            />
            <Square2StackIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
          </div>
        </div>

        <div>
          <label className='mb-3 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='description'>
            Product Description
          </label>
          <div className='relative mb-5'>
            <textarea
              rows={2} name='description' id='description' required
              defaultValue={listing.description}
              className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
              placeholder='Enter the description of the product. (E.g. "A structured woven basket designed for blankets, books, or entryway essentials.")'
            />
            <PencilSquareIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
          </div>
        </div>

        <div>
          <label className='mb-3 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='imageSrc'>
            Upload New Image (Optional)
          </label>
          <div className='relative mb-5'>
            <input
              className='peer block w-full rounded-md border border-stone-200 py-[6px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200'
              id='imageSrc' type='file' name='imageSrc' 
              accept='image/jpeg, image/png, image/webp, image/svg+xml'
            />
            <PhotoIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
          </div>
        </div>

        <div>
          <label className='mb-3 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='imageAlt'>
            Image Description
          </label>
          <div className='relative mb-5'>
            <input
              className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
              id='imageAlt' type='text' name='imageAlt' required
              defaultValue={listing.imageAlt}
              placeholder='Enter the image description of the product. (E.g. "Woven reed basket in soft earth tones")'
            />
            <PencilSquareIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
          </div>
        </div>

        <div>
          <label className='mb-3 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='material'>
            Material
          </label>
          <div className='relative mb-5'>
            <input
              className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
              id='material' type='text' name='material' required
              defaultValue={listing.material}
              placeholder='Enter the material of the product. (E.g. "Handwoven reed and natural dye")'
            />
            <CubeIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className='mb-3 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='price'>
              Price
            </label>
            <div className='relative mb-5'>
              <input
                className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
                id='price' type='number' name='price' step="0.01" required
                defaultValue={listing.price}
                placeholder='Enter the price of the product. (E.g. "48")'
              />
              <CurrencyDollarIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
            </div>
          </div>
          <div>
            <label className='mb-3 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='stock'>
              Stock
            </label>
            <div className='relative mb-5'>
              <input
                className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
                id='stock' type='number' name='stock' required
                defaultValue={listing.stock}
                placeholder='Enter the stock quantity of the product. (E.g. "7")'
              />
              <CircleStackIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-stone-400 peer-focus:text-stone-800' />
            </div>
          </div>
        </div>

        <div>
          <label className='mb-3 block text-xs font-semibold uppercase tracking-wider text-stone-500' htmlFor='shippingEstimate'>
            Shipping Estimate
          </label>
          <div className='relative mb-5'>
            <input
              className='peer block w-full rounded-md border border-stone-200 py-[9px] pl-10 text-sm text-stone-900 outline-2 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-800'
              id='shippingEstimate' type='text' name='shippingEstimate' required
              defaultValue={listing.shippingEstimate}
              placeholder='Enter the shipping estimate of the product. (E.g. "Ships in 2-4 business days")'
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
            {isPending ? 'Saving Changes...' : 'Save Changes'}
            <ArrowRightIcon className='h-5 w-5' />
          </button>
        </div>
        
        <div className='flex items-center space-x-1 empty:hidden mt-2' aria-live='polite' aria-atomic='true'>
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