import Image from "next/image";

export type ShopItem = {
  id: string;
  name: string;
  category: string;
  artisan: string;
  material: string;
  price: number;
  stock: number;
  shippingEstimate: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  featured?: boolean;
};

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type ItemCardProps = {
  item: ShopItem;
};

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <details className="earth-card h-full overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <summary className="list-none cursor-pointer p-6 [&::-webkit-details-marker]:hidden">
        <div className="flex h-full flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                {item.category}
              </p>
              <h3 className="text-2xl font-semibold text-stone-800">
                {item.name}
              </h3>
            </div>

            {item.featured ? (
              <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-stone-700">
                Featured
              </span>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-stone-100">
            <Image
              src={item.imageSrc}
              alt={item.imageAlt}
              width={800}
              height={600}
              sizes="(min-width: 1280px) 26vw, (min-width: 768px) 44vw, 100vw"
              className="h-auto w-full object-cover"
            />
          </div>

          <p className="text-sm text-stone-600">{item.description}</p>

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-2xl font-semibold text-stone-800">
                {priceFormatter.format(item.price)}
              </p>
              <p className="text-sm text-stone-500">{item.stock} pieces left</p>
            </div>

            <span className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-stone-700">
              Click for details
            </span>
          </div>
        </div>
      </summary>

      <div className="border-t border-[var(--border)] bg-stone-50/80 p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Artisan
            </dt>
            <dd className="mt-2 text-base text-stone-700">{item.artisan}</dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Material
            </dt>
            <dd className="mt-2 text-base text-stone-700">{item.material}</dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Availability
            </dt>
            <dd className="mt-2 text-base text-stone-700">
              {item.stock} ready to ship
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Shipping
            </dt>
            <dd className="mt-2 text-base text-stone-700">
              {item.shippingEstimate}
            </dd>
          </div>
        </dl>
      </div>
    </details>
  );
}
