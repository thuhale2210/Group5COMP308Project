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
      <div className="space-y-4 mt-6">
      {data.getReviews.map((r) => (
        <div key={r.id} className="bg-zinc-900 p-4 rounded-xl shadow border border-zinc-800">
          <p className="font-semibold text-yellow-400 text-lg mb-1">⭐ {r.rating}</p>
          <p className="text-zinc-300">{r.comment}</p>
    
          {r.businessResponse?.text && (
            <div className="mt-3 text-sm text-emerald-400 border-l-4 border-emerald-500 pl-3">
              <strong className="text-emerald-300">Owner Response:</strong> {r.businessResponse.text}
            </div>
          )}
        </div>
      ))}
    </div>
    
    );
}