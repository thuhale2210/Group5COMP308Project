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
        <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border"
                placeholder="Your review..."
            />
            <input
                type="number"
                value={rating}
                min={1}
                max={5}
                onChange={(e) => setRating(+e.target.value)}
                className="p-1 border w-20"
            />
            <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded">
                Submit
            </button>
        </form>
    );
}
