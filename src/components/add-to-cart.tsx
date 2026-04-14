'use client'

import { useCart } from "./cart-provider"

type AddToCartButtonProps = {
  slug: string;
  productName: string;
};

export default function AddToCartButton({ slug, productName }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(slug, 1);
    console.log(`Added ${productName} to cart!`);
  };

  return (
    <button
      onClick={handleAddToCart}
      type="button"
      className="earth-button-primary pointer-events-auto px-5 py-2 text-sm"
    >
      Add to cart
    </button>
  )
}