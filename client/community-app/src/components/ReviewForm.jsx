import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { StarIcon } from '@heroicons/react/20/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

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
      await createReview({ variables: { business: businessId, rating, comment } });
      setComment('');
      alert('✅ Review submitted!');
    } catch (err) {
      console.error('Review submission failed:', err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white/5 p-6 rounded-2xl shadow-md"
    >
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-3 rounded-xl bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        placeholder="Write your review..."
        rows={4}
      />

      <div className="flex items-center gap-3">
        <label className="text-sm text-zinc-300 font-medium">Rating:</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= rating;
            const Icon = isFilled ? StarIcon : StarOutline;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="bg-transparent p-1 rounded-md focus:outline-none hover:scale-110 transition"
              >
                <Icon
                  className={`w-6 h-6 ${star <= rating ? 'text-yellow-400' : 'text-zinc-500'
                    }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white font-medium py-2 rounded-xl shadow transition"
      >
        Submit Review
      </button>
    </form>
  );
}