import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREATE_REVIEW = gql`
  mutation($business: ID!, $rating: Int!, $comment: String!) {
    createReview(business: $business, rating: $rating, comment: $comment) {
      id
    }
  }
`;

export default function ReviewForm({ businessId }) {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5);
    const [createReview] = useMutation(CREATE_REVIEW);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createReview({
                variables: {
                    business: businessId,
                    rating,
                    comment,
                }
            });
            setComment('');
            alert('✅ Review submitted!');
        } catch (err) {
            console.error('Review submission failed:', err.message);
        }
    };

    return (
<form onSubmit={handleSubmit} className="space-y-4 bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-md mt-6">
  <textarea
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    className="w-full p-3 rounded-md bg-zinc-800 text-white border border-zinc-700 placeholder-zinc-500 resize-none"
    placeholder="Your review..."
    rows={4}
  />
  <div className="flex items-center gap-4">
    <label className="text-zinc-300 font-medium">Rating:</label>
    <input
      type="number"
      value={rating}
      min={1}
      max={5}
      onChange={(e) => setRating(+e.target.value)}
      className="p-2 w-24 rounded bg-zinc-800 text-white border border-zinc-700"
    />
  </div>
  <button
    type="submit"
    className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
  >
    Submit Review
  </button>
</form>

    );
}
