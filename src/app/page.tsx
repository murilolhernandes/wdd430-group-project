import Link from "next/link";
import HeroImage from "@/components/hero-image";
import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();

  return (
      <div>
      <section className="section-padding">
        <div className="container-earth grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Handmade • Warm • Timeless
            </p>

            <h2 className="mb-6 text-4xl font-bold leading-tight text-stone-800 md:text-6xl">
              Beautiful handcrafted goods for meaningful spaces.
            </h2>

            <p className="mb-8 max-w-xl text-lg text-stone-600">
              Discover handmade pieces created with care by skilled artisans.
              Bring warmth, character, and craftsmanship into your home.
            </p>

            <div className="flex flex-wrap gap-4">
              {session?.user ? (
                <Link href='/account-info' className='earth-button-primary text-sm'>
                  Account
                </Link>
              ) : (
                <Link href="/create-account" className="earth-button-primary">
                  Create Account
                </Link>
              )}
              

              <Link href="/shop" className="earth-button-secondary">
                Explore Collection
              </Link>
            </div>
          </div>

          <div className="hero-placeholder relative flex items-center justify-center min-h-[400px] md:min-h-[500px]">
            <HeroImage />
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="container-earth grid gap-6 md:grid-cols-3">
          <div className="earth-card p-6">
            <h3 className="mb-2 text-xl font-semibold">Artisan Made</h3>
            <p className="text-stone-600">
              Every item is crafted with care and attention to detail.
            </p>
          </div>

          <div className="earth-card p-6">
            <h3 className="mb-2 text-xl font-semibold">Natural Style</h3>
            <p className="text-stone-600">
              Warm textures and timeless pieces that fit any home.
            </p>
          </div>

          <div className="earth-card p-6">
            <h3 className="mb-2 text-xl font-semibold">Support Makers</h3>
            <p className="text-stone-600">
              Help small creators share their work with more people.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
