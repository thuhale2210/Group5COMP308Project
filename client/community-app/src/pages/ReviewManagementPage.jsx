import { gql, useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';

const GET_REVIEWS = gql`
  query($businessId: ID!) {
    getReviews(businessId: $businessId) {
      id
      comment
      businessResponse {
        text
      }
    }
  }
`;

const RESPOND_TO_REVIEW = gql`
  mutation($reviewId: ID!, $responseText: String!) {
    respondToReview(reviewId: $reviewId, responseText: $responseText) {
      id
      businessResponse {
        text
      }
    }
  }
`;

export default function ReviewManagementPage({ businessId }) {
    const { data, refetch } = useQuery(GET_REVIEWS, { variables: { businessId } });
    const [respond] = useMutation(RESPOND_TO_REVIEW);
    const [text, setText] = useState('');
    const [activeReview, setActiveReview] = useState(null);

    const handleRespond = async () => {
        await respond({ variables: { reviewId: activeReview, responseText: text } });
        setText('');
        setActiveReview(null);
        refetch();
    };

    return (
      <div className="space-y-4 mt-6">
      {data?.getReviews.map((r) => (
        <div key={r.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow">
          <p className="text-zinc-300">{r.comment}</p>
    
          {r.businessResponse?.text ? (
            <p className="text-sm text-emerald-400 mt-2 border-l-4 border-emerald-500 pl-3">
              <strong className="text-emerald-300">Response:</strong> {r.businessResponse.text}
            </p>
          ) : (
            <button
              onClick={() => setActiveReview(r.id)}
              className="mt-3 text-sm text-blue-400 hover:underline transition"
            >
              Respond
            </button>
          )}
        </div>
      ))}
    
      {activeReview && (
        <div className="mt-6 bg-zinc-800 p-4 rounded-xl border border-zinc-700">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 rounded-md bg-zinc-900 text-white border border-zinc-700 placeholder-zinc-500 resize-none"
            placeholder="Type your response..."
            rows={3}
          />
          <button
            onClick={handleRespond}
            className="mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            Send
          </button>
        </div>
      )}
    </div>
    
    );
}
