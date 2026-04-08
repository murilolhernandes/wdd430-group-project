import { getProductBySlug, type Product } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
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

export default async function ProductPage({ params }: ProductPageProps) {
  await connection();

  const { slug } = await params;
  const { product, loadError } = await loadProduct(slug);

  if (loadError) {
    return (
      <section className="section-padding min-h-screen">
        <div className="container-earth max-w-3xl">
          <div className="earth-card space-y-4 p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Product unavailable
            </p>

            <h2 className="text-3xl font-semibold text-stone-800">
              We couldn&apos;t load this product right now.
            </h2>

            <p className="text-stone-600">
              The detail page is ready, but the product database connection
              still needs attention.
            </p>

            <div className="pt-2">
              <Link href="/shop" className="earth-button-secondary">
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

  return (
    <section className="section-padding min-h-screen">
      <div className="container-earth space-y-8">
        <Link
          href="/shop"
          className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
        >
          Back to collection
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="earth-card overflow-hidden p-4">
            <div className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-stone-100">
              <Image
                src={product.imageSrc}
                alt={product.imageAlt}
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>

          <article className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                {product.category}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-4xl font-bold leading-tight text-stone-800 md:text-5xl">
                  {product.name}
                </h2>

                {product.featured ? (
                  <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-stone-700">
                    Featured
                  </span>
                ) : null}
              </div>

              <p className="text-lg text-stone-600">{product.description}</p>
            </div>

            <div className="earth-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                Price
              </p>

              <p className="mt-3 text-4xl font-bold text-stone-800">
                {priceFormatter.format(product.price)}
              </p>

              <p className="mt-2 text-sm text-stone-500">
                {product.stock > 0
                  ? `${product.stock} pieces ready to ship`
                  : "Currently unavailable"}
              </p>

              <div className="mt-6">
                <button
                  type="button"
                  className="earth-button-primary inline-flex items-center justify-center px-6 py-3 text-sm"
                >
                  Add to cart
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="earth-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Artisan
                </p>
                <p className="mt-2 text-base text-stone-700">
                  {product.artisan}
                </p>
              </div>

              <div className="earth-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Material
                </p>
                <p className="mt-2 text-base text-stone-700">
                  {product.material}
                </p>
              </div>

              <div className="earth-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Shipping
                </p>
                <p className="mt-2 text-base text-stone-700">
                  {product.shippingEstimate}
                </p>
              </div>

              <div className="earth-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Availability
                </p>
                <p className="mt-2 text-base text-stone-700">
                  {product.stock > 0 ? `${product.stock} ready to ship` : "Sold out"}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
