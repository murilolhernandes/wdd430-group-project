import ItemCard from "@/components/item-card";
import FilterBar from "@/components/filter-bar";
import { getProducts, type Product } from "@/lib/products";
import { connection } from "next/server";
import { Suspense } from "react";

type CatalogLoadResult = {
  items: Product[];
  loadError: boolean;
};

async function loadCatalog(): Promise<CatalogLoadResult> {
  try {
    return {
      items: await getProducts(),
      loadError: false,
    };
  } catch (error) {
    console.error("Failed to load product catalog.", error);
    return { items: [], loadError: true };
  }
}

/** Filter products in memory based on URL search params. */
function filterProducts(
  items: Product[],
  {
    q,
    category,
    inStock,
  }: { q: string; category: string; inStock: boolean }
): Product[] {
  const query = q.trim().toLowerCase();

  return items.filter((item) => {
    // Full-text search across name, description, artisan, material, category
    if (query) {
      const haystack = [
        item.name,
        item.description,
        item.artisan,
        item.material,
        item.category,
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    // Category filter
    if (category && item.category !== category) return false;

    // In-stock filter
    if (inStock && item.stock <= 0) return false;

    return true;
  });
}

type ShopPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  await connection();

  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";
  const inStock = params.inStock === "1";

  const hasActiveFilters = !!(q || category || inStock);

  const { items, loadError } = await loadCatalog();

  const allCategories = [...new Set(items.map((item) => item.category))].sort();
  const filtered = filterProducts(items, { q, category, inStock });

  const categoryCount = new Set(filtered.map((item) => item.category)).size;
  const readyToShipCount = filtered.filter((item) => item.stock > 0).length;

  return (
    <div className="min-h-screen">
      {!hasActiveFilters && <section className="section-padding">
        <div className="container-earth space-y-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Curated handmade collection
            </p>

            <h2 className="text-4xl font-bold leading-tight text-stone-800 md:text-5xl">
              Browse thoughtful pieces made to bring warmth into everyday
              spaces.
            </h2>

            <p className="mt-6 text-lg text-stone-600">
              This shop page now reads product records from MongoDB. Click any
              item to open its dedicated product page.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="earth-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                Items
              </p>
              <p className="mt-3 text-3xl font-bold text-stone-800">
                {filtered.length}
              </p>
            </div>

            <div className="earth-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                Categories
              </p>
              <p className="mt-3 text-3xl font-bold text-stone-800">
                {categoryCount}
              </p>
            </div>

            <div className="earth-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                Ready To Ship
              </p>
              <p className="mt-3 text-3xl font-bold text-stone-800">
                {readyToShipCount}
              </p>
            </div>
          </div>
        </div>
      </section>}

      <section className="px-6 pb-20">
        <div className="container-earth space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="text-3xl font-semibold text-stone-800">
                Available items
              </h3>
              <p className="mt-2 text-stone-600">
                Product cards now route into their own dedicated detail pages.
              </p>
            </div>

            {!loadError && (
              <p className="text-sm font-medium text-stone-500">
                {items.length
                  ? "Click a product card to open its full details page."
                  : "Seed the products collection to start filling the shop."}
              </p>
            )}
          </div>

          {/* Filter bar — wrapped in Suspense because it reads useSearchParams */}
          {!loadError && items.length > 0 && (
            <Suspense>
              <FilterBar
                categories={allCategories}
                totalCount={items.length}
                filteredCount={filtered.length}
              />
            </Suspense>
          )}

          {loadError ? (
            <div className="earth-card p-8 text-center">
              <h4 className="text-2xl font-semibold text-stone-800">
                Product catalog unavailable
              </h4>
              <p className="mt-3 text-stone-600">
                We couldn&apos;t load the MongoDB catalog yet. Once the database
                connection is ready, this page will show the live product
                listing automatically.
              </p>
            </div>
          ) : filtered.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <ItemCard key={item.slug} item={item} />
              ))}
            </div>
          ) : items.length ? (
            <div className="earth-card p-8 text-center">
              <h4 className="text-2xl font-semibold text-stone-800">
                No products match your filters
              </h4>
              <p className="mt-3 text-stone-600">
                Try adjusting your search or clearing the filters to see all
                items.
              </p>
            </div>
          ) : (
            <div className="earth-card p-8 text-center">
              <h4 className="text-2xl font-semibold text-stone-800">
                No products have been seeded yet
              </h4>
              <p className="mt-3 text-stone-600">
                Run <code>npm run seed:products</code> after the MongoDB
                connection is ready to populate the products collection.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}