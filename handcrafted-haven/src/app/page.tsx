import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Hero Section */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        {/* Text */}
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
            Handmade • Warm • Unique
          </p>

          <h2 className="mb-6 text-4xl font-bold leading-tight text-stone-800 md:text-6xl">
            Beautiful handcrafted goods for meaningful spaces.
          </h2>

          <p className="mb-8 max-w-xl text-lg leading-8 text-stone-600">
            Discover handmade pieces created with care by skilled artisans.
            Bring warmth, character, and craftsmanship into your home.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-amber-800 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-amber-900"
            >
              Create Account
            </Link>

            <Link
              href="/shop"
              className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-50"
            >
              Explore Collection
            </Link>
          </div>
        </div>

        {/* Hero Placeholder */}
        <div className="relative">
          <div className="flex h-[420px] w-full items-center justify-center rounded-[2rem] border border-stone-200 bg-stone-200 shadow-xl">
            <span className="text-lg font-medium text-stone-500">
              Hero Image Placeholder
            </span>
          </div>

          {/* Decorative accent card */}
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-stone-200 bg-white px-6 py-4 shadow-lg md:block">
            <p className="text-sm text-stone-500">Featured Style</p>
            <p className="font-semibold text-stone-800">Earthy & Timeless</p>
          </div>
        </div>
      </section>

      {/* Simple feature section */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-semibold text-stone-800">
              Artisan Made
            </h3>
            <p className="text-stone-600">
              Every item is crafted with care and attention to detail.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-semibold text-stone-800">
              Natural Style
            </h3>
            <p className="text-stone-600">
              Warm textures and timeless pieces that fit any home.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-semibold text-stone-800">
              Support Makers
            </h3>
            <p className="text-stone-600">
              Help small creators share their work with more people.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}