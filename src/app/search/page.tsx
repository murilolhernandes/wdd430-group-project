'use client'
 
import { useSearchParams } from 'next/navigation'
 
export default function SearchResults() {
  const searchParams = useSearchParams()
 
  const search = searchParams.get('q')
 
  return <>Search: {search}</>
}