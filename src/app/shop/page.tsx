import ItemCard, { type ShopItem } from "@/components/item-card";

const items: ShopItem[] = [
  {
    id: "woven-basket-01",
    name: "River Reed Basket",
    category: "Storage",
    artisan: "Amina Kolade",
    material: "Handwoven reed and natural dye",
    price: 48,
    stock: 7,
    shippingEstimate: "Ships in 2-4 business days",
    imageSrc: "/items/river-reed-basket.svg",
    imageAlt: "Woven reed basket in soft earth tones",
    description:
      "A structured woven basket designed for blankets, books, or entryway essentials.",
    featured: true,
  },
  {
    id: "ceramic-vase-02",
    name: "Clay Hearth Vase",
    category: "Decor",
    artisan: "Micah Santos",
    material: "Stoneware clay with matte glaze",
    price: 64,
    stock: 5,
    shippingEstimate: "Ships in 3-5 business days",
    imageSrc: "/items/clay-hearth-vase.svg",
    imageAlt: "Matte ceramic vase with a rounded silhouette",
    description:
      "A warm-toned ceramic vase that brings texture and calm to shelves, tables, or mantels.",
  },
  {
    id: "linen-throw-03",
    name: "Golden Hour Throw",
    category: "Textiles",
    artisan: "Nora Bennett",
    material: "Washed linen and cotton blend",
    price: 72,
    stock: 9,
    shippingEstimate: "Ships in 1-3 business days",
    imageSrc: "/items/golden-hour-throw.svg",
    imageAlt: "Folded linen throw with stitched edging",
    description:
      "A lightweight throw with subtle texture, perfect for cozy living spaces and guest rooms.",
    featured: true,
  },
  {
    id: "wood-board-04",
    name: "Olive Wood Serving Board",
    category: "Kitchen",
    artisan: "Daniel Okeke",
    material: "Olive wood with food-safe finish",
    price: 56,
    stock: 4,
    shippingEstimate: "Ships in 2-4 business days",
    imageSrc: "/items/olive-wood-serving-board.svg",
    imageAlt: "Olive wood serving board with visible grain",
    description:
      "A handcrafted board for serving bread, fruit, or cheeses with a natural organic finish.",
  },
  {
    id: "candle-holder-05",
    name: "Sandstone Candle Holder",
    category: "Decor",
    artisan: "Leah Morgan",
    material: "Carved sandstone",
    price: 34,
    stock: 11,
    shippingEstimate: "Ships in 2-3 business days",
    imageSrc: "/items/sandstone-candle-holder.svg",
    imageAlt: "Stone candle holder with a lit candle",
    description:
      "A compact accent piece that adds warmth and an earthy sculptural touch to any room.",
  },
  {
    id: "planter-06",
    name: "Terracotta Window Planter",
    category: "Garden",
    artisan: "Moses Hale",
    material: "Terracotta with sealed interior",
    price: 44,
    stock: 6,
    shippingEstimate: "Ships in 3-5 business days",
    imageSrc: "/items/terracotta-window-planter.svg",
    imageAlt: "Terracotta window planter with green leaves",
    description:
      "A rustic planter sized for kitchen herbs, succulents, or a bright windowsill display.",
  },
];

const categoryCount = new Set(items.map((item) => item.category)).size;
const readyToShipCount = items.filter((item) => item.stock > 0).length;

export default async function ShopPage() {
  return (
    <div>
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
              This shop page uses dummy inventory for now, but the layout is
              ready for real product records when we connect Postgres later.
              Click any item to open more details.
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
                Reusable item cards backed by dummy data for the first pass of
                the shop.
              </p>
            </div>

            <p className="text-sm font-medium text-stone-500">
              Click an item card to expand its details.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
