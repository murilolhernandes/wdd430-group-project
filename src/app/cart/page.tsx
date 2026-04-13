import { getProducts } from '@/app/lib/products';
import CartClient from './cart-client';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const products = await getProducts();
  return (
    <div className='container-earth space-y-8'>
      <section className='section-padding min-h-screen'>
        <CartClient products={products} />
      </section>
    </div>
  );
}

// Gotta fix the background color
