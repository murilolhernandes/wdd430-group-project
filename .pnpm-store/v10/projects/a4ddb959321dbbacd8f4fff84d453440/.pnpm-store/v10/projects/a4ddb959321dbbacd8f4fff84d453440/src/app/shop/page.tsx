import ItemCard from "@/components/item-card";
import { getProducts, type Product } from "@/lib/products";
import { connection } from "next/server";

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

    return {
      items: [],
      loadError: true,
    };
  }
}

export default async function ShopPage() {
  await connection();

  const { items, loadError } = await loadCatalog();
  const categoryCount = new Set(items.map((item) => item.category)).size;
  const readyToShipCount = items.filter((item) => item.stock > 0).length;

  return (
    <div className="min-h-screen">
      <section className="section-padding">
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
                {items.length}
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
      </section>

      <section className="px-6 pb-20">
        <div className="container-earth">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="text-3xl font-semibold text-stone-800">
                Available items
              </h3>
              <p className="mt-2 text-stone-600">
                Product cards now route into their own dedicated detail pages.
              </p>
            </div>

            <p className="text-sm font-medium text-stone-500">
              {loadError
                ? "Catalog unavailable while the product database connection is being set up."
                : items.length
                  ? "Click a product card to open its full details page."
                  : "Seed the products collection to start filling the shop."}
            </p>
          </div>

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
          ) : items.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <ItemCard key={item.slug} item={item} />
              ))}
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
