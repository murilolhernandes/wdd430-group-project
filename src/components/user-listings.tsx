'use client'

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteListing } from '@/app/lib/actions';
import Image from 'next/image';
import Link from 'next/link';

type Listing = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  imageSrc: string;
  slug: string;
};

export default function UserListings({ initialProducts }: { initialProducts: Listing[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this listing? This cannot be undone.")) return;
    
    setIsDeleting(id);
    await deleteListing(id);
    setIsDeleting(null);
  };

  return (
    <div className="earth-card p-6">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between outline-none"
      >
        <div className="text-left">
          <h2 className="text-xl font-bold text-stone-900">Your Product Listings</h2>
          <p className="text-sm text-stone-500 mt-1">Manage your active inventory ({initialProducts.length} items)</p>
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="h-6 w-6 text-stone-500" />
        ) : (
          <ChevronDownIcon className="h-6 w-6 text-stone-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-6">
          {initialProducts.length === 0 ? (
            <p className="text-stone-500 italic text-center py-4">You haven&apos;t added any products yet.</p>
          ) : (
            <div className="overflow-hidden rounded-md border border-stone-200">
              <table className="min-w-full divide-y divide-stone-200">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">Stock</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-stone-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {initialProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-stone-50 transition-colors">
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 relative rounded bg-stone-100 overflow-hidden">
                            <Image src={product.imageSrc} alt={product.name} fill className="object-cover" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-stone-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-stone-500">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-stone-500">
                        {product.stock}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <Link href={`/edit-listing/${product._id}`} className="text-stone-400 hover:text-stone-900 transition-colors">
                            <PencilSquareIcon className="text-stone-400 h-5 w-5 transition-colors hover:text-stone-800" />
                          </Link>
                          
                          <button 
                            onClick={() => handleDelete(product._id)}
                            disabled={isDeleting === product._id}
                            className="text-stone-400 hover:text-red-600 cursor-pointer transition-colors disabled:opacity-50"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}