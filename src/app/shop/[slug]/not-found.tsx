import Footer from "@/components/footer";
import Header from "@/components/header";
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div>
      <Header />

      <main className="min-h-screen">
        <section className="section-padding">
          <div className="container-earth max-w-3xl">
            <div className="earth-card space-y-4 p-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                Product not found
              </p>

              <h2 className="text-3xl font-semibold text-stone-800">
                That product isn&apos;t in the catalog.
              </h2>

              <p className="text-stone-600">
                Head back to the collection to browse the available handcrafted
                pieces.
              </p>

              <div className="pt-2">
                <Link href="/shop" className="earth-button-secondary">
                  Back to collection
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
