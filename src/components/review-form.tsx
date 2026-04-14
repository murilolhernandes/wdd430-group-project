'use client'

import { useState } from "react";
import { submitReview } from "@/app/lib/actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="earth-button-primary w-full disabled:opacity-50"
    >
      {pending ? 'Submitting...' : 'Post Review'}
    </button>
  );
}

export default function ReviewForm({ productId, slug }: { productId: string; slug: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function clientAction(formData: FormData) {
    if (rating === 0) {
      setMessage({ type: 'error', text: 'Please select a rating.' });
      return;
    }

    formData.append('productId', productId);
    formData.append('rating', rating.toString());

    formData.append('slug', slug);
    
    const result = await submitReview(formData);

    if (result?.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Review submitted successfully!' });
      setRating(0);
      (document.getElementById('review-form') as HTMLFormElement).reset();
    }
  }

  return (
    <div className="earth-card p-6">
      <h3 className="text-xl font-bold text-stone-800 mb-4">Leave a Review</h3>
      
      <form id="review-form" action={clientAction} className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">Rating</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-2xl transition ${
                  (hover || rating) >= star ? 'text-amber-500' : 'text-stone-300'
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
            Your Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            required
            rows={4}
            className="mt-2 block w-full rounded-xl border border-stone-200 p-3 text-stone-700 focus:border-stone-500 focus:ring-stone-500"
            placeholder="What did you think of this piece?"
          />
        </div>

        {message && (
          <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}