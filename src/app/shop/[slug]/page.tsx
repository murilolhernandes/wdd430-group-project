import { getProductBySlug, type Product } from '@/app/lib/products';
import AddToCartButton from '@/components/add-to-cart';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { Review } from '@/app/lib/models/Review';
import ReviewForm from '@/components/review-form';
import dbConnect from '@/app/lib/mongodb';
import { Suspense } from 'react';
import mongoose from 'mongoose';
import { Metadata } from 'next';

type ReviewDoc = {
  _id: mongoose.Types.ObjectId;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

type ProductLoadResult = {
  product: Product | null;
  loadError: boolean;
};

async function loadProduct(slug: string): Promise<ProductLoadResult> {
  try {
    return {
      product: await getProductBySlug(slug),
      loadError: false,
    };
  } catch (error) {
    console.error(`Failed to load product "${slug}".`, error);

    return {
      product: null,
      loadError: true,
    };
  }
}

async function getReviews(productId: string) {
  await dbConnect();
  const objectId = new mongoose.Types.ObjectId(productId);
  return await Review.find({ productId: objectId }).sort({ createdAt: -1 });
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  await connection();

  const { slug } = await params;
  const { product, loadError } = await loadProduct(slug);

  if (loadError) {
    return (
      <section className='section-padding min-h-screen'>
        <div className='container-earth max-w-3xl'>
          <div className='earth-card space-y-4 p-8 text-center'>
            <p className='text-sm font-semibold uppercase tracking-[0.2em] text-stone-500'>
              Product unavailable
            </p>

            <h2 className='text-3xl font-semibold text-stone-800'>
              We couldn&apos;t load this product right now.
            </h2>

            <p className='text-stone-600'>
              The detail page is ready, but the product database connection
              still needs attention.
            </p>

            <div className='pt-2'>
              <Link href='/shop' className='earth-button-secondary'>
                Back to collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    notFound();
  }
  
  const productId = product._id;
  const reviews = await getReviews(productId);

  return (
    <section className='section-padding min-h-screen'>
      <div className='container-earth space-y-8'>
        <Link
          href='/shop'
          className='inline-flex items-center rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100'
        >
          Back to collection
        </Link>
        <div>
          <div className='grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start'>
            <div className='flex flex-col gap-4'>
              
              <div className='earth-card overflow-hidden p-4'>
                <div className='overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-stone-100'>
                  <Image
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    width={1200}
                    height={900}
                    sizes='(min-width: 1024px) 52vw, 100vw'
                    className='h-auto w-full object-cover'
                    priority
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-stone-800 border-[var(--border)] pb-4">Customer Reviews</h3>
                <ReviewForm productId={productId} slug={product.slug} />

                <div className="space-y-4">
                  <Suspense>
                    {reviews.length === 0 ? (
                    <p className="text-stone-500 italic">No reviews yet. Be the first to share your thoughts!</p>
                    ) : (
                      reviews.map((review: ReviewDoc) => (
                        <div key={review._id.toString()} className="earth-card p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-stone-800">{review.userName}</p>
                              <p className="text-xs text-stone-400">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-amber-500">
                              {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                            </div>
                          </div>
                          <p className="text-stone-600 mt-4 leading-relaxed">{review.comment}</p>
                        </div>
                      ))
                    )}
                  </Suspense>
                </div>
              </div>
            </div>

            <article className='space-y-6'>
              <div className='space-y-3'>
                <p className='text-sm font-semibold uppercase tracking-[0.2em] text-stone-500'>
                  {product.category}
                </p>

                <div className='flex flex-wrap items-center gap-3'>
                  <h2 className='text-4xl font-bold leading-tight text-stone-800 md:text-5xl'>
                    {product.name}
                  </h2>

                  {product.featured ? (
                    <span className='rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-stone-700'>
                      Featured
                    </span>
                  ) : null}
                </div>

                {product.reviewCount > 0 ? (
                  <div className="flex items-center gap-2 text-amber-500 text-lg">
                    <span>{"★".repeat(Math.round(product.averageRating))}{"☆".repeat(5 - Math.round(product.averageRating))}</span>
                    <span className='text-stone-500 text-sm'>
                      {product.averageRating.toFixed(1)} ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                ) : (
                  <p className='text-sm text-stone-500 italic'>No reviews yet</p>
                )}

                <p className='text-lg text-stone-600'>{product.description}</p>
              </div>

              <div className='earth-card p-6'>
                <p className='text-sm font-semibold uppercase tracking-[0.18em] text-stone-500'>
                  Price
                </p>

                <p className='mt-3 text-4xl font-bold text-stone-800'>
                  {priceFormatter.format(product.price)}
                </p>

                <p className='mt-2 text-sm text-stone-500'>
                  {product.stock > 0
                    ? `${product.stock} pieces ready to ship`
                    : 'Currently unavailable'}
                </p>

                <div className='mt-6'>
                  <AddToCartButton slug={slug} productName={product.name} />
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='earth-card p-6'>
                  <p className='text-xs font-semibold uppercase tracking-[0.18em] text-stone-500'>
                    Artisan
                  </p>
                  <p className='mt-2 text-base text-stone-700'>
                    {product.artisan}
                  </p>
                </div>

                <div className='earth-card p-6'>
                  <p className='text-xs font-semibold uppercase tracking-[0.18em] text-stone-500'>
                    Material
                  </p>
                  <p className='mt-2 text-base text-stone-700'>
                    {product.material}
                  </p>
                </div>

                <div className='earth-card p-6'>
                  <p className='text-xs font-semibold uppercase tracking-[0.18em] text-stone-500'>
                    Shipping
                  </p>
                  <p className='mt-2 text-base text-stone-700'>
                    {product.shippingEstimate}
                  </p>
                </div>

                <div className='earth-card p-6'>
                  <p className='text-xs font-semibold uppercase tracking-[0.18em] text-stone-500'>
                    Availability
                  </p>
                  <p className='mt-2 text-base text-stone-700'>
                    {product.stock > 0
                      ? `${product.stock} ready to ship`
                      : 'Sold out'}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
