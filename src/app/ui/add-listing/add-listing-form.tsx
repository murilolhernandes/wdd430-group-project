'use client'

import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useActionState, useState } from 'react';
import { addListing } from '@/app/lib/actions';
import Link from 'next/link';


export default function AddListingForm() {
  const [state, formAction, isPending] = useActionState(addListing, undefined);

  return (
    <div></div>
  )
}