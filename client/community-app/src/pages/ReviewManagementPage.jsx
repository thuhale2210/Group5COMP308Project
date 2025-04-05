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
        <div className="space-y-4">
            {data?.getReviews.map((r) => (
                <div key={r.id} className="border p-2 rounded">
                    <p>{r.comment}</p>
                    {r.businessResponse?.text ? (
                        <p className="text-sm text-gray-600">Response: {r.businessResponse.text}</p>
                    ) : (
                        <button onClick={() => setActiveReview(r.id)} className="text-blue-500">Respond</button>
                    )}
                </div>
            ))}

            {activeReview && (
                <div className="mt-4">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full p-2 border"
                        placeholder="Type your response..."
                    />
                    <button onClick={handleRespond} className="mt-2 px-3 py-1 bg-green-500 text-white rounded">Send</button>
                </div>
            )}
        </div>
    );
}
