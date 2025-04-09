import { gql, useQuery } from '@apollo/client';

const GET_REVIEWS = gql`
  query($businessId: ID!) {
    getReviews(businessId: $businessId) {
      id
      rating
      comment
      businessResponse {
        text
        respondedAt
      }
    }
  }
`;

export default function ReviewList({ businessId }) {
    const { loading, error, data } = useQuery(GET_REVIEWS, { variables: { businessId } });
    if (loading) return <p>Loading reviews...</p>;
    if (error) return <p>Error loading reviews.</p>;

    return (
        <div className="space-y-4">
            {data.getReviews.map((r) => (
                <div key={r.id} className="border p-2 rounded">
                    <p className="font-semibold">⭐ {r.rating}</p>
                    <p>{r.comment}</p>
                    {r.businessResponse?.text && (
                        <div className="mt-2 text-sm text-gray-700">
                            <strong>Owner:</strong> {r.businessResponse.text}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}